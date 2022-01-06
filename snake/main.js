const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

// setup
ctx.lineWidth = 1;
ctx.strokeStyle = "black";
ctx.fillStyle = "#00FF41";

const sqSize = 10;
const width = Math.floor(Math.min(Math.floor(window.innerWidth * 0.9), 600) / sqSize);
const height = Math.floor(Math.min(Math.floor(window.innerHeight * 0.8), 600) / sqSize);
canvas.width = width * sqSize;
canvas.height = height * sqSize;

let canvasData = ctx.getImageData(0, 0, width * sqSize, height * sqSize);

class Segment {
  constructor(x, y, dir = null) {
    this.x = x;
    this.y = y;
    this.dir = dir;
  }

  move() {
    if (directions.has(`${this.x}, ${this.y}`)) {
      this.dir = directions.get(`${this.x}, ${this.y}`);

      if (this === snake.segments[snake.segments.length - 1]) {
        directions.delete(`${this.x}, ${this.y}`);
      }
    }
    if (this.dir === null) return;
    this.x += this.dir.x;
    this.y += this.dir.y;

    if (this.x >= width) this.x = 0;
    else if (this.x < 0) this.x = width - 1;

    if (this.y >= height) this.y = 0;
    else if (this.y < 0) this.y = height - 1;
  }

  draw() {
    drawSquare(this.x * sqSize, this.y * sqSize, sqSize, sqSize, 0, 255, 64);
  }
}

class Snake {
  constructor(x, y) {
    this.size = 1;
    this.segments = [];
    this.segments.push(new Segment(x, y));
  }

  changeDir(dir) {
    if (dir !== this.segments[0].dir) {
      this.segments[0].dir = dir;
    }
  }

  update(foodX, foodY) {
    if (foodX === this.segments[0].x && foodY === this.segments[0].y) {
      let tail = this.segments[this.segments.length - 1];
      this.segments.push(new Segment(tail.x - tail.dir.x, tail.y - tail.dir.y, tail.dir));
      return [Math.floor(Math.random() * width), Math.floor(Math.random() * height)];
    }

    return [foodX, foodY];
  }

  clear() {
    this.segments.forEach(segment => {
      drawSquare(segment.x * sqSize, segment.y * sqSize, sqSize, sqSize, 0, 0, 0);
    });
  }
}

let foodX = Math.floor(Math.random() * width);
let foodY = Math.floor(Math.random() * height);
drawSquare(foodX * sqSize, foodY * sqSize, sqSize, sqSize, 255, 0, 0);

const snake = new Snake(Math.floor(width / 2), Math.floor(height / 2));
// snake.changeDir({x: 1, y: 0});
let head = snake.segments[0];

function animate() {
  // requestAnimationFrame(animate);

  [foodX, foodY] = snake.update(foodX, foodY);
  drawSquare(foodX * sqSize, foodY * sqSize, sqSize, sqSize, 255, 0, 0);
  snake.segments.forEach(segment => {
    segment.draw();
  });
  updateCanvas();
  
  snake.segments.forEach(segment => {
    if (segment !== head && segment.x === head.x && segment.y === head.y) {
      ctx.fillStyle = "#00FF41";
      ctx.font = "40px arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", Math.floor(width*sqSize / 2), Math.floor(height*sqSize / 2));
      // ctx.fillText("Game Over", 100, 100);
      clearInterval(interval);
      document.removeEventListener('keydown', addDir);
      return;
    };
  });

  snake.clear();
  snake.segments.forEach(segment => {
    segment.move();
  });
  // segment.move();

  // resetCanvas();
  // ctx.beginPath();
  // ctx.moveTo(Math.round(x), Math.round(y));
  // ctx.lineTo(pixelX, pixelY);
  // ctx.stroke();
}

const directions = new Map();

function addDir(e) {
  switch (e.keyCode) {
    case 37:
      directions.set(`${snake.segments[0].x}, ${snake.segments[0].y}`, {x: -1, y: 0});
      break;
    case 38:
      directions.set(`${snake.segments[0].x}, ${snake.segments[0].y}`, {x: 0, y: -1});
      break;
    case 39:
      directions.set(`${snake.segments[0].x}, ${snake.segments[0].y}`, {x: 1, y: 0});
      break;
    case 40:
      directions.set(`${snake.segments[0].x}, ${snake.segments[0].y}`, {x: 0, y: 1});
      break;
  }
} 

let interval = setInterval(animate, 100);
document.addEventListener('keydown', addDir);

function drawSquare(x, y, sqWidth = 2, sqHeight = 2, r, g, b, a = 255) {
  for (let i = 0; i < sqWidth; i++) {
    let index = (Math.round(x) + i + Math.round(y) * canvas.width) * 4;
    for (let j = 0; j < sqHeight; j++) {
      index += 4 * canvas.width;
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

function resetCanvas() {
  // ctx.fillStyle = "#00FF41";
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvasData = ctx.getImageData(0, 0, width * sqSize, height * sqSize);
}

animate();
