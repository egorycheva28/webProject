document.getElementById('map');
let map=[];
let start;
let end;
function GenerationMap()
{
    
}
function onClickButton()
{
    document.write('вы нажали на меня');
}
function SearchPath()
{
    
}


const cells = []; // создаём массив ячеек лабиринта

for (let x = 0; x < N; x++) {
    cells[x] = [];
    for (let y = 0; y < N; y++) {
        cells[x][y] = null;
    }
}

class CellMaze { // класс, который создается для каждой ячейки
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visited = false;
        this.walls = {
            top: true,
            right: true,
            bottom: true,
            left: true,
        };
    }

    show() { // здесь рисуются стены у ячейки
        const x = this.x * cellSize;
        const y = this.y * cellSize;

        pen.beginPath();

        if (this.walls.top) { // рисуем стену наверху
            pen.moveTo(x, y);
            pen.lineTo(x + cellSize, y);
        }

        if (this.walls.right) { // рисуем стену справа
            pen.moveTo(x + cellSize, y);
            pen.lineTo(x + cellSize, y + cellSize);
        }

        if (this.walls.bottom) { // рисуем стену снизу
            pen.moveTo(x + cellSize, y + cellSize);
            pen.lineTo(x, y + cellSize);
        }

        if (this.walls.left) { // // рисуем стену слева
            pen.moveTo(x, y + cellSize);
            pen.lineTo(x, y);
        }
        pen.strokeStyle = 'green'; // далее стиль ячейки (переделаем)
        pen.lineWidth = 5;
        pen.lineCap = "round";
        pen.stroke();
    }
}

function setup() { // инициализация каждой ячейки лабиринта
    for (let x = 0; x < N; x++) {
        for (let y = 0; y < N; y++) {
            cells[x][y] = new CellMaze(x, y);
        }
    }
    generation(0, 0);
}

function generation(x, y) { // генерируем лабиринт
    const currCell = cells[x][y]; // копируем текущую ячейку
    currCell.visited = true; // отмечаем посещенную ячейку

    const directions = randomize(['top', 'right', 'bottom', 'left']);

    for (let i = 0; i < directions.length; i++) {
        let dx, dy;

        if (directions[i] === 'top') { // смещение
            dx = 0;
            dy = -1;
        } else if (directions[i] === 'right') {
            dx = 1;
            dy = 0;
        } else if (directions[i] === 'bottom') {
            dx = 0;
            dy = 1;
        } else if (directions[i] === 'left') {
            dx = -1;
            dy = 0;
        }


        const newX = x + dx;
        const newY = y + dy;

        if (newX >= 0 && newX < N // проверяем вышли ли мы за границы или нет
            && newY >= 0 && newY < N) {
            const neighbour = cells[newX][newY];

            if (!neighbour.visited) { // убираем стены
                currCell.walls[directions[i]] = false; // у текущей ячейки удаляем стену в напрвалении i

                if (i === 'top') { // у соседней ячейки удаляем стену в противоположном направлении i
                    neighbour.walls['bottom'] = false;
                } else if (i === 'right') {
                    neighbour.walls['left'] = false;
                } else if (i === 'bottom') {
                    neighbour.walls['top'] = false;
                } else if (i === 'left') {
                    neighbour.walls['right'] = false;
                }

                generation(newX, newY); // рекурсия для всех ячеек лабиринта
            }
        }
    }
    generatedMaze = cells.map(row => row.map(cell => ({ ...cell }))); // клонируем

    solutionPath = solution();
}

function solution() {
    var visited = new Array(N); // создаем массив из N элементов

    for (let i = 0; i < N; i++) {
        visited[i] = new Array(N); // для каждой строки создаем массив из N элементов
        for (let j = 0; j < N; j++) {
            visited[i][j] = false; // инициализируем каждый элемент значением false
        }
    }

    const path = [];

    function dfs(x, y) { // поиск в глубину
        if (x < 0 || x >= N || y < 0 ||
            y >= N || visited[y][x]) {
            return false;
        }

        visited[y][x] = true;
        path.push({ x, y });

        if (x === N - 1 && y === N - 1) {
            return true;
        }

        const cell = generatedMaze[x][y];

        if (!cell.walls.top && dfs(x, y - 1)) {
            return true;
        }
        if (!cell.walls.right && dfs(x + 1, y)) {
            return true;
        }
        if (!cell.walls.bottom && dfs(x, y + 1)) {
            return true;
        }
        if (!cell.walls.left && dfs(x - 1, y)) {
            return true;
        }

        path.pop();
        return false;
    }

    dfs(0, 0);
    return path;
}
