window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pixelSize = 40;
  const radius = 120;
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
    // Step 1: Draw pixelated image as the background
    const scaleCanvas = document.createElement("canvas");
    const scaleCtx = scaleCanvas.getContext("2d");

    const sw = canvas.width / pixelSize;
    const sh = canvas.height / pixelSize;
    scaleCanvas.width = sw;
    scaleCanvas.height = sh;

    // Draw and scale image
    scaleCtx.drawImage(img, 0, 0, sw, sh);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(scaleCanvas, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);

    // Step 2: Draw sharp-edged pixel blocks for trail
    const cols = Math.floor(canvas.width / pixelSize);
    const rows = Math.floor(canvas.height / pixelSize);

    for (let i = 0; i < trail.length; i++) {
      const { x, y } = trail[i];
      const alpha = (i + 1) / trail.length;

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
              px, py, pixelSize, pixelSize,
              px, py, pixelSize, pixelSize
            );
          }
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
});
