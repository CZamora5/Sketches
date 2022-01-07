import {Polygon, Vector} from '../js/utils/polygon.js';

const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");


// setup
ctx.lineWidth = 1;
ctx.strokeStyle = "white";

const width = Math.min(Math.floor(window.innerWidth * 0.9), 600);
const height = Math.min(Math.floor(window.innerHeight * 0.8), 600);
canvas.width = width;
canvas.height = height;

let poly;

function setup() {
  poly = new Polygon();
  poly.addVertex(new Vector(0, 0));
  poly.addVertex(new Vector(0, height - 1));
  poly.addVertex(new Vector(width - 1, 0));
  poly.addVertex(new Vector(width - 1, height - 1));
  poly.sortVertices();
}

setup();

function generateLines(polygon) {
  // f(x) = mx + b, given f(x_0) = y_0 and f(x_1) = y_1 it follows
  // m = (y_1 - y_0) / (x_1 - x_0) and b = y_0 - x_0 * (y_1 - y_0) / (x_1 - x_0)
  // let us better use a simple parametrization gamma(t) = v1 + t * (v2 - v1) where v1 and v2 are the vectors representing two vertices
  let lines = [];
  for (let i = 0; i < polygon.vertices.length; i++) {
    lines.push([new Vector(polygon.vertices[i].x, polygon.vertices[i].y), Vector.sub(polygon.vertices[(i + 1) % polygon.vertices.length], polygon.vertices[i])]);
  }
  return lines;
}

function getIntersection(lines) {
  let r1 = Math.floor(Math.random() * lines.length);
  let r2 = Math.floor(Math.random() * lines.length);
  while (r2 === r1) {
    r2 = Math.floor(Math.random() * lines.length);
  }

  let v2 = new Vector(lines[r1][1].x, lines[r1][1].y);
  v2.multiply(Math.random());
  let p1 = Vector.add(lines[r1][0], v2);
  
  v2 = new Vector(lines[r2][1].x, lines[r2][1].y);
  v2.multiply(Math.random());
  let p2 = Vector.add(lines[r2][0], v2);
  
  return [p1, p2];
}

let done = false;
let interval = setInterval(animate, 150);

function animate() {

  // if (!done) requestAnimationFrame(animate);
  if (done) clearInterval(interval);


  let [p1, p2] = getIntersection(generateLines(poly));
  console.log(p1, p2);
  let poly1 = new Polygon();
  let poly2 = new Polygon();
  poly1.addVertex(p1);
  poly1.addVertex(p2);
  poly2.addVertex(p1);
  poly2.addVertex(p2);
  for (let i = 0; i < poly.vertices.length; i++) {

    let currPoint = poly.vertices[i];

    let a = -(p2.y - p1.y);
    let b = p2.x - p1.x;
    let c = -(a * p1.x + b * p1.y);

    let d = a * currPoint.x + b * currPoint.y + c;

    if (d <= 0) {
      poly1.addVertex(new Vector(currPoint.x, currPoint.y));
    }

    if (d >= 0) {
      poly2.addVertex(new Vector(currPoint.x, currPoint.y));
    }
  }

  poly1.sortVertices();
  poly2.sortVertices();

  let area1 = poly1.area;
  let area2 = poly2.area;

  if (area1 >= area2) {
    poly = poly1;
    if (area1 <= 1) done = true;
  } else {
    poly = poly2;
    if (area2 <= 1) done = true;
  }

  console.log(poly.area);
  ctx.strokeStyle = "#FFF";
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.stroke();
}
// --clr-dark: 38 38 38;

document.addEventListener('keydown', e => {
  if (e.key === "Enter") {
    clearInterval(interval);
    ctx.clearRect(0, 0, width, height);
    setup();
    done = false;
    interval = setInterval(animate, 150);
  }
});