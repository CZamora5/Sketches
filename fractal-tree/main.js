const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");
const input = document.querySelector('input[type=range]');
const textAngle = document.querySelector('span');

// setup
ctx.lineWidth = 1;
ctx.strokeStyle = "black";

const width = Math.min(Math.floor(window.innerWidth * 0.9), 600);
const height = Math.min(Math.floor(window.innerHeight * 0.8), 600);
canvas.width = width;
canvas.height = height;

// let interval = setInterval(animate, 150);
const ratio = 2/3;

function drawTree(rotation, length) {
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height);
  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length);
  ctx.stroke();

  ctx.translate(0, -length);
  rotate(-rotation, length * ratio);
  rotate(rotation, length * ratio);
  ctx.restore();
}

function rotate(rotation, length) {
  if (length < 1) return;
  ctx.save();
  ctx.rotate(rotation * Math.PI / 180);

  ctx.strokeStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -length);
  ctx.stroke();

  ctx.translate(0, -length);
  rotate(-rotation, length * ratio);
  rotate(rotation, length * ratio);

  ctx.restore(); //restore canvas state
}

drawTree(20, height / 3);

input.addEventListener('input', e => {
  let angle = e.target.value;
  textAngle.textContent = `Angle: ${angle}`;
  ctx.clearRect(0, 0, width, height);
  drawTree(angle / 2, height / 3);
});