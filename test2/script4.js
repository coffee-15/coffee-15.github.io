window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pixelSize = 40;
  const radius = 100;
  const trailLength = 20;
  const trail = [];

  let mouseX = -100;
  let mouseY = -100;

  const img = new Image();
  img.src = 'IDW2.png';
  img.onload = () => {
    requestAnimationFrame(draw);
  };

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    trail.push({ x: mouseX, y: mouseY });
    if (trail.length > trailLength) trail.shift();
  });

  function draw() {
    // Step 1: Draw pixelated background
    const scaleCanvas = document.createElement("canvas");
    const scaleCtx = scaleCanvas.getContext("2d");

    const sw = canvas.width / pixelSize;
    const sh = canvas.height / pixelSize;
    scaleCanvas.width = sw;
    scaleCanvas.height = sh;

    // Downscale image
    scaleCtx.drawImage(img, 0, 0, sw, sh);
    // Upscale image without smoothing for pixelation
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(scaleCanvas, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);

    // Step 2: Draw clean image inside clipped trail regions
    ctx.save();
    ctx.imageSmoothingEnabled = true; // enable smoothing for clean image

    for (let i = 0; i < trail.length; i++) {
      const { x, y } = trail[i];
      const alpha = (i + 1) / trail.length;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = alpha;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    ctx.globalAlpha = 1.0;
    ctx.restore();

    requestAnimationFrame(draw);
  }
});
