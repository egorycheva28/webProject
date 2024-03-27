let canvas=document.getElementById("canvas");
let context=canvas.getContext("2d");
let points=[];
let clusters=[];
function drawPoint(x,y)
{
    context.beginPath();
    context.arc(x,y,2,0,Math.PI*2);
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
