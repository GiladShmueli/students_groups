// let test_results = [98, 29.8, 48, 29, 29,
//                     40, 70.42, 80, 81.34, 89,
                    
//                     22.17, 55, 55,
//                     66, 34, 56, 88, 99,
//                     0, 100, 0, 0, 100];
// test_results.sort((a, b) => a - b); //using lambda, otherwise sorts as strings, 100 is definitely not before 20 ;)


const WIDTH = 420;
const HEIGHT = 300;
const PADDING = 10.5;
const TXTZONE = 22;

function createGraphPNG(test_results, score=NaN) {
    let canvas;
    if(Number.isNaN(score)) //for teacher
        canvas = drawGraph(test_results);
    else    //for student
        canvas = drawMyGraph(test_results, score);
    let imgsrc = canvas.toDataURL("image.png");
    let img = document.createElement("img");
    img.src = imgsrc;
    return img;
}

function drawGraph(test_results) {
    const tests_cnt = test_results.length;
    let canvas = document.createElement("canvas");
    canvas.width = WIDTH + TXTZONE + 2 * PADDING;
    canvas.height = HEIGHT + 3 * PADDING;
    let ctx = canvas.getContext("2d");
    let x, y;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    drawGrid(ctx, tests_cnt, 10);
    ctx.fillStyle = "#55AAEE";
    ctx.strokeStyle = "#55AAEE";

    for (let i = 0; i < tests_cnt; i++) {
        makeCircle(x, y, ctx);
        x = PADDING + TXTZONE + i * WIDTH / tests_cnt;
        y = HEIGHT + PADDING - test_results[i] * 3;
        drawLine(x, y, ctx);
    }
    makeCircle(x, y, ctx);
    return canvas;
}

//draw graph and mark my score (a student's score)
function drawMyGraph(test_results, score) {
    const tests_cnt = test_results.length;
    let marked = false;
    let color = "#55AAEE";
    let canvas = document.createElement("canvas");
    canvas.width = WIDTH + TXTZONE + 2 * PADDING;
    canvas.height = HEIGHT + 3 * PADDING;
    let ctx = canvas.getContext("2d");
    let x, y;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    drawGrid(ctx, tests_cnt, 10);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    x = PADDING + TXTZONE + 0 * WIDTH / tests_cnt;
    y = HEIGHT + PADDING - test_results[0] * 3;
    makeCircle(x, y, ctx);

    for (let i = 0; i < tests_cnt; i++) {
        if(!marked)
        {
            if(test_results[i]===score)
            {
                ctx.fillStyle = "#FF1A10";
                marked = true;
            }
        } else
        {
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
        }
        x = PADDING + TXTZONE + i * WIDTH / tests_cnt;
        y = HEIGHT + PADDING - test_results[i] * 3;
        drawLine(x, y, ctx);
        makeCircle(x, y, ctx);
    }
    
    return canvas;

}

function drawLine(x, y, ctx) {  
    ctx.lineTo(x, y);
    ctx.stroke();
}

function makeCircle(x, y, ctx) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

function drawGrid(ctx, xlines, ylines) {
    let x, y;
    ctx.strokeStyle = "#EEDDFF";
    ctx.textAlign = "right";
    for(var i=0 ; i < xlines ; i++)
    {
        x = PADDING + TXTZONE + i*WIDTH/xlines;
        ctx.beginPath();
        ctx.moveTo( x, PADDING);
        ctx.lineTo( x, PADDING + HEIGHT);
        ctx.stroke();
        ctx.fillText(i + 1, x, 2 * PADDING + HEIGHT);
        ctx.closePath();
    }
    x = TXTZONE;
    for(var i=0 ; i <= ylines ; i++)
    {
        y = PADDING + i*HEIGHT/ylines;
        ctx.beginPath();
        ctx.moveTo( PADDING + TXTZONE,  y);
        ctx.fillText(100 - i * ylines, x + 4.5, y);
        ctx.lineTo(  TXTZONE + WIDTH - 2.5, y);
        ctx.stroke();
        ctx.closePath();
        // ctx.beginPath();
        // ctx.fillText(100 - i * ylines, x, y);
        // ctx.closePath();
    }
}