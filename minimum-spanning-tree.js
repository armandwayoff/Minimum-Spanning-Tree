// Original code by Daniel Shiffman (https://github.com/shiffman) then modified by Armand Wayoff

const border = 10;
const nbrMaxVertices = document.getElementById("nbrVertices").max;

let radiusVertices, thicknessEdges;
let vertices = [];

function setup() {
  let widthCanvas = 0.4 * window.innerWidth;
  let canvas = createCanvas(widthCanvas, 450);
  canvas.parent("canvas");
  regenerate();
}

function regenerate() {
  nbrVertices = document.getElementById("nbrVertices").value;
  radiusVertices = Number(document.getElementById("radiusVertices").value);
  thicknessEdges = radiusVertices / 2;
  vertices = [];
  if (nbrVertices > 0) {
    vertices.push(new Vertex(random(border + radiusVertices, width - radiusVertices - border), random(border + radiusVertices, height - radiusVertices - border)));
    let iter = 1;
    while (iter < nbrVertices) {
      let newVertex = new Vertex(random(border + radiusVertices, width - radiusVertices - border), random(border + radiusVertices, height - radiusVertices - border));
      if (!overlay(newVertex, vertices)) {
        vertices.push(newVertex);
        iter++;
      }
    }
  }
}

function overlay(obj, list) {
  const minDistBetweenVertices = radiusVertices * 3;
  for (let i = 0; i < list.length; i++) {
    if (dist(obj.x, obj.y, list[i].x, list[i].y) <= minDistBetweenVertices) {
      return true;
    }
  }
  return false;
}

function mouseOnCanvas() {
  return (mouseX >= border + radiusVertices && mouseX <= width - radiusVertices - border) && (mouseY >= border + radiusVertices && mouseY <= height - radiusVertices - border);
}

function addVertex(x, y) {
  if (mouseOnCanvas() && vertices.length < nbrMaxVertices) {
    let newVertex = new Vertex(x, y);
    if (!overlay(newVertex, vertices)) {
      vertices.push(newVertex);
    }
  }
}

function deleteVertex() {
  for (let i = 0; i < vertices.length; i++) {
    if (mouseOnCanvas() && keyIsPressed === true && (keyCode === 17 || keyCode === 91) && selectedVertex(i)) {
      vertices.splice(i, 1);
    }
  }
}

function selectedVertex(i) {
  return abs(mouseX - vertices[i].x) < radiusVertices && abs(mouseY - vertices[i].y) < radiusVertices;
}

function mousePressed() {
  if (mouseButton === LEFT) {
    addVertex(mouseX, mouseY);
    deleteVertex();
  }
}

function draw() {
  background(255);

  nbrCurrentVertices.innerHTML = vertices.length;
  for (let i = 0; i < document.getElementsByClassName("nbrMaxVertices").length; i++) {
    document.getElementsByClassName("nbrMaxVertices")[i].innerHTML = nbrMaxVertices;
  }

  let reachedVertices = [];
  let unreachedVertices = [];

  for (let i = 1; i < vertices.length; i++) {
    unreachedVertices.push(vertices[i]);
  }

  reachedVertices.push(vertices[0]);

  while (unreachedVertices.length > 0) {
    let recordDistance = Infinity;
    let reachedIndex;
    let unreachedIndex;
    
    for (let i = 0; i < reachedVertices.length; i++) {
      for (let j = 0; j < unreachedVertices.length; j++) {
        let v1 = reachedVertices[i];
        let v2 = unreachedVertices[j];
        let d = dist(v1.x, v1.y, v2.x, v2.y);
        if (d < recordDistance) {
          recordDistance = d;
          reachedIndex = i;
          unreachedIndex = j;
        }
      }
    }
    stroke(0, 200, 255);
    strokeWeight(thicknessEdges);
    line(reachedVertices[reachedIndex].x, reachedVertices[reachedIndex].y, unreachedVertices[unreachedIndex].x, unreachedVertices[unreachedIndex].y);
    reachedVertices.push(unreachedVertices[unreachedIndex]);
    unreachedVertices.splice(unreachedIndex, 1);
  }

  for (let i = 0; i < vertices.length; i++) {
    vertices[i].display();
  }
}

class Vertex {
  constructor(x_, y_) {
    this.x = x_;
    this.y = y_;
  }

  display() {
    stroke(0, 50, 255);
    circle(this.x, this.y, radiusVertices * 2);
  }
}
