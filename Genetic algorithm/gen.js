let isAlgorithmRunning = false;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

function clean() {
    location.reload();
    isAlgorithmRunning = false;
}

function show(menu) {
    let element = document.getElementById(menu);
    if (element) {
        element.style.display = "block";
    }
}

let dots = [];
let size = 700;
let chromosomeLength;

function wait(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function randomNumber(min, max) { // рандом число
    return Math.floor(Math.random() * (max - min) + min);
}

function twoRandomNumbers(min, max) { // два рандомных числа
    let first = Math.floor(Math.random() * (max - min) + min);
    let second = Math.floor(Math.random() * (max - min) + min);

    while (first === second) {
        first = Math.floor(Math.random() * (max - min) + min);
    }

    return [first, second];
}

function mix(array) { // перемешиваем рандомно
    let mixedArray = array.slice()
    for (let i = 0; i < dots.length - 1; i++) {
        let random1 = randomNumber(1, dots.length - 1);
        let random2 = randomNumber(1, dots.length - 1);
        [mixedArray[random1], mixedArray[random2]] = [mixedArray[random2], mixedArray[random1]];
    }
    return mixedArray.slice();
}

function comparing(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

function drawingDots(color) // рисуем точки
{
    for (let i = 0; i < dots.length; ++i) {
        context.beginPath();
        context.arc(dots[i][0], dots[i][1], 10, 0, 2 * Math.PI, false);
        context.fillStyle = color;
        context.fill();
    }
}

canvas.addEventListener('click', function (event) // добавляются точки в dots + соединяются все линии между собой
{
    if (!isAlgorithmRunning) {
        let rect = canvas.getBoundingClientRect();
        let clientX = event.clientX - rect.left;
        let clientY = event.clientY - rect.top;
        context.beginPath();
        if (dots.length >= 1) {
            for (let dot of dots) {
                let dotX = dot[0];
                let dotY = dot[1];

                context.moveTo(dotX, dotY);
                context.lineTo(clientX, clientY);
                context.strokeStyle = "#EEE8AA";
                context.stroke();
            }
        }
        context.beginPath();
        context.arc(clientX, clientY, 10, 0, Math.PI * 2);
        context.fillStyle = '#CD5C5C';
        context.fill();
        dots.push([clientX, clientY]);
        drawingDots('#CD5C5C');
    }
});

function lines(from, to) {
    from.splice(from.length - 1, 0, from[0].slice());
    to.splice(to.length - 1, 0, to[0].slice());

    for (let i = 0; i < from.length - 1; i++) {
        context.beginPath();

        let array = [from[i + 1][0] - from[i][0], from[i + 1][1] - from[i][1]];

        let len = Math.sqrt(array[0] * array[0] + array[1] * array[1]);

        context.moveTo(from[i][0] + array[0] / len, from[i][1] + array[1]/ len);
        context.lineTo(from[i + 1][0] - array[0]/ len, from[i + 1][1] - array[1] / len);

        context.strokeStyle = "rgb(255,255,255)";
        context.lineWidth = 2;


        context.stroke();
        

        context.moveTo(from[i][0] + array[0] / len, from[i][1] + array[1] / len);
        context.lineTo(from[i + 1][0] - array[0]/ len, from[i + 1][1] - array[1]/ len);

        context.strokeStyle = "#EEE8AA";
        context.lineWidth = 0.5;

        context.stroke()
    }

    for (let j = 0; j < to.length - 1; j++) {
        context.beginPath();
        
        let array = [to[j + 1][0] - to[j][0], to[j + 1][1] - to[j][1]];

        let len = Math.sqrt(array[0] * array[0] + array[1] * array[1]);

        context.moveTo(to[j][0] + array[0] / len, to[j][1] + array[1] / len);
        context.lineTo(to[j + 1][0] - array[0]  / len, to[j + 1][1] - array[1] / len);

        context.strokeStyle = "rgb(204, 25, 12)";
        context.lineWidth = 0.5;

        context.stroke();
    }
}

function drawPathSegment(startPoint, endPoint, strokeWidth, strokeColor) {
    let vector = [endPoint[0] - startPoint[0], endPoint[1] - startPoint[1]];
    let length = Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
    let offsetVector = [vector[0] / length, vector[1] / length];

    context.beginPath();

    context.moveTo(startPoint[0] + offsetVector[0], startPoint[1] + offsetVector[1]);
    context.lineTo(endPoint[0] - offsetVector[0], endPoint[1] - offsetVector[1]);

    context.strokeStyle = strokeColor;
    context.lineWidth = strokeWidth;

    context.stroke();
}

function best(path, color) {
    path.splice(path.length - 1, 0, path[0].slice()); // дублируем первую точку перед последней

    for (let i = 0; i < path.length - 2; ++i) {
        drawPathSegment(path[i], path[i + 1], 1, color);
    }

    drawingDots('#CD5C5C');
}

function sortPopulationByLastElement(population) {
    population.sort((a, b) => a[a.length - 1] - b[b.length - 1]);
}

function start(startingGen) {
    let result = [];
    let buffer = startingGen.slice();

    buffer.push(pathLength(buffer));
    result.push(buffer.slice());

    for (let i = 0; i < dots.length * dots.length; ++i) {
        buffer = startingGen.slice();
        buffer = mix(buffer)
        buffer.push(pathLength(buffer));
        result.push(buffer.slice())
    }
    return result;
}

function pathLength(chromosome) {
    let len = 0;

    for (let i = 0; i < chromosome.length - 1; i++) {
        len += Math.sqrt(Math.pow(chromosome[i][0] - chromosome[i + 1][0], 2) + Math.pow(chromosome[i][1] - chromosome[i + 1][1], 2));
    }
    len += Math.sqrt(Math.pow(chromosome[chromosome.length - 1][0] - chromosome[0][0], 2) + Math.pow(chromosome[chromosome.length - 1][1] - chromosome[0][1], 2));

    return len;
}

function add(population, chromosome) {
    if (!population.length) {
        population.push(chromosome.slice());
    }
    else {
        let flag = false
        for (let i = 0; i < population.length; ++i) {
            if (chromosome[chromosome.length - 1] < population[i][population[i].length - 1]) {
                population.splice(i, 0, chromosome);
                flag = true;
                break;
            }
        }
        if (!flag) {
            population.push(chromosome.slice());
        }
    }
}

function toCross(parent1, parent2) {
    let i1 = randomNumber(0, parent1.length);
    let i2 = randomNumber(i1 + 1, parent1.length);

    let child = parent1.slice(i1, i2 + 1);

    for (let k of parent2) {
        if (!child.includes(k)) {
            child.push(k);
        }
    }

    if (Math.random() * 100 < 50) {
        let rand = twoRandomNumbers(1, chromosomeLength);

        let i = rand[0];
        let j = rand[1];

        [child[i], child[j]] = [child[j], child[i]];
    }

    return child;
}

function crossing(parent1, parent2) {
    let child1 = toCross(parent1, parent2);
    let child2 = toCross(parent1, parent2);

    child1.push(pathLength(child1.slice()))
    child2.push(pathLength(child2.slice()))

    return [child1, child2];
}

async function geneticAlg() {
    if (!isAlgorithmRunning) {
        let ending = 800;

        let startingGen = dots;

        chromosomeLength = startingGen.length;

        let population = start(startingGen);
        sortPopulationByLastElement(population); // фитнесс-функция

        let bestChromosome = population[0].slice();


        for (let i = 0; i < 1000000; i++) {
            await wait(0);

            isAlgorithmRunning = true;

            drawingDots('#CD5C5C');

            if (ending === 0) {
                best(bestChromosome, "rgb(28, 158, 16)");

                break;
            }

            population = population.slice(0, dots.length * dots.length);

            for (let j = 0; j < dots.length * dots.length; j++) // цикл создания новых детей для следующего поколения
            {
                let i1 = randomNumber(0, population.length), i2 = randomNumber(0, population.length); // случайные индексы для родителей

                let parent1 = population[i1].slice(0, population[i1].length - 1); // выбор первого и второго родителей
                let parent2 = population[i2].slice(0, population[i2].length - 1);

                let child = crossing(parent1, parent2);

                population.push(child[0].slice())
                population.push(child[1].slice())
            }

            sortPopulationByLastElement(population);  // после добавления новых потомков

            if (!comparing(bestChromosome, population[0])) {
                lines(bestChromosome, population[0]);
                bestChromosome = population[0].slice();
                ending = 800;
            }

            if (i % 200 === 0)
                ending -= 200;
        }
    }
    else {
        alert("Нажмите Сброс");
    }
}