let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");

let points=[];
let clusters=[];
let collorCenter=['red','green','blue','yellow','purple'];

let centers=[];
let allVector = [];
let flagPoints = true;
let flagCenters=true;

canvas.addEventListener("click",function(event){
    
    if(flagPoints==true)
    {
        let rect=canvas.getBoundingClientRect();
        let x=event.clientX-rect.left;
        let y=event.clientY-rect.top;
        let point = {
            pointx: x,
            pointy: y
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
/*canvas.onclick = function (event) { //get dot
    if (flag === true){
        //let x = event.offsetX;
        //let y = event.offsetY;
        let rect=canvas.getBoundingClientRect();
        let x=event.clientX-rect.left;
        let y=event.clientY-rect.top;
        let dot = {
            dotx: x,
            doty: y
        }
        points.push(dot);
        context.fillStyle = "black";
        context.beginPath();
        context.arc(x,y,10,0,2*Math.PI);
        context.stroke();
        context.fill();
    }
    return points;
}*/
//document.getElementById("clearButton").onclick = clean;
//document.getElementById("addCentroidButton").onclick = addCenter;
//document.getElementById("addCentroidButton").onclick = addCentroid;

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
                X: points[randomCenter].pointx,
                Y: points[randomCenter].pointy,
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

function buildCluster()
{
    for(let i=0; i<points.length; i++)
    { // calculating avg coard for i clusters
        let singleDotArry = [];
        for(let j = 0; j<centers.length; j++){
            let dotCoardX = points[i].pointx - centers[j].coardX;
            let dotCoardY = points[i].pointy - centers[j].coardY;
            let vector = Math.pow((Math.pow(dotCoardX,2) + Math.pow(dotCoardY,2)),0.5);
            singleDotArry.push(vector)
        }
        allVector.push(singleDotArry);
    }
    for(let i=0; i<allVector.length; i++)
    {
        let min = allVector[i][0];
        let indexMin = 0;
        for(let j=0 ; j<centers.length; j++)
        {
            if(min > allVector[i][j])
            {
                min = allVector[i][j];
                indexMin = j;
            }
        }
        clusters[indexMin].push(points[i]);
        context.fillStyle = collorCenter[indexMin];
        context.beginPath();
        context.arc(points[i].pointx,points[i].pointy,10,0,2*Math.PI);
        context.stroke();
        context.fill(); 
    }
    return clusters;
}

function clean()
{
    location.reload();
}
