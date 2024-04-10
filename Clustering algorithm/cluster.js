let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");
let points=[];
let centers=[];
let clusters=[];
let allDistances = [];
let collorCenter=['red','green','blue','yellow','purple'];
let flagPoints = true;
let flagCenters=true;

canvas.addEventListener("click",function(event){//расставляем точки
    
    if(flagPoints===true)
    {
        let rect=canvas.getBoundingClientRect();
        let x=event.clientX-rect.left;
        let y=event.clientY-rect.top;
        let point = {
            pointX: x,
            pointY: y
        }
        points.push(point);
        context.strokeStyle = 'white';
        context.beginPath();
        context.arc(x,y,10,0,2*Math.PI);
        context.stroke();
        context.fill();
    }

    return points;
        
});

function addCenter()//добавляем центры
{
    let input = document.querySelector('input');
    let numberCluster=input.value;
   
    if(flagCenters===true && points.length!=0 && numberCluster<=points.length)
    {
        for(let i=0;i<numberCluster;i++)
        {
            let randomCenter=Math.floor(Math.random()*points.length);
            let Center={
                X: points[randomCenter].pointX,
                Y: points[randomCenter].pointY,
                collor: collorCenter[i],
            };
            context.fillStyle=Center.collor;
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(Center.X,Center.Y,10,0,2*Math.PI);
            context.stroke();
            context.fill();
            centers.push(Center);
            clusters.push([]);
                 
        }
    
        flagPoints=false;
        flagCenters=false;
        return centers; 
    }
}


function Cluster()//группируем на кластеры
{
    for(let i=0; i<points.length; i++)
    { 
        let distances = [];
        for(let j = 0; j<centers.length; j++){
            let dotCoardX = centers[j].X-points[i].pointX;
            let dotCoardY = centers[j].Y-points[i].pointY;
            let distance = Math.pow((Math.pow(dotCoardX,2) + Math.pow(dotCoardY,2)),0.5);
            distances.push(distance);
        }
        allDistances.push(distances);
    }
    for(let i=0; i<allDistances.length; i++)
    {
        let min = allDistances[i][0];
        let index = 0;
        for(let j=0 ; j<centers.length; j++)
        {
            if(min > allDistances[i][j])
            {
                min = allDistances[i][j];
                index = j;
            }
            
        }
        clusters[index].push(points[i]);
        context.fillStyle = collorCenter[index];
        context.strokeStyle = 'white';
        context.beginPath();
        context.arc(points[i].pointX,points[i].pointY,10,0,2*Math.PI);
        context.stroke();
        context.fill();
    }
    return clusters;
}

function avgCoard()//переопределяем центры
{ 
    
    for(let i = 0; i < centers.length; i++)
    {
        let sumX = 0;
        let sumY = 0;
        
        for(let j = 0; j < clusters[i].length; j++)
        {
            sumX +=clusters[i][j].pointX;
            sumY += clusters[i][j].pointY;
        }

        if(clusters[i].length!==0)
        {            
            centers[i].X = sumX / clusters[i].length;
            centers[i].Y = sumY / clusters[i].length;
        }
    }   
    allDistances = [];
    
    for(let i=0; i<clusters.length;i++)
    {
        clusters[i] = [];
    }
    Cluster();
    return centers;
} 
function avgCoard1()//переопределяем центры
{ 
    
    for(let i = 0; i < centers.length; i++)
    {
        let sumX = 0;
        let sumY = 0;
        
        for(let j = 0; j < clusters[i].length; j++)
        {
            sumX +=clusters[i][j].pointX;
            sumY += clusters[i][j].pointY;
        }

        if(clusters[i].length!==0)
        {            
            centers[i].X = sumX / clusters[i].length;
            centers[i].Y = sumY / clusters[i].length;
            
        }
    }   
    allDistances = [];
    
    for(let i=0; i<clusters.length;i++)
    {
        clusters[i] = [];
    }
    Cluster();

} 
function res()
{
    addCenter();
    Cluster();
    //avgCoard1();
}
/*
function isEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}
function r()
{
function result()
{
    centers=addCenter();
    let oldCenters=[];
    while(!isEqual(centers,oldCenters))
    {
        oldCenters=[...centers];
        centers=avgCoard();
    }
    return centers;
}
result();
Cluster();
}*/
    



function clean()//очищаем
{
    location.reload();
}
