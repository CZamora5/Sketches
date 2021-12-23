const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

// setup
ctx.lineWidth = 1;
const width = Math.min(window.innerWidth * 0.9, 600);
const height = Math.min(window.innerHeight * 0.8, 600);
canvas.width = width;
canvas.height = height;

// ctx.font = "10px monospace";
// ctx.fillText("Hello World", 10, 50); 
// ctx.strokeStyle = "blue";
// ctx.fillStyle = "red";
// ctx.fillText("Hello World", 10, 50);
const fontSize = 10;
ctx.font = "10px arial";
ctx.fillStyle = "#00FF41";
ctx.textAlign = "center";


class Column {
  constructor(height, fontSize, x) {
    this.height = height;
    this.fontSize = fontSize;
    this.size = Math.floor((0.2 + Math.random()) * height / fontSize);
    this.col = this.genCol();
    this.y = Math.floor(Math.random() * -height / 2);
    this.x = x;
    this.prob = 0.8 + Math.random()/10;
  }

  genCol() {
    return new Array(this.size).fill(0).map(() => (Math.random() >= 0.5 ? 1 : 0));
  }

  draw() {
    for (let j = 0; j < this.size; j++) {
      ctx.fillText(this.col[j], this.x * this.fontSize + Math.floor(this.fontSize/2), this.y - j * this.fontSize);
    }
  }

  update() {
    if (Math.random() > this.prob) {
      this.y += this.fontSize;
      if (this.y - this.size * this.fontSize > this.height) {
        this.y = Math.floor(Math.random() * -this.height / 2);
      }
    }
  }
}

const columns = new Array(Math.floor(width / fontSize) + 2).fill(0).map((_, i) => new Column(height, fontSize, i));

function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, width, height);

  columns.forEach(col => {
    col.draw();
    col.update();
  });
}
animate();