
function generation()
{
    const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let input = document.querySelector('input');
let n=input.value;
// Устанавливаем ширину и высоту лабиринта
let width = 500;
let height = 500;
canvas.width = width;
canvas.height = height;

// Задаем размер ячейки
const cellSize = Math.floor(width /n);
let rows = Math.floor(n);//вводим сами
let cols = Math.floor(n);//вводим сами

// Создаем двумерный массив для представления лабиринта
let maze = [];
for (let i = 0; i < rows; i++)
 {
    maze[i] = [];
    for (let j = 0; j < cols; j++) 
    {
        maze[i][j] = true;
    }
}

// Рекурсивная функция для создания лабиринта
function createMaze(row, col) 
{
    maze[row][col] = false;

    let directions = ['top', 'bottom', 'right', 'left'];
    directions = directions.sort(function() 
    {
        return 0.5-Math.random();
    });

    for (let i = 0; i < directions.length; i++) 
    {
        switch (directions[i]) 
        {
            case 'top':
                if (row - 2 <= 0)
                {
                     continue;
                }
                if (maze[row - 2][col]) 
                {
                    maze[row - 1][col] = false;
                    createMaze(row - 2, col);
                }
                break;

            case 'bottom':
                if (row + 2 >= rows - 1)
                {
                    continue;
                }
                if (maze[row + 2][col]) 
                {
                    maze[row + 1][col] = false;
                    createMaze(row + 2, col);
                }
                break;

            case 'right':
                if (col + 2 >= cols - 1) 
                {
                    continue;
                }
                if (maze[row][col + 2]) 
                {
                    maze[row][col + 1] = false;
                    createMaze(row, col + 2);
                }
                break;

            case 'left':
                if (col - 2 <= 0) 
                {
                    continue;
                }
                if (maze[row][col - 2])
                {
                    maze[row][col - 1] = false;
                    createMaze(row, col - 2);
                }
                break;
        }
    }
}

createMaze(1, 1);

// Отрисовка лабиринта на холсте


    
for (let i = 0; i < rows; i++) 
{
    for (let j = 0; j < cols; j++) 
    {
        if (maze[i][j])
        {
            context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}
}
/*const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const width = 500;
const height = 500;
const cellSize = 20;

canvas.width = width;
canvas.height = height;
const cols = Math.floor(width / cellSize);
const rows = Math.floor(height / cellSize);
function drawWall(x, y)
{
    context.beginPath();
    context.fillStyle = 'black';
    context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize);
    context.closePath();
}
for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
        if (Math.random() > 0.5) { //вероятность появления стены
            //context.fillStyle = 'black';
            drawWall(x, y);
        }
    }
}*/
/*function generateMaze(x, y, width, height) 
{
    if (width < 20 || height < 20) 
    {
      return;
    }

  // рисуем горизонтальную стену
    const horizontal = Math.floor(Math.random() * (height - 1)) + y;
    drawWall(x, horizontal * cellSize, width*cellSize, cellSize);

  // рисуем вертикальную стену
    const vertical = Math.floor(Math.random() * (width - 1)) + x;
    drawWall(vertical * cellSize, y, cellSize, height*cellSize);

    generateMaze(x, y, vertical - x + 1, horizontal - y + 1);
    generateMaze(vertical + 1, y, width - (vertical - x) - 1, horizontal - y + 1);
    generateMaze(x, horizontal + 1, vertical - x + 1, height - (horizontal - y) - 1);
    generateMaze(vertical + 1, horizontal + 1, width - (vertical - x) - 1, height - (horizontal - y) - 1);
}*/

//generateMaze(0, 0, width, height);
/*function solution() {
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
}*/
