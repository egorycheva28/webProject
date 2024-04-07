const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let width = 700;
let height = 700;
canvas.width = width;
canvas.height = height;
let maze = [];
maze[0]=[];
let start;
let end;
let startX;
let startY;
let endX;
let endY;

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
    
    let rect = canvas.getBoundingClientRect();
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width/n);

    if(flag===0)
    {
        canvas.addEventListener('click', function(event) {
            const x = Math.floor((event.clientX - rect.left) / cellSize);
            const y = Math.floor((event.clientY - rect.top) / cellSize);
            context.fillStyle = 'green';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            startX=x;
            startY=y;
            start=maze[x][y];
        });
        flag=1;
        return startX,startY;
    }

    else if(flag===1)
    {
        canvas.addEventListener('click', function(event) {
            const x = Math.floor((event.clientX - rect.left) / cellSize);
            const y = Math.floor((event.clientY - rect.top) / cellSize);            
            context.fillStyle = 'red';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            end=maze[x][y];
            endX=x;
            endY=y;
        });
        flag=2;
        return endX,endY;
    }

    else 
    {
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

function res()
{


class Node
{
    constructor(x,y)
    {
        this.x=x;//координата x узла на карте
        this.y=y;//координата y узла на карте
        this.g=0;//расстояние от начального узла до текущего
        this.h=0;//эвристическая оценка расстояния от текущего узла до конечного
        this.f=0;//сумма g и h
        this.parent=null;//родительский узел для восстановления пути

    }
}
function heuristicFunc(current,ends)
{
    return Math.abs(current.x - ends.x) + Math.abs(current.y - ends.y);
}

function Astar()
{
    let Start=new Node(startX,startY);
    let End=new Node(endX,endY);
    let openlist=[];//требующие рассмотрения пути
    let closelist=[];//просмотренные вершины
    openlist.push(Start);
    while(openlist.length>0)
    {
        let currentNode=openlist.shift();
        //let currentIndex=0;
        if(currentNode===End)
        {
            let path = [];
            //let temp = currentNode;
            while (currentNode) {
                path.push(currentNode);
                currentNode = currentNode.parent;
            }
            return path.reverse();
        }
        closelist.push(currentNode);
        let neighbors=[];
        for(let i=-1;i<=1;i++)
        {
            for(let j=-1;j<=1;j++)
            {
                if(i===0 && j===0)
                {
                    continue;
                }
                let x=currentNode.x+i;
                let y=currentNode.y+j;
                if(x<0 || x>=n || y<0 || y>=n)
                {
                    continue;
                }
                if(maze[x][y])
                {
                    continue;
                }
                let neighbor=new Node(x,y);
                neighbors.push(neighbor);
            }
        }
        for(let neighbor of neighbors)
        {
            if(closelist.has(neighbor))
            {
                continue;
            }
            let new_g=currentNode.g+1;
            let nfo = openlist.find(n => n === neighbor);
            if(nfo)
            {
                if(new_g<nfo.g)
                {
                    nfo.g=new_g;

                    nfo.h=heuristicFunc(nfo,End);
                    nfo.f=nfo.g+nfo.h;
                    nfo.parent=currentNode;

                }
            }
            else{
                neighbor.g=new_g;
                neighbor.h=heuristicFunc(neighbor,End);
                neighbor.f=neighbor.g+neighbor.h;
                neighbor.parent=currentNode;
                openlist.push(neighbor);
            }
        }
    }
}
function drawPath()
{
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width/n);
    alert(cellSize);
    for(let node of path)
    {
        context.fillStyle='blue';
        context.fillRect(node.x*cellSize,node.y*cellSize,cellSize,cellSize);
    }
}
    alert(cellSize);
    Astar();
    drawPath();
}

function clean()
{
    location.reload();
}