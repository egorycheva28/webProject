function show(menu)
{
    let element=document.getElementById(menu);
    if(element)
    {
        element.style.display="block";
    }

}

let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");
let points=[];
let centers=[];
let clusters=[];
let allDistances = [];
let collorCenter=['red','green','blue','yellow','purple'];
let flagPoints = true;
let flagCenters=true;

let clustersHierarchy = [];
let dictenceHierarchy = [];
let centroids=[];

canvas.addEventListener("click",function(event)//расставляем точки
{
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
        clustersHierarchy.push([point]);
        context.strokeStyle = 'white';
        context.beginPath();
        context.arc(x,y,10,0,2*Math.PI);
        context.stroke();
        context.fill();
    }

    return points;    
});


function getdistanceMatrix() {
    for (let i = 0; i < clustersHierarchy.length; i++) {
        dictenceHierarchy[i] = [];
        for (let j = 0; j < clustersHierarchy.length; j++) {
            dictenceHierarchy[i][j] = 1000000000000;
        }
    }

}
function euclideanDistance(x1, y1, x2, y2){
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function distanceMatrix(){
    for(let i = 0; i<clustersHierarchy.length;i++){
        for(let j = i; j<clustersHierarchy.length;j++){
            dictenceHierarchy[i][j] = euclideanDistance(centroids[i][0], centroids[i][1], centroids[j][0], centroids[j][1]);
            dictenceHierarchy[j][i] =  dictenceHierarchy[i][j];
        }
    }
}

function centroid(){
    for(let i = 0; i < clustersHierarchy.length; i++)
    {
        let sumX=0;
        let sumY=0;

        for(let j = 0; j < clustersHierarchy[i].length; j++)
        {
            sumX +=clustersHierarchy[i][j].pointX;
            sumY += clustersHierarchy[i][j].pointY;
        }

        if(clustersHierarchy[i].length!==0)
        {      

            centroids[i]=[sumX / clustersHierarchy[i].length, sumY / clustersHierarchy[i].length];
            
        }
    } 
}

function draw(){
    for(let i = 0; i < clustersHierarchy.length; i++){
        for(let j = 0; j < clustersHierarchy[i].length-1; j++){
            context.beginPath();
            context.moveTo(clustersHierarchy[i][j].pointX, clustersHierarchy[i][j].pointY);
            context.lineTo(clustersHierarchy[i][j+1].pointX, clustersHierarchy[i][j+1].pointY);
            context.stroke()
        }
        context.beginPath();
        context.strokeStyle = "rgb(200, 182, 182)";
        context.moveTo(clustersHierarchy[i][clustersHierarchy[i].length-1].pointX, clustersHierarchy[i][clustersHierarchy[i].length-1].pointY);
        context.lineTo(clustersHierarchy[i][0].pointX, clustersHierarchy[i][0].pointY);
        context.stroke();
    }
}

function hierarchy(){
    let input = document.querySelector('input');
    let numberCluster=input.value;

    while(clustersHierarchy.length!=numberCluster){
        getdistanceMatrix();
        centroid();
        distanceMatrix();



        let minn = 100000000000000;
        let min1 = 0;
        let min2 = 0;

        for(let i = 0; i< clustersHierarchy.length;i++){
            for(let j = i+1; j<clustersHierarchy.length;j++){
                if (dictenceHierarchy[i][j]<minn){
                    minn=dictenceHierarchy[i][j]
                     min1 = i;
                     min2 = j;  

                }
            }
        }

        clustersHierarchy[min1].push(...clustersHierarchy[min2]);
        clustersHierarchy.splice(min2, 1);
        draw();
    }

}


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

function redCenters()//переопределяем центры
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

function algorithm()
{
    addCenter();
    Cluster();
    for(let i=0;i<10;i++)
    {
        redCenters();
    }
    hierarchy();
    aaaa();
}

function clean()//очищаем
{
    location.reload();
}



let keys = [];
let mstSet=[];
let tree =[];
let graph =[];
let INF = 900000000;

function findMinKey() {
    let minKey = INF, minIndex = -1;
    for (let v = 0; v < points.length; ++v) {
        if (!mstSet[v] && keys[v] < minKey) {
            minKey = keys[v];
            minIndex = v;
        }
    }
    return minIndex;
}

function getdistanceMatrixe() {
    for (let i = 0; i < points.length; i++) {
        graph[i] = [];
        for (let j = 0; j < points.length; j++) {
            graph[i][j] = 0;
        }
    }

}

function distanceMatrixe(){
    for(let i = 0; i<points.length;i++){
        for(let j = i; j<points.length;j++){
            graph[i][j] = euclideanDistance(points[i].pointX, points[i].pointY, points[j].pointX, points[j].pointY);
            graph[j][i] =  graph[i][j];
        }
    }
}

function primAlgorithm() {
    let parent =[];

    for (let i = 0; i < points.length; i++) {
        keys[i] = INF;
        mstSet[i] = false;
    }

    keys[0] = 0;
    parent[0] = -1;

    for (let count = 0; count < points.length - 1; count++) {
        let u = findMinKey();
        mstSet[u] = true;

        for (let v = 0; v < points.length; ++v) {
            if (graph[u][v] && !mstSet[v] && graph[u][v] < keys[v]) {
                parent[v] = u;
                keys[v] = graph[u][v];
            }
        }
    }



    for (let i = 0; i < points.length; i++) {
        tree[i]=[];
        for (let j = 0; j < points.length; j++) {
            tree[i][j] = 0;
        }
    }

    for (let i = 1; i < points.length; i++) {
        tree[parent[i]][i] = graph[i][parent[i]];
        tree[i][parent[i]] = graph[i][parent[i]];
    }
}

function aaaa(){

    let input = document.querySelector('input');
    let numberCluster=input.value;
    getdistanceMatrixe();
    distanceMatrixe();
    primAlgorithm();
    for(let k =0; k<numberCluster-1;k++){
        let maxx = 0;
        let min1 = 0;
        let min2 = 0;

        for(let i = 0; i< points.length;i++){
            for(let j = i+1; j<points.length;j++){
                if (tree[i][j]>maxx){
                    maxx=tree[i][j]
                     min1 = i;
                     min2 = j;  

                }
            }
        }
        tree[min1][min2]=0;

    }

    for(let i = 0; i< points.length;i++){
        for(let j = i+1; j<points.length;j++){
            if(tree[i][j]!=0){
                context.beginPath();
                context.strokeStyle = "rgb(255,0,0)";
                context.moveTo(points[i].pointX, points[i].pointY);
                context.lineTo(points[j].pointX, points[j].pointY);
                context.stroke()
            }
        }
    }
}