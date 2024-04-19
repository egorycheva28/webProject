const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });


let nnRun = false;

const pixels = Array.from({ length: 2500 }, () => [0]);

document.addEventListener('DOMContentLoaded', function () {
    let drawing = false;


    function setPixel(x, y) {
        if (x < 50 && y < 50 && x >= 0 && y >= 0) {
            pixels[y * 50 + x][0] = 1;
        }
    }


    function getCorrectedCoordinates(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: Math.floor((e.clientX - rect.left) * scaleX),
            y: Math.floor((e.clientY - rect.top) * scaleY)
        };
    }


    canvas.addEventListener('mousedown', function (e) {
        drawing = true;
        const { x, y } = getCorrectedCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setPixel(x, y);
    });

    canvas.addEventListener('mousemove', function (e) {
        if (drawing && (!nnRun)) {
            const { x, y } = getCorrectedCoordinates(e);
            ctx.lineTo(x, y);
            ctx.stroke();
            setPixel(x, y);
        }
    });

    window.addEventListener('mouseup', function (e) {
        if (drawing && (!nnRun)) {
            const { x, y } = getCorrectedCoordinates(e);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            setPixel(x, y);
            drawing = false;
        }
    });

});

document.getElementById('ready').addEventListener('click', function () {
    if (!NN) {
        console.error("Neural Network is not initialized yet!");
        return;
    }
    nnRun = true;
    let output = NN.predict(pixels);
    console.log("Predicted Output:", output);
    alert("Predicted digit: " + output);


    // console.log("Input Column:", pixels);
});


function clean() {
    location.reload();
    nnRun = false;
}

function show(menu) {
    let element = document.getElementById(menu);
    if (element) {
        element.style.display = "block";
    }
}