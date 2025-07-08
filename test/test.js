const canvas = document.getElementById("pixelCanvas");
const ctx = canvas.getContext("2d");
const bgImage = document.getElementById("bg");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = -100;
let mouseY = -100;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function drawPixelatedCircle() {
  const radius = 100;
  const pixelSize = 10;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background image into an offscreen canvas
  const offCanvas = document.createElement("canvas");
  offCanvas.width = canvas.width;
  offCanvas.height = canvas.height;
  const offCtx = offCanvas.getContext("2d");
  offCtx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // Loop over pixels inside circle
  for (let y = -radius; y < radius; y += pixelSize) {
    for (let x = -radius; x < radius; x += pixelSize) {
      const dx = mouseX + x;
      const dy = mouseY + y;
      const dist = Math.sqrt(x * x + y * y);

      if (dist < radius) {
        const pixel = offCtx.getImageData(dx, dy, 1, 1).data;
        ctx.fillStyle = `rgba(${pixel[0]},${pixel[1]},${pixel[2]},${pixel[3] / 255})`;
        ctx.fillRect(dx, dy, pixelSize, pixelSize);
      }
    }
  }

  requestAnimationFrame(drawPixelatedCircle);
}

drawPixelatedCircle();
