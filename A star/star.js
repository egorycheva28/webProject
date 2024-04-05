function show(menu)
{
    let el=document.getElementById(menu);
    if(el)
    {
        el.style.display="block";
    }
    
}
let maze=[[]];
function generation()
{
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let input = document.querySelector('input');
let n=input.value;
// Устанавливаем ширину и высоту лабиринта
let width = 700;
let height = 700;
canvas.width = width;
canvas.height = height;

// Задаем размер ячейки
const cellSize =Math.floor(width/n);
let rows = n;
let cols = n;

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
        context.strokeStyle="black";
        context.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        if (maze[i][j])
        {
            context.fillStyle="black";
            context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}
return maze;
}

function blockClick(event)
{
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');
    let rect = canvas.getBoundingClientRect();
    let input = document.querySelector('input');
    let n=input.value;
    let width = 500;
    let height = 500;
    const cellSize =Math.floor(width/n);

    let x = Math.floor((event.clientX - rect.left) / cellSize);
    let y = Math.floor((event.clientY - rect.top) / cellSize);

    drawCell(cellSize,context, x*cellSize, y*cellSize);
}

function drawCell(cellSize,context, x, y)
{
    /*switch(context.fillStyle)
    {
        case "white":
            context.fillStyle="black";
            break;
        case "black":
            context.fillStyle="white";
            break;
        
    }*/

    for(let i=0;i<rows;i++)
    {
    if (context.fillStyle === "white") 
    {
        context.fillStyle = "black";
    } 
    else
    {
        context.fillStyle = "white";
    }
    }
    context.fillRect(x, y, cellSize, cellSize);
}

let flag=0;

function clickCells()
{
    let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let rect = canvas.getBoundingClientRect();
        let input = document.querySelector('input');
        let n=input.value;
        let width = 700;
        let height = 700;
        const cellSize =Math.floor(width/n);
    if(flag==0)
    {
        
    canvas.addEventListener('click', function(event) {
        

        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);
        let startX=x*cellSize;
        let startY=y*cellSize;
        
        context.fillStyle = 'green';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        maze[x][y]=1;//начало пути
    });
    flag=1;
    }
    else if(flag==1){
        canvas.addEventListener('click', function(event) {
            
    
            const x = Math.floor((event.clientX - rect.left) / cellSize);
            const y = Math.floor((event.clientY - rect.top) / cellSize);
            let endX=x*cellSize;
            let endY=y*cellSize;
            
            context.fillStyle = 'red';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y]=1;//конец пути
        });
        flag=2;
    }
    else {
    canvas.addEventListener('click', function(event) {
        

        let x = Math.floor((event.clientX - rect.left) / cellSize);
        let y = Math.floor((event.clientY - rect.top) / cellSize);
        if(maze[x][y]==0)
        {
            maze[x][y]=1;//препятствие
        context.fillStyle = 'black';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        else{
            
            context.fillStyle = 'white';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.strokeStyle='black';
            context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y]=0;//убрать препятствие
        }
    });
    }
}
function clean()
{
    location.reload();
}
/*function heuristicFunc(current, end, type){
   // if (type){
     //   return 2 * (Math.sqrt(Math.pow(current[0] - end[0], 2) + Math.pow(current[1] - end[1], 2)));
    //}
    //else{
        return 2 * (Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]));
    //}
}*/

function Astar(start,end,maze)
{
    let openlist=[];
    let closelist=[];
    openlist.push(start);
    while(openlist>0)
    {

    }
}


    //const start=x * cellSize, y * cellSize;
/*canvas.addEventListener('click', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / cellSize);
    let y = Math.floor((event.clientY - rect.top) / cellSize);
           
    context.fillStyle = 'red';
    context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);});*/
    //const end=x * cellSize, y * cellSize;

/*canvas.addEventListener("click",function(event)
{
    let rect=canvas.getBoundingClientRect();
    let x=event.clientX-rect.left;
    let y=event.clientY-rect.top;
    points.push({x,y});
    drawPoint(x,y);
});
function drawPoint(x,y)
{
    context.beginPath();
    context.fillRect(x,y,10,10);
    context.fillStyle="red";
    context.fill();
    context.closePath();
}*/






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
