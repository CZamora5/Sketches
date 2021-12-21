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

class Ball {
  constructor(x, y, vx, vy, radius, parentRadius) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
    this.parentRadius = parentRadius;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.02;

    if (this.x*this.x + this.y*this.y >= (this.parentRadius - this.radius)*(this.parentRadius - this.radius)) {
      if (this.x === 0) {
        this.vy *= -1;
        this.y = this.parentRadius - this.radius;
      } else if (this.y === 0) {
        this.vx *= -1;
        x = parentRadius - this.radius;
      } else {
        let aux = this.vx;
        this.vx = -this.vy;
        this.vy = aux;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}


const R = Math.min(width / 2, height / 2) - 10;
const ball1 = new Ball(0, 0, 2 * Math.random() - 1, 2 * Math.random() - 1, 10, R);
const ball2 = new Ball(0, 0, ball1.vx + 0.002 * (Math.random() - 0.5), ball1.vy + 0.002 * (Math.random() - 0.5), 10, R);

const history1 = [[0, 0]];
const history2 = [[0, 0]];

ctx.translate(width / 2, height / 2);

function animate() {
  requestAnimationFrame(animate);
  
  ctx.clearRect(-width /2, -height / 2, width, height);

  ctx.strokeStyle = 'black';
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'red';
  ball1.draw();
  ball1.update();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  if (history1.length === 6000) {
    history1.shift();
  }
  history1.push([ball1.x, ball1.y]);
  ctx.beginPath();
  ctx.moveTo(history1[0][0], history1[0][1]);
  history1.forEach(position => {
    ctx.lineTo(position[0], position[1]);
  });
  // ctx.closePath();
  ctx.stroke();

  ctx.strokeStyle = 'blue';
  ball2.draw();
  ball2.update();
  ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
  if (history2.length === 6000) {
    history2.shift();
  }
  history2.push([ball2.x, ball2.y]);
  ctx.beginPath();
  ctx.moveTo(history2[0][0], history2[0][1]);
  history2.forEach(position => {
    ctx.lineTo(position[0], position[1]);
  });
  // ctx.closePath();
  ctx.stroke();
}

animate();
