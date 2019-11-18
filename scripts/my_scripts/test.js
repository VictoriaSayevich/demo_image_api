const canvas = document.querySelector('#canvas');
let ctx = canvas.getContext('2d');
canvas.width = 4;
canvas.height = 4;

const w = 512,
    h = 512;

canvas.style.width = `${w}px`;
canvas.style.height = `${h}px`;

const event_move = () => {
    let x = Math.floor(event.offsetX / (w / canvas.width)),
        y = Math.floor(event.offsetY / (h / canvas.height));
    // ctx.fillRect(x, y, Math.floor(w / canvas.width), Math.floor(h / canvas.height));
    ctx.fillRect(x, y, 1, 1);
};

canvas.addEventListener('mousedown', () => {
    canvas.addEventListener('mousemove', event_move);
});

canvas.addEventListener('mouseup', () => {
    canvas.removeEventListener('mousemove', event_move);
});

async function loadImageQ() {

    const image = await loadImage('./assets/work_3.png');

    update();
    let sx = 0,
        sy = 0,
        dWidth = image.width,
        dHeight = image.height;

    if (image.width < image.height) {
        dHeight = canvas.height;
        dWidth = canvas.height / image.height * image.width;
        sx = (canvas.width - dWidth) / 2;
    } else {
        dWidth = canvas.width;
        dHeight = canvas.width / image.width * image.height;
        sy = (canvas.height - dHeight) / 2;
    }
    ctx.drawImage(image, sx, sy, dWidth, dHeight);

    function update() {
        requestAnimationFrame(update)
    }
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        try {
            const image = new Image;
            image.onload = () => resolve(image);
            image.src = src;
        } catch (err) {
            return reject(err);
        }
    })
}

document.querySelector('.btn.load').addEventListener('mousedown', () => {
    loadImageQ();
})