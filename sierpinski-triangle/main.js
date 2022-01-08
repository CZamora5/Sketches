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
  poly.addVertex(new Vector(Math.floor(width/2), 0));
  poly.addVertex(new Vector(0, height - 1));
  poly.addVertex(new Vector(width - 1, height - 1));
  poly.sortVertices();
}

setup();

function generateLine(p1, p2) {
  return [new Vector(p1.x, p1.y), Vector.sub(p2, p1)];
}

function getMiddlePoint(v1, v2) {
  v2.multiply(0.5);
  let point = Vector.add(v1, v2);
  
  return point;
}

sierpinski(poly);

function sierpinski(polygon) {
  for (let i = 0; i < polygon.vertices.length; i++) {
    let p1 = polygon.vertices[i],
      p2 = polygon.vertices[(i + 1) % polygon.vertices.length];
    
    ctx.strokeStyle = "#FFF";
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  if (polygon.area > 1) {
    for (let i = 0; i < polygon.vertices.length; i++) {
      let triangle = new Polygon();
      triangle.addVertex(polygon.vertices[i]);

      let p1 = getMiddlePoint(...generateLine(polygon.vertices[i], polygon.vertices[(i + 1) % polygon.vertices.length]));
      let p2 = getMiddlePoint(...generateLine(polygon.vertices[i], polygon.vertices[(i + polygon.vertices.length - 1) % polygon.vertices.length]));

      triangle.addVertex(p1);
      triangle.addVertex(p2);
      sierpinski(triangle);
    }
  }
}