document.addEventListener('DOMContentLoaded', function () {
    const drawingCanvas = document.getElementById('drawingCanvas');
    const ctx = drawingCanvas.getContext('2d');
    let drawing = false;

    function getCorrectedCoordinates(e) {
        const rect = drawingCanvas.getBoundingClientRect();
        const scaleX = drawingCanvas.width / rect.width;
        const scaleY = drawingCanvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    drawingCanvas.addEventListener('mousedown', function (e) {
        drawing = true;
        const { x, y } = getCorrectedCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
    });

    drawingCanvas.addEventListener('mousemove', function (e) {
        if (drawing) {
            const { x, y } = getCorrectedCoordinates(e);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    });

    window.addEventListener('mouseup', function (e) {
        if (drawing) {
            const { x, y } = getCorrectedCoordinates(e);

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.closePath();
            drawing = false;
        }
    });

    document.getElementById('ready').addEventListener('click', function () {
        
    });
});

function clean()
{
    location.reload();
}