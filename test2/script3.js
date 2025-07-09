window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pixelSize = 12;
  const radius = 100;
  const trailLength = 20; // number of trail points
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

    // Add current position to trail
    trail.push({ x: mouseX, y: mouseY });
    if (trail.length > trailLength) trail.shift(); // remove oldest if exceeding limit
  });

  function draw() {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const scaleCanvas = document.createElement("canvas");
    const scaleCtx = scaleCanvas.getContext("2d");

    const sw = canvas.width / pixelSize;
    const sh = canvas.height / pixelSize;
    scaleCanvas.width = sw;
    scaleCanvas.height = sh;

    scaleCtx.drawImage(img, 0, 0, sw, sh);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // Draw trail with decreasing alpha
    for (let i = 0; i < trail.length; i++) {
      const { x, y } = trail[i];
      const alpha = (i + 1) / trail.length;

      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.globalAlpha = alpha; // fading trail
      ctx.drawImage(scaleCanvas, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    ctx.globalAlpha = 1.0;
    ctx.restore();

    requestAnimationFrame(draw);
  }
});
