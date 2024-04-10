function show(menu)
{
    let element=document.getElementById(menu);
    if(element)
    {
        element.style.display="block";
    }

}

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

let dots = []; // массив для координат точек
let size = 700;
let lengthOfChromosome; 
let numberOfGenerations = 100000;
let chanceOfMutation = 30;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function twoRandomNumbers(min, max) {
    let first = Math.floor(Math.random() * (max - min) + min);
    let second = Math.floor(Math.random() * (max - min) + min);

    while (first === second) {
        first = Math.floor(Math.random() * (max - min) + min);
    }
    
    return [first, second];
}

function mix(array) {
    let mixedArray = array.slice()
    for (let i = 0; i < dots.length - 1; i++) {
        let random1 = randomNumber(1, dots.length - 1);
        let random2 = randomNumber(1, dots.length - 1);
        [mixedArray[random1], mixedArray[random2]] = [mixedArray[random2], mixedArray[random1]];
    }
    return mixedArray.slice();
}

function drawingDots(color) { // рисуем точки
    for (let i = 0; i < dots.length; ++i) {
        context.beginPath();
        context.arc(dots[i][0], dots[i][1], 15, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
    }
}

canvas.addEventListener('click', function (e) { // добавляются точки в dots + соединяются все линии между собой
    let userX = e.pageX - e.target.offsetLeft;

    let userY = e.pageY - e.target.offsetTop;


    context.beginPath();

    if (dots.length >= 1) {
        for (let i of dots) {
            let dotX = i[0];
            let dotY = i[1];

            let arr = [userX - dotX, userY - dotY];

            let s = Math.sqrt(arr[0] * arr[0] + arr[1] * arr[1]);

            context.moveTo(dotX + arr[0] * 10 / s, dotY + arr[1] * 10 / s);

            context.lineTo(userX, userY);
            context.strokeStyle = "#EEE8AA";
            context.stroke();
        }
    }

    dots.push([userX, userY]);
    drawingDots('#CD5C5C');
});

function drawLine(points, color, lineWidth) {
    for (let i = 0; i < points.length - 1; i++) {
        context.beginPath();

        let arr = [points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1]];
        let len = Math.sqrt(arr[0] * arr[0] + arr[1] * arr[1]); // пифагор ван лав

        context.moveTo(points[i][0] + arr[0] * 10 / len, points[i][1] + arr[1] * 10 / len);
        context.lineTo(points[i + 1][0] - arr[0] * 10 / len, points[i + 1][1] - arr[1] * 10 / len);

        context.strokeStyle = color;
        context.lineWidth = lineWidth;

        context.stroke();
    }
}

function drawTheLines(from, to) {
    from.splice(from.length - 1, 0, from[0].slice());
    drawLine(from, "rgb(255,255,255)", 1); 
    drawLine(from, "rgba(243,243,243,0.34)", 1); 

    to.splice(to.length - 1, 0, to[0].slice());
    drawLine(to, "rgb(250,142,142)", 1); 
}

function drawPathSegment(startPoint, endPoint, strokeWidth, strokeColor) {
    let vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    let length = Math.sqrt(vector[0]**2 + vector[1]**2);
    let offsetVector = [vector[0] * 10 / length, vector[1] * 10 / length];

    context.beginPath();
    context.moveTo(startPoint[0] + offsetVector[0], startPoint[1] + offsetVector[1]);
    context.lineTo(endPoint[0] - offsetVector[0], endPoint[1] - offsetVector[1]);
    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;
    context.stroke();
}

function drawBest(bestPath, color) {
    console.log(bestPath.slice()); // выводим копию исходного пути
    bestPath.splice(bestPath.length - 1, 0, bestPath[0].slice()); // дублируем первую точку перед последней
    console.log(bestPath.slice()); // выводим изменённый путь

    for (let i = 0; i < bestPath.length - 2; ++i) {
        drawPathSegment(bestPath[i], bestPath[i + 1], 1, color);
    }
    drawingDots('#611F1F');
}

function startPopulation(firstGeneration) {
    let result = [];
    let buffer = firstGeneration.slice();

    buffer.push(distance(buffer));
    result.push(buffer.slice());

    for (let i = 0; i < dots.length * dots.length; ++i) {
        buffer = firstGeneration.slice();
        buffer = mix(buffer)
        buffer.push(distance(buffer));
        result.push(buffer.slice())
    }
    return result;
}

function addToPopulation(population, chromosome) {
    if (!population.length) {
        population.push(chromosome.slice());
    }
    else {
        let added = false
        for (let i = 0; i < population.length; ++i) {
            if (chromosome[chromosome.length - 1] < population[i][population[i].length - 1]) {
                population.splice(i, 0, chromosome);
                added = true;
                break;
            }
        }
        if (!added) {
            population.push(chromosome.slice());
        }
    }
}

function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function distance(chromosome) {
    let ans = 0;
    for (let i = 0; i < chromosome.length - 1; ++i) {
        ans += Math.sqrt(Math.pow(chromosome[i][0] - chromosome[i + 1][0], 2) + Math.pow(chromosome[i][1] - chromosome[i + 1][1], 2));
    }
    ans += Math.sqrt(Math.pow(chromosome[chromosome.length - 1][0] - chromosome[0][0], 2) + Math.pow(chromosome[chromosome.length - 1][1] - chromosome[0][1], 2));
    return ans;
}

function cross(firstParent, secondParent) {
    let child = [];
    let index1 = randomNumber(0, firstParent.length);
    let index2 = randomNumber(index1 + 1, firstParent.length);
    child = firstParent.slice(index1, index2 + 1);

    for (let num of secondParent) {
        if (!child.includes(num)) {
            child.push(num);
        }
    }

    if (Math.random() * 100 < chanceOfMutation) {
        let rand = twoRandomNumbers(1, lengthOfChromosome);
        let i = rand[0], j = rand[1];
        [child[i], child[j]] = [child[j], child[i]];
    }

    return child;
}

function crossingParents(firstParent, secondParent) {
    let firstChild = cross(firstParent, secondParent);
    let secondChild = cross(firstParent, secondParent);

    firstChild.push(distance(firstChild.slice()))
    secondChild.push(distance(secondChild.slice()))
    return [firstChild, secondChild];
}

// Объявление асинхронной функции geneticAlg
async function geneticAlg() {
    // Инициализация первого поколения как пустого массива
    let firstGeneration = [];
    // Установка значения для условия окончания алгоритма
    let end = 500;

    // Копирование данных из массива dots в первое поколение
    for (let i = 0; i < dots.length; ++i) {
        firstGeneration.push(dots[i]);
    }
    // Задание длины хромосомы равной длине первого поколения
    lengthOfChromosome = firstGeneration.length;

    // Создание начальной популяции из первого поколения
    let population = startPopulation(firstGeneration);
    // Сортировка популяции по фитнес-функции (последнему элементу хромосомы)
    population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1] }));

    // Выбор лучшей хромосомы из отсортированной популяции
    let bestChromosome = population[0].slice();
    // Отрисовка лучшей хромосомы цветом rgb(250,142,142)
    drawBest(bestChromosome, "rgb(250,142,142)")

    // Основной цикл, прогоняющийся numberOfGenerations раз
    for (let i = 0; i < numberOfGenerations; ++i) {
        // Проверка условия окончания алгоритма
        if (end === 0) {
            // Отрисовка лучшей хромосомы цветом rgb(142,250,142) в случае завершения
            drawBest(bestChromosome, "rgb(142,250,142)");
            break;
        }

        // Уменьшение размера популяции до установленного лимита
        population = population.slice(0, dots.length * dots.length);

        // Цикл создания новых детей для следующего поколения
        for (let j = 0; j < dots.length * dots.length; ++j) {
            // Выбор случайных индексов для родителей
            let index1 = randomNumber(0, population.length);
            let index2 = randomNumber(0, population.length);
            // Выбор первого и второго родителя
            let firstParent = population[index1].slice(0, population[index1].length - 1);
            let secondParent = population[index2].slice(0, population[index2].length - 1);

            // Создание потомков (детей) от двух родителей
            let child = crossingParents(firstParent, secondParent);
            // Добавление потомков в популяцию
            population.push(child[0].slice())
            population.push(child[1].slice())
        }

        // Сортировка популяции после добавления новых потомков
        population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1] }));

        // Проверка, изменилась ли лучшая хромосома
        if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])) {
            // Отрисовка изменений между старой и новой лучшей хромосомой
            drawTheLines(bestChromosome, population[0])
            // Обновление лучшей хромосомы
            bestChromosome = population[0].slice();
            // Сброс счетчика для условия окончания
            end = 500;
        }

        // Логирование каждый 100-й генерации и уменьшение счетчика окончания
        if (i % 100 === 0) {
            console.log(i);
            end -= 100;
        }

        // Отрисовка точек на канвасе
        drawingDots();
        // Пауза в выполнении для визуализации промежуточных результатов
        await wait(0);
    }
}


async function geneticAlg() {
    let firstGeneration = []; // первое поколение
    let end = 500; // условие окончания алгоритма

    for (let i = 0; i < dots.length; i++) {
        firstGeneration.push(dots[i]); // копия из dots в первое поколение
    }
    
    lengthOfChromosome = firstGeneration.length; // длина хромосомы 

    
    let population = startPopulation(firstGeneration); // создание начальной популяции из первого поколения
   
    population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1] })); // сортировка популяции по фитнес-функции (последнему элементу хромосомы)

    
    let bestChromosome = population[0].slice(); // выбор лучшей хромосомы из отсортированной популяции
    
    drawBest(bestChromosome, "rgb(250,142,142)") // Отрисовка лучшей хромосомы цветом rgb(250,142,142)

    
    for (let i = 0; i < numberOfGenerations; ++i) {
        if (end === 0) { // проверка условия окончания алгоритма
            drawBest(bestChromosome, "rgb(128, 0, 128");
            break;
        }

        // Уменьшение размера популяции до установленного лимита
        population = population.slice(0, dots.length * dots.length);

        // Цикл создания новых детей для следующего поколения
        for (let j = 0; j < dots.length * dots.length; ++j) {
            // Выбор случайных индексов для родителей
            let index1 = randomNumber(0, population.length);
            let index2 = randomNumber(0, population.length);
            // Выбор первого и второго родителя
            let firstParent = population[index1].slice(0, population[index1].length - 1);
            let secondParent = population[index2].slice(0, population[index2].length - 1);

            // Создание потомков (детей) от двух родителей
            let child = crossingParents(firstParent, secondParent);
            // Добавление потомков в популяцию
            population.push(child[0].slice())
            population.push(child[1].slice())
        }

        // Сортировка популяции после добавления новых потомков
        population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1] }));

        // Проверка, изменилась ли лучшая хромосома
        if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])) {
            // Отрисовка изменений между старой и новой лучшей хромосомой
            drawTheLines(bestChromosome, population[0])
            // Обновление лучшей хромосомы
            bestChromosome = population[0].slice();
            // Сброс счетчика для условия окончания
            end = 500;
        }

        // Логирование каждый 100-й генерации и уменьшение счетчика окончания
        if (i % 100 === 0) {
            console.log(i);
            end -= 100;
        }

        // Отрисовка точек на канвасе
        drawingDots();
        // Пауза в выполнении для визуализации промежуточных результатов
        await wait(0);
    }
}

function clean()
{
    location.reload();
}

// async function geneticAlg() {
//     let firstGeneration = [];
//     let end = 500;

//     for (let i = 0; i < dots.length; ++i) {
//         firstGeneration.push(dots[i]);
//     }
//     lengthOfChromosome = firstGeneration.length;

//     let population = startPopulation(firstGeneration);
//     population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1] }));

//     let bestChromosome = population[0].slice();
//     drawBest(bestChromosome, "rgb(250,142,142)")

//     for (let i = 0; i < numberOfGenerations; ++i) {
//         if (end === 0) {
//             drawBest(bestChromosome, "rgb(142,250,142)");
//             break;
//         }

//         population = population.slice(0, dots.length * dots.length);

//         for (let j = 0; j < dots.length * dots.length; ++j) {
//             let index1 = randomNumber(0, population.length);
//             let index2 = randomNumber(0, population.length);
//             let firstParent = population[index1].slice(0, population[index1].length - 1);
//             let secondParent = population[index2].slice(0, population[index2].length - 1);

//             let child = crossingParents(firstParent, secondParent);
//             population.push(child[0].slice())
//             population.push(child[1].slice())
//         }

//         population.sort((function (a, b) { return a[a.length - 1] - b[b.length - 1] }));

//         if (JSON.stringify(bestChromosome) !== JSON.stringify(population[0])) {
//             drawTheLines(bestChromosome, population[0])
//             bestChromosome = population[0].slice();
//             end = 500;
//         }

//         if (i % 100 === 0) {
//             console.log(i);
//             end -= 100;
//         }

//         drawingDots();
//         await wait(0);
//     }
// }