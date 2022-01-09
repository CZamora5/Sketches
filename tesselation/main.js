import {Polygon, Vector} from '../js/utils/polygon.js';

const canvas = document.getElementById("my-canvas");
const ctx = canvas.getContext("2d");

// setup
ctx.lineWidth = 1;
ctx.strokeStyle = "black";
const width = Math.min(window.innerWidth * 0.9, 600);
const height = Math.min(window.innerHeight * 0.8, 600);
canvas.width = width;
canvas.height = height;

let canvasData;
let polygons, poly;

function setup() {
  polygons = [];
  ctx.clearRect(0, 0, width, height);
  canvasData = ctx.getImageData(0, 0, width, height);
  updateCanvas();
  poly = new Polygon();
  poly.addVertex(new Vector(0, 0));
  poly.addVertex(new Vector(0, height - 1));
  poly.addVertex(new Vector(width - 1, 0));
  poly.addVertex(new Vector(width - 1, height - 1));
  poly.sortVertices();
  polygons.push(poly);
}

setup();

function generateLines(polygon) {
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

let interval = setInterval(animate, 50);

function animate() {

  // if (!done) requestAnimationFrame(animate);
  if (polygons.length === 0) clearInterval(interval);

  let index = Math.floor(Math.random() * polygons.length);
  [poly] = polygons.splice(index, 1);
  
  let [p1, p2] = getIntersection(generateLines(poly));
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

  if (area1 > 1) {
    polygons.push(poly1);
  } 
  if (area2 > 1) {
    polygons.push(poly2);
  }

  if (area1 >= area2 && area1 > 1) {
    paintPolygon(poly1, randomColorRGB());
  } else if (area2 >= area1 && area2 > 1) {
    paintPolygon(poly2, randomColorRGB());
  }

  // ctx.strokeStyle = "#FFF";
  // ctx.beginPath();
  // ctx.moveTo(p1.x, p1.y);
  // ctx.lineTo(p2.x, p2.y);
  // ctx.stroke();
}

function randomColor() {
  let color = {
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 100),
    l: Math.floor(Math.random() * 100)
  };
  return HSLtoRGB(color);
}

function randomColorRGB() {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256)
  };
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

function paintPolygon(polygon, {r, g, b}) {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      if (polygon.isPointInside(new Vector(i, j))) {
        drawPixel(i, j, r, g, b);
      }
    }
  }
  updateCanvas();
}

function updateCanvas() {
  ctx.putImageData(canvasData, 0, 0);
}

function drawPixel(x, y, r, g, b, a = 255) {
  const index = (Math.round(x) + Math.round(y) * width) * 4;

  canvasData.data[index + 0] = r;
  canvasData.data[index + 1] = g;
  canvasData.data[index + 2] = b;
  canvasData.data[index + 3] = a;
}

document.addEventListener('keydown', e => {
  if (e.key === "Enter") {
    clearInterval(interval);
    setup();
    interval = setInterval(animate, 50);
  }
});