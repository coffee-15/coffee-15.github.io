const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

const img = new Image();
img.src = "IDW2.jpeg";

// Mouse position
let mouseX = -9999, mouseY = -9999;

// Canvas to hold trail mask
const trailCanvas = document.createElement("canvas");
trailCanvas.width = width;
trailCanvas.height = height;
const trailCtx = trailCanvas.getContext("2d");

// Canvas for pixelated version
const pixelCanvas = document.createElement("canvas");
pixelCanvas.width = width / 10;
pixelCanvas.height = height / 10;
const pixelCtx = pixelCanvas.getContext("2d");

// Canvas for masked pixelated trail
const pixelTrailCanvas = document.createElement("canvas");
pixelTrailCanvas.width = width;
pixelTrailCanvas.height = height;
const pixelTrailCtx = pixelTrailCanvas.getContext("2d");

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

img.onload = () => {
  animate();
};

function animate() {
  // Step 1: draw full-resolution image as background
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Step 2: update trail mask with fading
  trailCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
  trailCtx.fillRect(0, 0, width, height);
  trailCtx.fillStyle = "white";
  trailCtx.beginPath();
  trailCtx.arc(mouseX, mouseY, 80, 0, Math.PI * 2);
  trailCtx.fill();

  // Step 3: create pixelated version (downscale & upscale)
  pixelCtx.imageSmoothingEnabled = false;
  pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  pixelCtx.drawImage(img, 0, 0, pixelCanvas.width, pixelCanvas.height);

  // Step 4: prepare masked pixelated area on intermediate canvas
  pixelTrailCtx.clearRect(0, 0, width, height);
  pixelTrailCtx.imageSmoothingEnabled = false;
  pixelTrailCtx.drawImage(
    pixelCanvas,
    0, 0, pixelCanvas.width, pixelCanvas.height,
    0, 0, width, height
  );

  pixelTrailCtx.globalCompositeOperation = "destination-in";
  pixelTrailCtx.drawImage(trailCanvas, 0, 0);
  pixelTrailCtx.globalCompositeOperation = "source-over";

  // Step 5: draw pixelated trail OVER normal image
  ctx.drawImage(pixelTrailCanvas, 0, 0);

  requestAnimationFrame(animate);
}
