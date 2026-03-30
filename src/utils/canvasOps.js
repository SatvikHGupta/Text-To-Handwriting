// Pure canvas drawing operations, no React or store dependencies

export function configureContext(ctx, { tool, color, lineWidth }) {
  if (tool === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)';
    ctx.lineWidth   = lineWidth * 3;
  } else {
    ctx.globalCompositeOperation = 'source-over';
    ctx.strokeStyle = color;
    ctx.lineWidth   = lineWidth;
  }
  ctx.lineCap  = 'round';
  ctx.lineJoin = 'round';
}

export function getEventPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const src  = e.touches ? e.touches[0] : e;
  return {
    x: (src.clientX - rect.left) * (canvas.width  / rect.width),
    y: (src.clientY - rect.top)  * (canvas.height / rect.height),
  };
}

export function getEndEventPos(e, canvas) {
  const rect = canvas.getBoundingClientRect();
  const src  = e.changedTouches ? e.changedTouches[0] : e;
  return {
    x: (src.clientX - rect.left) * (canvas.width  / rect.width),
    y: (src.clientY - rect.top)  * (canvas.height / rect.height),
  };
}

export function drawLine(ctx, start, end) {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();
}

export function drawRect(ctx, start, end) {
  ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
}

export function drawCircle(ctx, start, end) {
  const rx = Math.abs(end.x - start.x) / 2;
  const ry = Math.abs(end.y - start.y) / 2;
  ctx.beginPath();
  ctx.ellipse(start.x + (end.x - start.x) / 2, start.y + (end.y - start.y) / 2, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
}

export function isCanvasEmpty(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
  return !data.some((ch, i) => i % 4 === 3 && ch > 0);
}

export function restoreSnapshot(canvas, dataUrl) {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(img, 0, 0);
      resolve();
    };
    img.src = dataUrl;
  });
}
