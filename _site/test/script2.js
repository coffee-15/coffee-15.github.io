const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

// Load original image
const img = new Image();
img.src = "IDW2.png";

// Create a trail mask
const trailCanvas = document.createElement("canvas");
trailCanvas.width = width;
trailCanvas.height = height;
const trailCtx = trailCanvas.getContext("2d");

// Create pixelated version
const pixelCanvas = document.createElement("canvas");
pixelCanvas.width = width / 10;
pixelCanvas.height = height / 10;
const pixelCtx = pixelCanvas.getContext("2d");

let mouseX = -9999, mouseY = -9999;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

img.onload = () => {
  requestAnimationFrame(draw);
};

function draw() {
  // Step 1: Draw full clear image
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  // Step 2: Update trail mask (white where cursor is, fade out old)
  trailCtx.fillStyle = "rgba(0, 0, 0, 0.1)"; // fade effect
  trailCtx.fillRect(0, 0, width, height);

  trailCtx.beginPath();
  trailCtx.fillStyle = "white";
  trailCtx.arc(mouseX, mouseY, 80, 0, Math.PI * 2);
  trailCtx.fill();

  // Step 3: Draw pixelated image to offscreen canvas
  pixelCtx.imageSmoothingEnabled = false;
  pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
  pixelCtx.drawImage(img, 0, 0, pixelCanvas.width, pixelCanvas.height);

  // Step 4: Draw pixelated image stretched back on main canvas
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(pixelCanvas, 0, 0, pixelCanvas.width, pixelCanvas.height, 0, 0, width, height);
  ctx.restore();

  // Step 5: Use trail mask to mask out only the area for pixel effect
  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(trailCanvas, 0, 0);
  ctx.restore();

  requestAnimationFrame(draw);
}
