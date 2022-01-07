export class Polygon {
  constructor(vertices = []) {
    this.vertices = vertices;
  }

  get area() {
    let area = 0,
      n = this.vertices.length;
    for (let i = 0; i < n; i++) {
      area +=
        (this.vertices[i].x * this.vertices[(i + 1) % n].y -
          this.vertices[(i + 1) % n].x * this.vertices[i].y) /
        2;
    }
    return Math.abs(area);
  }

  addVertex(vertex) {
    this.vertices.push(vertex);
    this.sortVertices();
  }

  sortVertices() {
    let centroid = new Vector(0, 0);
    this.vertices.forEach(vertex => {
      centroid.add(vertex);
    });
    centroid.divide(this.vertices.length);

    this.vertices.sort((vert1, vert2) => Vector.sub(vert2, centroid).dir - Vector.sub(vert1, centroid).dir);
  }

  isPointInside(vector) {
    const A = [], B = [], C = [];

    for (let i = 0; i < this.vertices.length; i++) {
      p1 = this.vertices[i];
      p2 = this.vertices[(i + 1) % this.vertices.length];
      
      let a = -(p2.y - p1.y);
      let b = p2.x - p1.x;
      let c = -(a * p1.x + b * p1.y);

      A.push(a);
      B.push(b);
      C.push(c);
    }

    const D = [];
    for (let i = 0; i < A.length; i++) {
      let d = A[i] * vector.x + B[i] * vector.y + C[i];
      D.push(d);
    }

    let t1 = D.every(d => d >= 0);
    let t2 = D.every(d => d <= 0);
    return t1 || t2;
  }
}

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
  }

  divide(scalar) {
    this.x /= scalar;
    this.y /= scalar;
  }

  multiply(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  }

  get dir() {
    return Math.atan2(this.y, this.x);
  }

  static add(u, v) {
    return new Vector(u.x + v.x, u.y + v.y);
  }

  static sub(u, v) {
    return new Vector(u.x - v.x, u.y - v.y);
  }
}