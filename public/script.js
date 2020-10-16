console.log("jquery is on", $);
const canvas = document.getElementById("canvas");
// console.log("canvas", canvas);
const context = canvas.getContext("2d");

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
        console.log(x);
        console.log(y);
        context.lineTo(x, y);
        context.stroke();
        canvas.addEventListener("mouseup", () => {
            canvas.removeEventListener("mousemove", draw);
        });
    });
});

/*
const canvasJQ = $("canvas");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const button = $("button");
const signature = $('input[name="signature"]');

// Canvas painting
canvasJQ.on("mousedown", (e) => {
    let x = e.clientX - canvasJQ.eq(0).offset().left;
    let y = e.clientY - canvasJQ.eq(0).offset().top;
    ctx.moveTo(x, y);
    ctx.beginPath();
    canvasJQ.on("mousemove", (e) => {
        let x = e.clientX - canvasJQ.eq(0).offset().left;
        let y = e.clientY - canvasJQ.eq(0).offset().top;
        ctx.lineTo(x, y);
        ctx.stroke();
    });
    canvasJQ.on("mouseup", () => {
        canvasJQ.unbind("mousemove");
        // Obtaining image url
        signature.val(canvas.toDataURL());
    });
});
*/
