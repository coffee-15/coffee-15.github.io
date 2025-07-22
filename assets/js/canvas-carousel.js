const canvas = document.getElementById('carouselCanvas');
const ctx = canvas.getContext('2d');

let trail = [];
const trailLength = 20;
const pixelSize = 60;
const radius = 120;

let images = [];
let imagePaths = [
    '/assets/Pictures/InDeepWatersCover.png',
    '/assets/Pictures/MyDreamPC.png',
    '/assets/Pictures/IDW2.png'
];

let currentIndex = 0;
let nextIndex = 1;
let progress = 0;
const slideSpeed = 60;       // px per frame

let isSliding = false;
let slideStartTime = 0;
const slideDuration = 1000; // ms
const delayBetweenSlides = 3000; // ms

let canvasWidth, canvasHeight;

document.addEventListener("mousemove", (e) => {
  trail.push({ x: e.clientX, y: e.clientY });
  if (trail.length > trailLength) trail.shift();
});

function drawPixelatedBackground(img, offsetX = 0) {
  const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;

  const sx = offsetX + (canvasWidth - sw) / 2;
  const sy = (canvasHeight - sh) / 2;

  // Create low-res offscreen canvas
  const scaleCanvas = document.createElement("canvas");
  const scaleCtx = scaleCanvas.getContext("2d");

  const pixelWidth = Math.ceil(sw / pixelSize);
  const pixelHeight = Math.ceil(sh / pixelSize);
  scaleCanvas.width = pixelWidth;
  scaleCanvas.height = pixelHeight;

  // Downscale image with the same aspect ratio
  scaleCtx.drawImage(img, 0, 0, pixelWidth, pixelHeight);

  ctx.imageSmoothingEnabled = false;

  // Draw the upscaled low-res image, aligned the same way
  ctx.drawImage(
    scaleCanvas,
    0, 0, pixelWidth, pixelHeight,
    sx, sy, sw, sh
  );
}

function drawCleanTrail(img, offsetX = 0) {
  const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = offsetX + (canvasWidth - sw) / 2;
  const sy = (canvasHeight - sh) / 2;

  const cols = Math.ceil(canvasWidth / pixelSize);
  const rows = Math.ceil(canvasHeight / pixelSize);

  ctx.imageSmoothingEnabled = true;

  for (let t = 0; t < trail.length; t++) {
    const { x, y } = trail[t];
    const alpha = (t + 1) / trail.length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const px = col * pixelSize;
        const py = row * pixelSize;

        const dx = px + pixelSize / 2 - x;
        const dy = py + pixelSize / 2 - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < radius) {
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            img,
            (px - sx) / scale, (py - sy) / scale, pixelSize / scale, pixelSize / scale,
            px, py, pixelSize, pixelSize
          );
        }
      }
    }
  }

  ctx.globalAlpha = 1.0;
}


function animate(time) {
    ctx.fillStyle = "#000"; // fill black background to avoid flashing
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  //ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (isSliding) {
    const elapsed = time - slideStartTime;
    const t = Math.min(elapsed / slideDuration, 1);
    const easedT = easeInOutCubic(t);
    const offset = easedT * canvasWidth;

    drawPixelatedBackground(images[currentIndex], -offset);
    drawPixelatedBackground(images[nextIndex], canvasWidth - offset);

    drawCleanTrail(images[currentIndex], -offset);
    drawCleanTrail(images[nextIndex], canvasWidth - offset);

    if (t >= 1) {
      currentIndex = nextIndex;
      isSliding = false;
      setTimeout(startSlide, delayBetweenSlides);
    }
  } else {
    drawPixelatedBackground(images[currentIndex], 0);
    drawCleanTrail(images[currentIndex], 0);
  }

  requestAnimationFrame(animate);
}


function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;

    const cssWidth = window.innerWidth;
    const cssHeight = window.innerHeight;

    canvas.style.width = cssWidth + "px";
    canvas.style.height = cssHeight + "px";

    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    canvasWidth = cssWidth;   //only CSS size here
    canvasHeight = cssHeight;
}


resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Load images
let loaded = 0;

imagePaths.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
        loaded++;
        if (loaded === imagePaths.length) {
            setTimeout(startSlide, delayBetweenSlides);
            requestAnimationFrame(animate);
        }
    };
    images.push(img);
});

function easeInOutCubic(t) {
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function startSlide() {
    if (!isSliding) {
        nextIndex = (currentIndex + 1) % images.length;
        slideStartTime = performance.now();
        isSliding = true;
    }
}

function drawImageScaled(img, x) {
    const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
    const sw = img.width * scale;
    const sh = img.height * scale;
    const sx = x + (canvasWidth - sw) / 2;
    const sy = (canvasHeight - sh) / 2;

    ctx.strokeStyle = 'lime';
    ctx.strokeRect(x, 0, canvasWidth, canvasHeight)

    ctx.drawImage(img, sx, sy, sw, sh);
}
