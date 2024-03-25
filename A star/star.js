
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Устанавливаем ширину и высоту лабиринта
let width = 500;
let height = 500;
canvas.width = width;
canvas.height = height;

// Задаем размер ячейки
const cellSize = 20;
let rows = Math.floor(width / cellSize);//вводим сами
let cols = Math.floor(height / cellSize);//вводим сами

// Создаем двумерный массив для представления лабиринта
let maze = [];
for (let i = 0; i < rows; i++) {
    maze[i] = [];
    for (let j = 0; j < cols; j++) {
        maze[i][j] = true;
    }
}

// Рекурсивная функция для создания лабиринта
function createMaze(row, col) {
    maze[row][col] = false;

    let directions = ['top', 'right', 'bottom', 'left'];
    directions = directions.sort(function() {
        return 0.5 - Math.random();
    });

    for (let i = 0; i < directions.length; i++) {
        switch (directions[i]) {
            case 'top':
                if (row - 2 <= 0) continue;
                if (maze[row - 2][col]) {
                    maze[row - 1][col] = false;
                    createMaze(row - 2, col);
                }
                break;
            case 'right':
                if (col + 2 >= cols - 1) continue;
                if (maze[row][col + 2]) {
                    maze[row][col + 1] = false;
                    createMaze(row, col + 2);
                }
                break;
            case 'bottom':
                if (row + 2 >= rows - 1) continue;
                if (maze[row + 2][col]) {
                    maze[row + 1][col] = false;
                    createMaze(row + 2, col);
                }
                break;
            case 'left':
                if (col - 2 <= 0) continue;
                if (maze[row][col - 2]) {
                    maze[row][col - 1] = false;
                    createMaze(row, col - 2);
                }
                break;
        }
    }
}

createMaze(1, 1);

// Отрисовка лабиринта на холсте


for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        if (maze[i][j]) {
            context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

