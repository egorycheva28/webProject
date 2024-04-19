const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let width = 700;
let height = 700;
canvas.width = width;
canvas.height = height;
let maze = [];
maze[0] = [];

let start = [-1,-1];
let end = [-1,-1];

function generationMap()
{
    let input = document.querySelector('input');
    let n = input.value;
    let cellSize = Math.floor(width / n);

    for (let i = 0; i < n; i++)
    {
        maze[i] = [];
        for (let j = 0; j < n; j++) 
        {
            maze[i][j] = 0;
        }
    }
    for (let i = 0; i < n; i++) 
    {
        for (let j = 0; j < n; j++) 
        {
            context.strokeStyle = 'black';
            context.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }
}

function generationMaze()
{
    let input = document.querySelector('input');
    let n = input.value;
    let cellSize = Math.floor(width / n);

    for (let i = 0; i < n; i++)
    {
        maze[i] = [];
        for (let j = 0; j < n; j++) 
        {
            maze[i][j] = 1;
        }
    }
    function createMaze(row, col) //генерация лабиринта
    {
        maze[row][col] = 0;
        let directions = ['top', 'bottom', 'right', 'left'];
        directions = directions.sort(function() 
        {
            return 0.5 - Math.random();
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
            context.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            if (maze[i][j])
            {
                context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
    return maze;
}

let flag;

canvas.addEventListener('click', function(event) 
{
    let input = document.querySelector('input');
    let n = input.value;
    let cellSize = Math.floor(width / n);
    let rect = canvas.getBoundingClientRect();
    let x = Math.floor((event.clientX - rect.left) / cellSize);
    let y = Math.floor((event.clientY - rect.top) / cellSize);
    if(flag === 0)
    {
        context.fillStyle = 'rgb(159, 212, 152)';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        start[0] = x;
        start[1] = y;
        maze[x][y] = 2;
        flag = 2;
    }
    else if(flag === 1)
    {
        context.fillStyle = 'rgb(236, 148, 148)';
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        end[0] = x;
        end[1] = y;
        maze[x][y] = 2;
        flag = 2;
    }
    else
    {
        if(maze[x][y] === 0)
        {
            context.fillStyle = 'black';
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y] = 1;
        }
        else if(maze[x][y] === 1)
        {
            context.fillStyle = 'rgb(254, 254, 244)'; 
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
            maze[x][y] = 0;
        }
    }
});

function Start()
{
    let input = document.querySelector('input');
    let n = input.value;
    let cellSize = Math.floor(width / n);
    context.strokeRect(start[0] * cellSize, start[1] * cellSize, cellSize, cellSize);
    context.fillStyle = 'rgb(254, 254, 244)'; 
    context.fillRect(start[0] * cellSize, start[1] * cellSize, cellSize, cellSize);    
    flag = 0;
    if(start[0] !== -1 && start[1] !== -1)
    {
        maze[start[0]][start[1]] = 0;
    }
}

function End()
{
    let input = document.querySelector('input');
    let n = input.value;
    let cellSize = Math.floor(width / n);
    context.strokeRect(end[0] * cellSize, end[1] * cellSize, cellSize, cellSize);
    context.fillStyle = 'rgb(254, 254, 244)'; 
    context.fillRect(end[0] * cellSize, end[1] * cellSize, cellSize, cellSize);
    flag = 1;
    if(end[0] !== -1 && end[1] !== -1)
    {
        maze[end[0]][end[1]] = 0;
    }
}

function priorityQueue() // [[x, y], priority]
{ 
    let queue = [];

    this.enqueue = function(element) 
    {
        if (this.isEmpty()) 
        {
            queue.push(element);
        }
        else 
        {
            let added = false;
            for (let i = 0; i < queue.length; i++) 
            {
                if (element[1] < queue[i][1]) 
                {
                    queue.splice(i, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added)
            {
                queue.push(element);
            }
        }
    }

    this.dequeue = function() 
    {
        return queue.shift();
    }

    this.isEmpty = function() 
    {
        return queue.length === 0;
    }
}

function heuristicFunction(start1, end1)
{
    return Math.abs(start1.x - end1.x) + Math.abs(start1.y - end1.y);
}

function Neighbours(n, current, distance)
{ 
    let neighbours = [];
    let currentX = current[0][0];
    let currentY = current[0][1];
    if(currentX + 1 < n && (!maze[currentX + 1][currentY] || maze[currentX + 1][currentY] === 2) && distance[currentX + 1][currentY] === 0)
    {
        neighbours.push([currentX + 1, currentY]);
    }
    if(currentX - 1 >= 0 && (!maze[currentX - 1][currentY] || maze[currentX - 1][currentY] === 2) && distance[currentX - 1][currentY] === 0)
    {
        neighbours.push([currentX - 1, currentY]);
    }
    if(currentY + 1 < n && (!maze[currentX][currentY + 1] || maze[currentX][currentY + 1] === 2) && distance[currentX][currentY + 1] === 0)
    {
        neighbours.push([currentX, currentY + 1]);
    }
    if(currentY - 1 >= 0 && (!maze[currentX][currentY - 1] || maze[currentX][currentY - 1] === 2) && distance[currentX][currentY - 1] === 0)
    {
        neighbours.push([currentX, currentY - 1]);
    }
    
    return neighbours;
}

function wait(time)
{
    return new Promise(resolve => setTimeout(resolve, time));
}

async function Astar()
{
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width / n);
   
    let queue = new priorityQueue();
    let distance = [];
    for (let i = 0; i < n; i++)
    {
        distance[i] = [];
        for (let j = 0; j < n; j++) 
        {
            distance[i][j] = 0;
        }
    }
    distance[start[0]][start[1]] = 1;

    let parent = [];
    for (let i = 0; i < n; i++)
    {
        parent[i] = [];
        for (let j = 0; j < n; j++)
        {
            parent[i][j] = [];
            parent[i][j][0] = 0;//по x
            parent[i][j][1] = 0;//по y
        }
    }
    
    queue.enqueue([start, heuristicFunction(start, end)])
    
    while(!queue.isEmpty())
    {
        let current = queue.dequeue();
        let currentX = current[0][0];
        let currentY = current[0][1];

        if(currentX === end[0] && currentY === end[1])
        {
            break;
        }
        
        let neighbours = Neighbours(n, current, distance);
        
        for(let i = 0; i < neighbours.length; i++)
        {
            let neighbour = neighbours[i];
            let neighbourX = neighbours[i][0];
            let neighbourY = neighbours[i][1];

            await wait(30);
            context.strokeRect(neighbourX * cellSize, neighbourY * cellSize, cellSize, cellSize);
            context.fillStyle = 'rgb(192, 211, 232)'; 
            context.fillRect(neighbourX * cellSize, neighbourY * cellSize, cellSize, cellSize);

            if(distance[neighbourX][neighbourY] === 0 || distance[currentX][currentY] + 1 < distance[neighbourX][neighbourY])
            {
                parent[neighbourX][neighbourY][0] = currentX;
                parent[neighbourX][neighbourY][1] = currentY;
                distance[neighbourX][neighbourY] = distance[currentX][currentY] + 1;
                queue.enqueue([neighbour, distance[neighbourX][neighbourY] + heuristicFunction(neighbour, end)]);
            }  
        }
    }

    let path = [];
    path.push(end);

    let current = parent[end[0]][end[1]];
    
    while (current[0] !== 0 || current[1] !== 0)
    {
        path.push(current);
        current = parent[current[0]][current[1]];
    }

    path.push(start);
    path.reverse();

    if(path.length > 2)
    {
        for(let i = 0; i < path.length; i++)
        {
            await wait(20);
            context.strokeRect(path[i][0] * cellSize, path[i][1] * cellSize, cellSize, cellSize);
            context.fillStyle = 'rgb(125, 183, 240)';
            context.fillRect(path[i][0] * cellSize, path[i][1] * cellSize, cellSize, cellSize);
        }  
    }
    else
    {
        alert('Нет пути');
    }
}

function clean()
{
    location.reload();
}

function show(menu)
{
    let element = document.getElementById(menu);
    if(element)
    {
        element.style.display='block';
    }
}