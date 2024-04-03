let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");

let points=[];
let clusters=[];
let collorCenter=['red','green','blue','yellow','purple'];

let centers=[];
let allDistances = [];
let flagPoints = true;
let flagCenters=true;

canvas.addEventListener("click",function(event){
    
    if(flagPoints==true)
    {
        let rect=canvas.getBoundingClientRect();
        let x=event.clientX-rect.left;
        let y=event.clientY-rect.top;
        let point = {
            pointX: x,
            pointY: y
        }
        points.push(point);
        context.fillStyle = "black";
        context.beginPath();
        context.arc(x,y,10,0,2*Math.PI);
        context.stroke();
        context.fill();
    }

    return points;
        
});

function addCenter()
{
    let input = document.querySelector('input');
    let numberCluster=input.value;
   
    if(flagCenters==true && points.length!=0 && numberCluster<=points.length)
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
            context.beginPath();
            context.fillRect(Center.X,Center.Y,20,20);
            centers.push(Center);
            clusters.push([]);      
        }
    
        flagPoints=false;
        flagCenters=false;
        return centers; 
    }
}

function Cluster()
{
    for(let i=0;i<points.length;i++)
    {
        let distances=[];
        for(let j=0;j<centers.length;j++)
        {
            let CoordinateX=centers[j].X-points[i].pointX;
            let CoordinateY=centers[j].Y-points[i].pointY;
            let distance=Math.pow((Math.pow(CoordinateX,2)+Math.pow(CoordinateY,2)),0.5);
            distances.push(distance);
        }
        allDistances.push(distances);
    }

    for(let i=0;i<allDistances;i++)
    {
        for(let j=0;j<centers.length;j++)
        {
            let min=Infinity;
            if(allDistances[][]<min)
            {
                min=allDistances[][];
    
            }
        }
    }

    clusters[].push(points[]);
    context.fillStyle=collorCenter[];
    context.beginPath();
    context.arc(points[].pointX,points[].pointY,10,0,Math.PI*2);
    context.stroke();
    context.fill();
}


/*function buildCluster()
{
    for(let i=0; i<points.length; i++)
    { 
        let singleDotArry = [];
        for(let j = 0; j<centers.length; j++){
            let dotCoardX = points[i].pointX - centers[j].X;
            let dotCoardY = points[i].pointY - centers[j].Y;
            let vector = Math.pow((Math.pow(dotCoardX,2) + Math.pow(dotCoardY,2)),0.5);
            singleDotArry.push(vector)
        }
        allDistances.push(singleDotArry);
    }
    for(let i=0; i<allDistances.length; i++)
    {
        let min = allDistances[i][0];
        let indexMin = 0;
        for(let j=0 ; j<centers.length; j++)
        {
            if(min > allDistances[i][j])
            {
                min = allDistances[i][j];
                indexMin = j;
            }
            
        }
        clusters[indexMin].push(points[i]);
        context.fillStyle = collorCenter[indexMin];
        context.beginPath();
        context.arc(points[i].pointX,points[i].pointY,10,0,2*Math.PI);
        context.stroke();
        context.fill();
    }
    return clusters;
}*/
function avgCoard(){ 
    for(let i = 0; i < clusters.length; i++){
        let sumX = 0;
        let sumY = 0;
        let sredX = 0;
        let sredY = 0;
        let count = clusters[i].length;
        for(let j = 0; j < count; j++){
            sumX = clusters[i][j].pointX + sumX;
            sumY = clusters[i][j].pointY + sumY;
        }
        if(count!==0){
            context.fillStyle = 'white';
            context.beginPath();
            context.fillRect(centers[i].X, centers[i].Y, 20, 20);
            context.fill();
            sredX = sumX / clusters[i].length;
            sredY = sumY / clusters[i].length;
            centers[i].X = sredX ;
            centers[i].Y = sredY;
            context.fillStyle = centers[i].collor;
            context.beginPath();
            context.fillRect(sredX, sredY, 20, 20);
            context.fill();
        }
        

    }   
    allDistances = [];
    singleDotArry = [];
    for(let i=0; i<clusters.length;i++){
        clusters[i] = [];
    }
    buildCluster();

} 
function clean()
{
    location.reload();
}
