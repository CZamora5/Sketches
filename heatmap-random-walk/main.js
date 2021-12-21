const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

// setup
ctx.lineWidth = 1;
ctx.strokeStyle = "black";
const width = Math.min(window.innerWidth * 0.9, 600);
const height = Math.min(window.innerHeight * 0.8, 600);
canvas.width = width;
canvas.height = height;

const canvasData = ctx.getImageData(0, 0, width, height);

const colors = [
  [0.0, 13, 8, 135],
  [0.14, 84, 2, 163],
  [0.29, 139, 10, 165],
  [0.43, 185, 50, 137],
  [0.57, 219, 92, 104],
  [0.71, 244, 136, 73],
  [0.86, 254, 188, 43],
  [1.0, 240, 249, 33],
];

// for (let i = 0; i < width; i++) {
//   let pct = i / width;

//   let idx = 0;
//   while (pct > colors[idx + 1][0]) idx++;

//   let r = mapping(colors[idx][1], colors[idx + 1][1], pct * 100, colors[idx][0] * 100, colors[idx + 1][0] * 100),
//     g = mapping(colors[idx][2], colors[idx + 1][2], pct * 100, colors[idx][0] * 100, colors[idx + 1][0] * 100),
//     b = mapping(colors[idx][3], colors[idx + 1][3], pct * 100, colors[idx][0] * 100, colors[idx + 1][0] * 100);

//   ctx.strokeStyle = `rgb(${r}, ${g}, ${b})`;
//   ctx.beginPath();
//   ctx.moveTo(i, 0);
//   ctx.lineTo(i, height);
//   ctx.stroke();
// }

function mapping(start, end, percentage, minPercentage, maxPercentage) {
  return (
    start +
    (end - start + 1) *
      ((percentage - minPercentage + 1) / (maxPercentage - minPercentage + 1))
  );
}

function getColor(f, maxF) {
  let pct = f / maxF;

  let idx = 0;
  while (pct > colors[idx + 1][0]) idx++;

  let r = mapping(
      colors[idx][1],
      colors[idx + 1][1],
      pct * 100,
      colors[idx][0] * 100,
      colors[idx + 1][0] * 100
    ),
    g = mapping(
      colors[idx][2],
      colors[idx + 1][2],
      pct * 100,
      colors[idx][0] * 100,
      colors[idx + 1][0] * 100
    ),
    b = mapping(
      colors[idx][3],
      colors[idx + 1][3],
      pct * 100,
      colors[idx][0] * 100,
      colors[idx + 1][0] * 100
    );

  return { r, g, b };
}

// canvas.addEventListener('click', e => {
//   reset();
// });

// colors
// 0.00, (13, 8, 135)
// 0.14, (84, 2, 163)
// 0.29, (139, 10, 165)
// 0.43, (185, 50, 137)
// 0.57, (219, 92, 104)
// 0.71, (244, 136, 73)
// 0.86, (254, 188, 43)
// 1.00, (240, 249, 33)

// const
// const pixels

let x = Math.floor(width / 4),
  y = Math.floor(height / 4);
const freq = new Array(Math.floor(width * height / 4)).fill(0);
// for (let i = 0; i < 100; i++) {
//   drawPixel(x + i, y, 0, 255, 0);
//   // drawPixel(x + i, y + 0.3, 255, 0, 0);
// }

// updateCanvas();

// ctx.strokeStyle = 'red';
// ctx.beginPath();
// ctx.moveTo(x, y + 0.3);
// ctx.lineTo(x + 100, y + 0.3);
// ctx.stroke();

// ctx.strokeStyle = 'blue';
// ctx.beginPath();
// ctx.moveTo(x, y);
// ctx.lineTo(x + 100, y);
// ctx.stroke();

// ctx.strokeStyle = 'yellow';
// ctx.beginPath();
// ctx.moveTo(x, y + 0.1);
// ctx.lineTo(x + 100, y + 0.1);
// ctx.stroke();

let maxFreq = 0;
function animate() {
  requestAnimationFrame(animate);

  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  let dx = (Math.random() - 0.5) * 2,
    dy = (Math.random() - 0.5) * 2;

  let pixelX = Math.round(x + dx);
  let pixelY = Math.round(y + dy);
  freq[pixelX + pixelY * Math.floor(width / 2)]++;

  let currFreq = freq[pixelX + pixelY * Math.floor(width / 2)];
  if (currFreq > maxFreq) {
    maxFreq = currFreq;
    for (let i = 0; i < width / 2; i++) {
      for (let j = 0; j < height / 2; j++) {
        let f = freq[i + j * Math.floor(width / 2)];
        if (f === 0) continue;
        let { r, g, b } = getColor(f, maxFreq);
        drawSquare(2 * i, 2 * j, 2, 2, r, g, b);
      }
    }
  } else {
    let { r, g, b } = getColor(currFreq, maxFreq);
    drawSquare(2 * pixelX, 2 * pixelY, 2, 2, r, g, b);
  }
  updateCanvas();
  // ctx.beginPath();
  // ctx.moveTo(Math.round(x), Math.round(y));
  // ctx.lineTo(pixelX, pixelY);
  // ctx.stroke();
  x += dx;
  y += dy;
}

function drawPixel(x, y, r, g, b, a = 255) {
  const index = (Math.round(x) + Math.round(y) * width) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

function drawSquare(x, y, sqWidth = 2, sqHeight = 2, r, g, b, a = 255) {
  for (let i = 0; i < sqWidth; i++) {
    let index = (Math.round(x) + i + Math.round(y) * width) * 4;
    for (let j = 0; j < sqHeight; j++) {
      index += 4 * j * width;
      canvasData.data[index + 0] = r;
      canvasData.data[index + 1] = g;
      canvasData.data[index + 2] = b;
      canvasData.data[index + 3] = a;
    }
  }
}

function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

animate();
