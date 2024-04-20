//основной алгоритм и числа брались из этого видео
//https://www.youtube.com/watch?v=8KTzAiusfPs&t=1111s&ab_channel=foo52ru%D0%A2%D0%B5%D1%85%D0%BD%D0%BE%D0%A8%D0%B0%D0%BC%D0%B0%D0%BD

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

canvas.addEventListener('click', mouseClick); // рисует точки по клику мыши

let points = [];
let Q = 200;
let evaporation = 0.64;
let alpha = 1;
let beta = 1;
let pheromones;
let distance;


function mouseClick(event)
{    
    let rect = canvas.getBoundingClientRect();   
    let clientX = event.clientX - rect.left;
    let clientY = event.clientY - rect.top;
    context.beginPath();
    if (points.length >= 1)
    {
        for(let point of points)//соединяет новую точку с другими
        {
            let pointX = point[0];
            let pointY = point[1];

            context.moveTo(pointX, pointY);
            context.lineTo(clientX, clientY);
            context.strokeStyle = "#EEE8AA";
            context.stroke();
        }
    }

    context.beginPath();
    context.arc(clientX, clientY, 10, 0, Math.PI * 2);
    context.fillStyle = '#CD5C5C';
    context.fill();
    points.push([clientX, clientY]);
    redrawArc();
}

function redrawArc()//перересовываем круги, так как проблема слиниями
{
    for (let i = 0; i < points.length; ++i)
    {
        context.beginPath();
        context.arc(points[i][0], points[i][1], 10, 0, 2 * Math.PI, false);
        context.fillStyle = '#CD5C5C';
        context.fill();
    }
}

function drawWhiteLineAndColor(arr,color)
{

    arr.push(arr[0]);
    for (let i = 0; i < arr.length - 1; ++i)
    {
        context.beginPath();

        context.moveTo(arr[i][0] , arr[i][1]);
        context.lineTo(arr[i + 1][0] , arr[i + 1][1]);
        context.strokeStyle = "rgb(255,255,255)";
        context.lineWidth = 2;
        context.stroke();

        context.moveTo(arr[i][0], arr[i][1]);
        context.lineTo(arr[i + 1][0], arr[i + 1][1]);
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.stroke();
    }
    redrawArc();
}

function euclideanDistance(point1, point2)//расстояние между двумя точками
{
    return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2);
}

function distancePath(path)
{
    let dist = 0
    for (let i = 0; i < path.length - 1; ++i)
    {
        dist += euclideanDistance(path[i] , path[i + 1] );
    }
    dist += euclideanDistance(path[path.length - 1] , path[0] );
    return dist;
}

function randome(p){
    let rand = Math.random();
    for (let i = 0; i < p.length; ++i)
    {
        if (rand < p[i][1])
        {
            return p[i][0];
        }
    }
}

async function antAlgorithm()
{
    let bestPath = []; 
    let newBestPath=[];

    let copy = points.slice(0);

    bestPath.push(copy, distancePath(copy));

    pheromones = [];
    distance = [];

    for (let i = 0; i < points.length - 1; ++i)
    {
        pheromones[i] = [];
        distance[i] = [];
        for (let j = i + 1; j < points.length; ++j)
        {
            distance[i][j] = Q / euclideanDistance(points[i] , points[j] );
            pheromones[i][j] = 0.2;
        }
    }

    let end = points.length * 2;

    for (let k = end; k > 0; --k)
    {
        let result = [];

        for (let ant = 0; ant < points.length; ++ant)
        {
            let path = [];
            let path_id = [];

            let start_idx = ant;
            let start = points[start_idx] ;

            path.push(start);
            path_id.push(start_idx);

            while (path.length !== points.length)
            {
                let desireSum = 0;

                let p = [];
                for (let i = 0; i < points.length; ++i) 
                {
                    if (path.indexOf(points[i]) == -1)
                    {
                        let min = Math.min(start_idx, i);
                        let max = Math.max(start_idx, i);
                        let desire = (pheromones[min][max])** alpha * (distance[min][max])** beta;
                        p.push([i,desire]);
                        desireSum += desire;
                    }
                }

                for (let i = 0; i < p.length; ++i)
                {
                    p[i][1] /= desireSum;
                }

                for (let j = 1; j < p.length; ++j)
                {
                    p[j][1] += p[j - 1][1];
                }

                start_idx = randome(p);
                        
                start = points[start_idx] ;
                path.push(start );
                path_id.push(start_idx);
            }
            result.push([path , path_id , distancePath(path)])
        }

        let minn = result[0][2] 
        for (let i = 1; i < result.length; ++i)
        {
            if(minn > result[i][2] ){
                minn = result[i][2];
                newBestPath = [result[i][0], result[i][2]];
            }
        }   


        for (let i = 0; i < points.length - 1; ++i)
        {
            for (let j = i + 1; j < points.length; ++j)
            {
                pheromones[i][j] *= evaporation;
            }
        }

        for (let i = 0; i < result.length; ++i)
        {
            let idx_path = result[i][1] ;
            let lenOfPath = result[i][2];
            for (let j = 0; j < points.length - 1; ++j)
            {
                pheromones[Math.min(idx_path[j], idx_path[j + 1])][Math.max(idx_path[j], idx_path[j + 1])] += Q / lenOfPath;
            }
        }

        if (newBestPath[1] < bestPath[1])
        {
            drawWhiteLineAndColor(bestPath[0],"#EEE8AA");
            drawWhiteLineAndColor(newBestPath[0],"rgb(204, 25, 12)");
            bestPath = newBestPath ;
            end = points.length * 2;
        }

        end -= 1;
        await wait(100);
    }
    drawWhiteLineAndColor(bestPath[0], "rgb(28, 158, 16)");
}

function clean()
{
    location.reload();
}

function wait(time)
{
    return new Promise(resolve => setTimeout(resolve, time));
}

function show(menu)
{
    let element = document.getElementById(menu);
    if(element)
    {
        element.style.display = "block";
    }
}