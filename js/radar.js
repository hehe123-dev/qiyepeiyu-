/**
 * 雷达图（Canvas 手绘，无依赖）
 * data: [{ name, rate (0..1) }]  rate 决定顶点距离中心的比例
 */
window.drawRadar = function (canvas, data, opts) {
  opts = Object.assign({
    levels: 4,
    color: '#3a7afe',
    fill: 'rgba(58,122,254,0.25)',
    grid: 'rgba(0,0,0,0.08)',
    text: '#333',
    font: '12px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif',
  }, opts || {});

  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || canvas.width;
  const cssH = canvas.clientHeight || canvas.height;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, cssW, cssH);

  const cx = cssW / 2;
  const cy = cssH / 2;
  const R = Math.min(cssW, cssH) / 2 - 32;
  const n = data.length;
  if (n < 3) return;

  // 网格（同心多边形）
  ctx.strokeStyle = opts.grid;
  ctx.lineWidth = 1;
  for (let lv = 1; lv <= opts.levels; lv++) {
    const r = (R * lv) / opts.levels;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // 轴线
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a));
    ctx.stroke();
  }

  // 数据多边形
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const r = R * Math.max(0, Math.min(1, data[i].rate));
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = opts.fill;
  ctx.fill();
  ctx.strokeStyle = opts.color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 顶点圆点
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const r = R * Math.max(0, Math.min(1, data[i].rate));
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = opts.color;
    ctx.fill();
  }

  // 标签
  ctx.fillStyle = opts.text;
  ctx.font = opts.font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
    const lx = cx + (R + 16) * Math.cos(a);
    const ly = cy + (R + 16) * Math.sin(a);
    ctx.fillText(data[i].name, lx, ly);
  }
};
