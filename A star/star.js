const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let width = 700;
let height = 700;
canvas.width = width;
canvas.height = height;

// Задаем размер ячейки


// Создаем двумерный массив для представления лабиринта
let maze = [];
maze[0]=[];

function generation()
{
    let input = document.querySelector('input');
    let n=input.value;

    let cellSize =Math.floor(width/n);
for (let i = 0; i < n; i++)
 {
    maze[i] = [];
    for (let j = 0; j < n; j++) 
    {
        maze[i][j] = 1;
    }
 }

// Рекурсивная функция для создания лабиринта

   
// Устанавливаем ширину и высоту лабиринта


function createMaze(row, col) 
{
    maze[row][col] = 0;

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
                    maze[row - 1][col] = 0;
                    createMaze(row - 2, col);
                }
                break;

            case 'bottom':
                if (row + 2 >= n - 1)
                {
                    continue;
                }
                if (maze[row + 2][col]) 
                {
                    maze[row + 1][col] = 0;
                    createMaze(row + 2, col);
                }
                break;

            case 'right':
                if (col + 2 >= n - 1) 
                {
                    continue;
                }
                if (maze[row][col + 2]) 
                {
                    maze[row][col + 1] = 0;
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
                    maze[row][col - 1] = 0;
                    createMaze(row, col - 2);
                }
                break;
        }
    }
}

createMaze(1, 1);

// Отрисовка лабиринта на холсте

for (let i = 0; i < n; i++) 
{
    for (let j = 0; j < n; j++) 
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

    if(flag===0)
    {
        canvas.addEventListener('click', function(event) {
            const x = Math.floor((event.clientX - rect.left) / cellSize);
            const y = Math.floor((event.clientY - rect.top) / cellSize);
            let startX=x*cellSize;
            let startY=y*cellSize;
            context.fillStyle = 'green';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y]=2;//начало пути
        });
        flag=1;
    }

    else if(flag===1){
        canvas.addEventListener('click', function(event) {
            
    
            const x = Math.floor((event.clientX - rect.left) / cellSize);
            const y = Math.floor((event.clientY - rect.top) / cellSize);
            let endX=x*cellSize;
            let endY=y*cellSize;
            
            context.fillStyle = 'red';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y]=3;//конец пути
        });
        flag=2;
    }

    else {
    canvas.addEventListener('click', function(event) {
        

        let x = Math.floor((event.clientX - rect.left) / cellSize);
        let y = Math.floor((event.clientY - rect.top) / cellSize);

        if(maze[x][y]===0)
        {
            context.fillStyle = 'black';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y]=1;//препятствие
        }

        else
        {
            context.fillStyle = 'rgb(254, 254, 244)'; 
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.strokeStyle='black';
            context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y]=0;//убрать препятствие
        }
    });
    }

}

class Node
{
    constructor(x,y)
    {
        this.x=x;//координата x узла на карте
        this.y=y;//координата y узла на карте
        this.g=0;//расстояние от начального узла до текущего
        this.h=heuristicFunc();//эвристическая оценка расстояния от текущего узла до конечного
        this.f=0;//сумма g и h
        this.parent=null;//родительский узел для восстановления пути

    }
}
function heuristicFunc(current, end, type){
    if (type){
        return 2 * (Math.sqrt(Math.pow(current[0] - end[0], 2) + Math.pow(current[1] - end[1], 2)));
    }
    else{
        return 2 * (Math.abs(current[0] - end[0]) + Math.abs(current[1] - end[1]));
    }
}

function Astar(start,end)
{
    let openlist=[];//требующие рассмотрения пути
    let closelist=[];//просмотренные вершины
    openlist.push(start);
    while(!openlist.empty)
    {
        let currentNode=openlist[0];
        let currentIndex=0;

    }
}

function clean()
{
    location.reload();
}