window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pixelSize = 12;
  const radius = 80;

  let mouseX = -9999;
  let mouseY = -9999;

  const img = new Image();
  img.src = 'IDW2.png';

  // Trail mask canvas
  const trailCanvas = document.createElement("canvas");
  trailCanvas.width = canvas.width;
  trailCanvas.height = canvas.height;
  const trailCtx = trailCanvas.getContext("2d");

  // Pixelated image canvas (downscaled)
  const pixelCanvas = document.createElement("canvas");
  pixelCanvas.width = canvas.width / pixelSize;
  pixelCanvas.height = canvas.height / pixelSize;
  const pixelCtx = pixelCanvas.getContext("2d");

  // Final blended canvas: pixelated masked by trail
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = canvas.width;
  finalCanvas.height = canvas.height;
  const finalCtx = finalCanvas.getContext("2d");

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  img.onload = () => {
    requestAnimationFrame(draw);
  };

  function draw() {
    // Step 1: Draw clean background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Step 2: Update trail mask
    trailCtx.fillStyle = "rgba(0, 0, 0, 0.1)";
    trailCtx.fillRect(0, 0, canvas.width, canvas.height);
    trailCtx.fillStyle = "white";
    trailCtx.beginPath();
    trailCtx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
    trailCtx.fill();

    // Step 3: Draw pixelated image to low-res canvas
    pixelCtx.imageSmoothingEnabled = false;
    pixelCtx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    pixelCtx.drawImage(img, 0, 0, pixelCanvas.width, pixelCanvas.height);

    // Step 4: Stretch pixelated image to full size on final canvas
    finalCtx.clearRect(0, 0, canvas.width, canvas.height);
    finalCtx.imageSmoothingEnabled = false;
    finalCtx.drawImage(pixelCanvas, 0, 0, pixelCanvas.width, pixelCanvas.height, 0, 0, canvas.width, canvas.height);

    // Step 5: Mask pixelated image with trail
    finalCtx.globalCompositeOperation = "destination-in";
    finalCtx.drawImage(trailCanvas, 0, 0);
    finalCtx.globalCompositeOperation = "source-over";

    // Step 6: Draw final pixelated-trail overlay on top of original image
    ctx.drawImage(finalCanvas, 0, 0);

    requestAnimationFrame(draw);
  }
});
