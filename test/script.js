window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pixelSize = 12;
  const radius = 100;
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
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(scaleCanvas, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);

    ctx.restore();

    requestAnimationFrame(draw);
  }
});
