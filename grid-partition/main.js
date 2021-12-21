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

const squareSize = 2;

const colors = new Array(10).fill(0).map(() => {
  let h = Math.floor(Math.random() * 360),
    s = Math.floor(Math.random() * 100),
    l = Math.floor(Math.random() * 100);
  return HSLtoRGB({ h, s, l });
});

const directions = [
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
];

const visited = new Array(Math.floor(width/squareSize) * Math.floor(height / squareSize)).fill(false);
let counter;
let done = false;

function animate() {
  if (!done) requestAnimationFrame(animate);

  const currColor = colors[Math.floor(Math.random() * colors.length)];

  // let x = Math.floor(Math.random() * width),
  //   y = Math.floor(Math.random() * height);

  let x, y;
  done = true;
  outer:
  for (x = 0; x < Math.floor(width / squareSize); x++) {
    for (y = 0; y < Math.floor(height / squareSize); y++) {
      if (!visited[x + y * Math.floor(width / squareSize)]) {
        done = false;
        break outer;
      }
    }
  }

  counter = 0;
  dfsThingy(x, y, currColor);

  updateCanvas();
}

animate();

function dfsThingy(x, y, color) {
  if (counter >= 50) return;
  let { dx, dy } = directions[Math.floor(Math.random() * 4)];

  if (0 <= x && x < Math.floor(width / squareSize) && 0 <= y && y < Math.floor(height / squareSize) && !visited[x + y * Math.floor(width / squareSize)]) {
    drawSquare(x * squareSize, y * squareSize, squareSize, squareSize, color.r, color.g, color.b);
    visited[x + y * Math.floor(width / squareSize)] = true;
  }

  counter++;
  dfsThingy(x + dx, y + dy, color);
}

function drawPixel(x, y, r, g, b, a = 255) {
  const index = (Math.round(x) + Math.round(y) * width) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

function HSLtoRGB({ h, s, l }) {
  let c = ((1 - Math.abs((2 * l) / 100 - 1)) * s) / 100;
  let x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  let m = l / 100 - c / 2;

  let rPrime, gPrime, bPrime;
  if (h < 60) {
    [rPrime, gPrime, bPrime] = [c, x, 0];
  } else if (h < 120) {
    [rPrime, gPrime, bPrime] = [x, c, 0];
  } else if (h < 180) {
    [rPrime, gPrime, bPrime] = [0, c, x];
  } else if (h < 240) {
    [rPrime, gPrime, bPrime] = [0, x, c];
  } else if (h < 300) {
    [rPrime, gPrime, bPrime] = [x, 0, c];
  } else {
    [rPrime, gPrime, bPrime] = [c, 0, x];
  }

  return {
    r: (rPrime + m) * 255,
    g: (gPrime + m) * 255,
    b: (bPrime + m) * 255,
  };
}

function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

function drawSquare(x, y, sqWidth = 2, sqHeight = 2, r, g, b, a = 255) {
  for (let i = 0; i < sqWidth; i++) {
    let index = (Math.round(x) + i + Math.round(y) * width) * 4;
    for (let j = 0; j < sqHeight; j++) {
      index += 4 * j * width;
      if (index >= 4 * height * width) continue;
      canvasData.data[index + 0] = r;
      canvasData.data[index + 1] = g;
      canvasData.data[index + 2] = b;
      canvasData.data[index + 3] = a;
    }
  }
}
