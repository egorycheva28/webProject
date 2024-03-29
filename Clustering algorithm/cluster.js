/*let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");
let points=[];
let clusters=[];
canvas.addEventListener("click",function(event)
{
    let rect=canvas.getBoundingClientRect();
    //let x=event.clientX-rect.left;
    //let y=event.clientY-rect.top;
    const x = Math.floor((event.clientX - rect.left)/5);
    const y = Math.floor((event.clientY - rect.top)/5);
    //context.beginPath();
    context.arc(x*5,y*5,5,0,Math.PI*2);
    context.fill();
    //context.closePath();
    //points.push({x,y});
    //drawPoint(x,y);
});
function drawPoint(x,y)
{
    context.beginPath();
    context.fillArc(x,y,5,0,Math.PI*2);
    //context.fillStyle="black";
    context.fill();
    context.closePath();
}*/
let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");
let points=[];
let clusters=[];
function drawPoint(x,y)
{
    context.beginPath();
    context.arc(x,y,5,0,Math.PI*2);
    //context.fillStyle="black";
    context.fill();
    context.stroke();
}
canvas.addEventListener("click",function(event)
{
    let rect=canvas.getBoundingClientRect();
    let x=event.clientX-rect.left;
    let y=event.clientY-rect.top;
    points.push({x,y});
    drawPoint(x,y);
});

