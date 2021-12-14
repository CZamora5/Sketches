export class Polygon {
  constructor(vertices = []) {
    this.vertices = vertices;
  }

  get Area() {
    let area = 0,
      n = this.vertices.length;
    for (let i = 0; i < n; i++) {
      area +=
        (this.vertices[i].x * this.vertices[(i + 1) % n].y -
          this.vertices[(i + 1) % n].x * this.vertices[i].y) /
        2;
    }
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