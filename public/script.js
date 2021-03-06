const modal = $(".modal");
const modalBtn = $(".modalBtn");

// for canvas
const canvas = document.getElementById("canvas");
let x,
    y,
    drawPing = null;

// canvas functions
if (canvas) {
    const context = canvas.getContext("2d");
    const signCanvas = document.querySelector('input[name="signature"]');

    canvas.addEventListener("mousedown", (e) => {
        //shorthanded without ()
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;

        drawStart();

        if (!drawPing) {
            drawPing = setInterval(draw, 1);
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        //shorthanded without ()
        x = e.pageX - canvas.offsetLeft;
        y = e.pageY - canvas.offsetTop;
    });

    canvas.addEventListener("mouseup", () => drawEnd()); //shorthanded without {}

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

//visibility of modals
modalBtn.on("click", () => {
    modal.fadeOut(500);
});
