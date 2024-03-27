
function draw(){
    let input = document.querySelector('input');
    let points=[];
    let clusters=[];
    let n=input.value;

    

    let canvas=document.getElementById("canvas");
    let context=canvas.getContext("2d");

    canvas.addEventListener("click",function(event)
    {
        if (points.length < n) { 
            let rect=canvas.getBoundingClientRect();
            let x=event.clientX-rect.left;
            let y=event.clientY-rect.top;
            points.push({x,y});
            context.beginPath();
            context.arc(x,y,2,0,Math.PI*2);
            //context.fillStyle="black";
            context.fill();
            context.stroke();
        }
            
    });
    
}

function clear(){
    let canvas=document.getElementById("canvas");
    let context=canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
}
