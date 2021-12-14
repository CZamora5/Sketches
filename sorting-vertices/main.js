import {Polygon, Vector} from '../js/utils/polygon.js';

const canvas = document.getElementById('my-canvas');
const ctx = canvas.getContext('2d');

 // setup
ctx.lineWidth = 1;
ctx.strokeStyle = 'black';
canvas.width = Math.min(window.innerWidth * 0.9, 600);
canvas.height = Math.min(window.innerHeight * 0.8, 600);

const polygon = new Polygon();

canvas.addEventListener('click', e => {
  let vertex = new Vector(e.offsetX, e.offsetY);
  // console.log(vertex);
  polygon.addVertex(vertex);
});


function animate() {
  requestAnimationFrame(animate);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  polygon.vertices.forEach(vertex => {
    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, 5, 0, 2 * Math.PI);
    ctx.stroke();
  });
  
  let n = polygon.vertices.length;
  if (n) {
    ctx.beginPath();
    ctx.moveTo(polygon.vertices[0].x, polygon.vertices[0].y);
  }
  
  for (let i = 0; i < n; i++) {
    ctx.lineTo(polygon.vertices[(i + 1) % n].x, polygon.vertices[(i + 1) % n].y);
    ctx.stroke();
  }
}

animate();