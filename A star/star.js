function show(menu)
{
    let el=document.getElementById(menu);
    if(el)
    {
        el.style.display="block";
    }
    
}
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
    if(flag==0)
    {
    canvas.addEventListener('click', function(event) {
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let rect = canvas.getBoundingClientRect();
        let input = document.querySelector('input');
        let n=input.value;
        let width = 700;
        let height = 700;
        const cellSize =Math.floor(width/n);

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
            let canvas = document.getElementById('canvas');
            let context = canvas.getContext('2d');
            let rect = canvas.getBoundingClientRect();
            let input = document.querySelector('input');
            let n=input.value;
            let width = 700;
            let height = 700;
            const cellSize =Math.floor(width/n);
    
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
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        let rect = canvas.getBoundingClientRect();
        let input = document.querySelector('input');
        let n=input.value;
        let width = 700;
        let height = 700;
        const cellSize =Math.floor(width/n);

        let x = Math.floor((event.clientX - rect.left) / cellSize);
        let y = Math.floor((event.clientY - rect.top) / cellSize);
        if(context.fillStyle=='white')
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

function Astar(start,end,maze)
{

}



