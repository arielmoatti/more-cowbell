const canvas = document.getElementById("canvas");
let x,
    y,
    drawPing = null;

if (canvas) {
    const context = canvas.getContext("2d");
    const signCanvas = document.querySelector('input[name="signature"]');

    canvas.addEventListener("mousedown", (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;

        drawStart();

        if (!drawPing) {
            drawPing = setInterval(draw, 1);
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        x = e.clientX - canvas.offsetLeft;
        y = e.clientY - canvas.offsetTop;
    });

    canvas.addEventListener("mouseup", () => {
        drawEnd();
    });

    drawStart = () => {
        context.strokeStyle = "cornflowerblue";
        context.lineCap = "round";
        context.lineJoin = "round";

        context.beginPath();
        context.moveTo(x, y);
    };

    draw = () => {
        context.lineTo(x, y);
        context.stroke();
    };

    drawEnd = () => {
        clearInterval(drawPing);
        drawPing = null;
        context.closePath();
        signCanvas.value = canvas.toDataURL();
    };
}
