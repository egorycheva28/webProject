function show(menu)
{
    let element = document.getElementById(menu);
    if(element)
    {
        element.style.display="block";
    }
}

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
            context.strokeStyle="black";
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
            //context.strokeStyle="black";
            //context.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
            if (maze[i][j])
            {
                context.fillStyle="black";
                context.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
            }
        }
    }
    return maze;
}

//let flag=0;
function Start()
{
    let rect = canvas.getBoundingClientRect();
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width / n);

    
    canvas.addEventListener('click', function(event1) {
        //context.fillStyle = 'rgb(254, 254, 244)';
        //context.fillRect(start1[0] * cellSize, start1[1] * cellSize, cellSize, cellSize);
        let x1 = Math.floor((event1.clientX - rect.left) / cellSize);
        let y1 = Math.floor((event1.clientY - rect.top) / cellSize);
        context.fillStyle = 'rgb(159, 212, 152)';
        context.fillRect(x1 * cellSize, y1 * cellSize, cellSize, cellSize);
        start[0] = x1;
        start[1] = y1;
        maze[x1][y1] = 1;
    });
        
}

function End()
{
    let rect = canvas.getBoundingClientRect();
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width/n);

    
    canvas.addEventListener('click', function(event1) {
        //context.fillStyle = 'rgb(254, 254, 244)';
        //context.fillRect(end1[0] * cellSize, end1[1] * cellSize, cellSize, cellSize);
        let x2 = Math.floor((event1.clientX - rect.left) / cellSize);
        let y2 = Math.floor((event1.clientY - rect.top) / cellSize);
        context.fillStyle = 'red';
        context.fillRect(x2 * cellSize, y2 * cellSize, cellSize, cellSize);
        end[0] = x2;
        end[1] = y2;
        maze[x2][y2] = 1;
    });
        
}
let flag = 0;
function clickCells()//начало, конец, непроходимые клетки
{
    
    let rect = canvas.getBoundingClientRect();
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width/n);

    
    canvas.addEventListener('click', function(event1) {
        //let x1 = Math.floor((event1.clientX - rect.left) / cellSize);
        //let y1 = Math.floor((event1.clientY - rect.top) / cellSize);
        if(flag === 0)
        {
            let x1 = Math.floor((event1.clientX - rect.left) / cellSize);
            let y1 = Math.floor((event1.clientY - rect.top) / cellSize);
        context.fillStyle = 'rgb(159, 212, 152)';
        context.fillRect(x1 * cellSize, y1 * cellSize, cellSize, cellSize);
        start[0]=x1;
        start[1]=y1;
        maze[x1][y1]=1;
        flag=1;
        }
        else if(flag===1)
        {
            let x2 = Math.floor((event1.clientX - rect.left) / cellSize);
        let y2 = Math.floor((event1.clientY - rect.top) / cellSize);
        context.fillStyle = 'red';
        context.fillRect(x2 * cellSize, y2 * cellSize, cellSize, cellSize);
        end[0]=x2;
        end[1]=y2;
        maze[x2][y2]=1;
        flag=2;
        }
        else{
            let x3 = Math.floor((event1.clientX - rect.left) / cellSize);
        let y3 = Math.floor((event1.clientY - rect.top) / cellSize);
            if(maze[x3][y3]===0)
            {
                context.fillStyle = 'black';
                context.fillRect(x3 * cellSize, y3 * cellSize, cellSize, cellSize);
                maze[x3][y3]=1;
            }
            else
            {
                context.fillStyle = 'rgb(254, 254, 244)'; 
                context.fillRect(x3 * cellSize, y3 * cellSize, cellSize, cellSize);
                context.strokeStyle='black';
                context.strokeRect(x3 * cellSize, y3 * cellSize, cellSize, cellSize);
                maze[x3][y3]=0;
            }
        }

            
    });
    
}

function priorityQueue() { // input: [[x, y], priority]
    let array = [];

    this.enqueue = function(element) {
        if (this.isEmpty()) {
            array.push(element);
        }
        else {
            let added = false
            for (let i = 0; i < array.length; i++) {
                if (element[1] < array[i][1]) {
                    array.splice(i, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added) {
                array.push(element);
            }
        }
    }

    this.dequeue = function() {
        return array.shift();
    }

    this.isEmpty = function() {
        return array.length === 0;
    }
}
function heuristicFunc(start,end)
{
    return Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
}

function Neighbours(n,current,distance)
{ 
    let neighbours=[];
    let currentX=current[0][0];
    let currentY=current[0][1];
    if(currentX+1<n && !maze[currentX+1][currentY] && distance[currentX+1][currentY]===-1)
    {
        neighbours.push([currentX+1,currentY]);
    }
    if(currentX-1>=0 && !maze[currentX-1][currentY] && distance[currentX-1][currentY]===-1)
    {
        neighbours.push([currentX-1,currentY]);
    }

    if(currentY+1<n && !maze[currentX][currentY+1] && distance[currentX][currentY+1]===-1)
    {
        neighbours.push([currentX,currentY+1]);
    }

    if(currentY-1>=0 && !maze[currentX][currentY-1] && distance[currentX][currentY-1]===-1)
    {
        neighbours.push([currentX,currentY-1]);
    }
    
    return neighbours;
}

function wait(time)
{
    return new Promise(resolve => setTimeout(resolve, time));
}



async function Astar()
{
    //alert(start);
    //alert(end);
    let input = document.querySelector('input');
    let n = input.value;
    const cellSize = Math.floor(width/n);
   
    let queue=new priorityQueue();
    let distance=[];
    for (let i = 0; i < n; i++)
    {
        distance[i] = [];
        for (let j = 0; j < n; j++) 
        {
            distance[i][j] = -1;
        }
    }
    distance[start[0]][start[1]] = 0;
    let parent = new Array(n);
    for (let i = 0; i < n; i++) {
        parent[i] = new Array(n);
    }
    for (let i = 0; i < n; ++i){
        for (let j = 0; j < n; ++j){
            parent[i][j] = new Array(2);
            parent[i][j][0] = -1;
            parent[i][j][1] = -1;
        }
    }

    /*let parent=[];
    parent[0]=[];
    parent[0][0]=[];
    for(let i=0;i<n;i++)
    {
        for(let j=0;j<n;j++)
        {
            parent[i][j][0]=0;//по x
            parent[i][j][1]=0;//по y
        }
    }*/
    
    queue.enqueue([start,heuristicFunc(start,end)])
    
    while(!queue.isEmpty())
    {
        
        let current=queue.dequeue();
        
        let currentX=current[0][0];
        let currentY=current[0][1];
        
        if(currentX===end[0] && currentY===end[1])
        {
            
            break;
        }
        
        let neighbours=Neighbours(n,current,distance);
        
        for(let i=0;i<neighbours.length;i++)
        {
            let neighbour=neighbours[i];
            let neighbourX=neighbours[i][0];
            let neighbourY=neighbours[i][1];
            
            await wait(100);
            context.fillStyle='rgb(181, 207, 234)'; 
            context.fillRect(neighbourX*cellSize,neighbourY*cellSize,cellSize,cellSize);

            if(distance[neighbourX][neighbourY]===-1 || distance[currentX][currentY]+1<distance[neighbourX][neighbourY])
            {
                parent[neighbourX][neighbourY][0]=currentX;
                parent[neighbourX][neighbourY][1]=currentY;
                distance[neighbourX][neighbourY]=distance[currentX][currentY]+1;
                queue.enqueue([neighbour,distance[neighbourX][neighbourY]+heuristicFunc(neighbour,end)]);
            }
        }
    }
    if (JSON.stringify(parent[end[0]][end[1]]) !== JSON.stringify([-1, -1])){
        let current = parent[end[0]][end[1]];
        let counter = 0;
        while (current[0] !== -1 && current[1] !== -1){
            counter++;
            context.fillStyle = "#06d9fd";
            context.fillRect(current[1] * cellSize, current[0] * cellSize, sizeNode - 1, sizeNode - 1);
            current = parent[current[0]][current[1]];
        }

        context.fillStyle="#ff0216";
        context.fillRect(end[1] * cellSize, end[0] * cellSize, sizeNode - 1, sizeNode - 1);
        context.fillStyle="#0cfa00";
        context.fillRect(start[1] * cellSize, start[0] * cellSize, sizeNode - 1, sizeNode - 1);

        counter--;
        alert("Длина пути = " + counter)
    }

   
}




function clean()
{
    location.reload();
}