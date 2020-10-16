// console.log("jquery is on", $);
const canvas = document.getElementById("canvas");
if (canvas) {
    const context = canvas.getContext("2d");
    const signCanvas = document.querySelector('input[name="signature"]');

    canvas.addEventListener("mousedown", (e) => {
        let x = e.clientX - canvas.offsetLeft;
        let y = e.clientY - canvas.offsetTop;
        console.log("click x", x);
        console.log("click y", y);
        context.beginPath();
        context.moveTo(x, y);

        canvas.addEventListener("mousemove", function draw(e) {
            let x = e.clientX - canvas.offsetLeft;
            let y = e.clientY - canvas.offsetTop;
            console.log("position x", x);
            console.log("position y", y);
            context.lineTo(x, y);
            context.stroke();

            canvas.addEventListener("mouseup", () => {
                canvas.removeEventListener("mousemove", draw);
                signCanvas.value = canvas.toDataURL();
            });
        });
    });
}
