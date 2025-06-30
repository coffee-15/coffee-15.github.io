const canvas = document.getElementById('carouselCanvas');
const ctx = canvas.getContext('2d');

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

function animate(time) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (isSliding) {
        const elapsed = time - slideStartTime;
        const t = Math.min(elapsed / slideDuration, 1); // normalized time [0, 1]
        const easedT = easeInOutCubic(t);
        const offset = easedT * canvasWidth;

        drawImageScaled(images[currentIndex], -offset);
        drawImageScaled(images[nextIndex], canvasWidth - offset);

        if (t >= 1) {
            currentIndex = nextIndex;
            isSliding = false;
            setTimeout(startSlide, delayBetweenSlides);
        }
    } else {
        drawImageScaled(images[currentIndex], 0);
    }

    requestAnimationFrame(animate);
}


/*
// Load images
let loaded = 0;
imagePaths.forEach(src => {
  const img = new Image();
  img.src = src;
  img.onload = () => {
    loaded++;
    if (loaded === imagePaths.length) {
      requestAnimationFrame(animate);
      setInterval(startSlide, slideDuration);
    }
  };
  images.push(img);
});

let sliding = false;

function startSlide() {
  if (!sliding) {
    sliding = true;
    progress = 0;
    nextIndex = (currentIndex + 1) % images.length;
  }
}

function drawImageScaled(img, x) {
  const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
  const sw = img.width * scale;
  const sh = img.height * scale;
  const sx = x + (canvasWidth - sw) / 2;
  const sy = (canvasHeight - sh) / 2;
  ctx.drawImage(img, sx, sy, sw, sh);
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  if (sliding) {
    progress += slideSpeed;
    drawImageScaled(images[currentIndex], -progress);
    drawImageScaled(images[nextIndex], canvasWidth - progress);

    if (progress >= canvasWidth) {
      currentIndex = nextIndex;
      sliding = false;
    }
  } else {
    drawImageScaled(images[currentIndex], 0);
  }

  requestAnimationFrame(animate);
}
  */
