// Original code by Daniel Shiffman (https://github.com/shiffman) then modified by Armand Wayoff

const border = 10;
const nbrMaxVertices = document.getElementById("nbrVertices").max;

let nbrVertices = document.getElementById("nbrVertices").value;
let radiusVertices = Number(document.getElementById("radiusVertices").value);
let thicknessEdges = radiusVertices / 2;
let minDistBetweenVertices = radiusVertices * 3;
let vertices = [];

function setup() {
  let widthCanvas = 0.4 * window.innerWidth;
  let canvas = createCanvas(widthCanvas, 450);
  canvas.parent("app");
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
      let som = new Vertex(random(border + radiusVertices, width - radiusVertices - border), random(border + radiusVertices, height - radiusVertices - border));
      if (!overlay(som, vertices)) {
        vertices.push(som);
        iter++;
      }
    }
  }
}

function overlay(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (dist(obj.x, obj.y, list[i].x, list[i].y) <= minDistBetweenVertices) {
      return true;
    }
  }
  return false;
}

function clickOnCanvas() {
  return (mouseIsPressed && mouseButton === LEFT) && (mouseX >= border + radiusVertices && mouseX <= width - radiusVertices - border) && (mouseY >= border + radiusVertices && mouseY <= height - radiusVertices - border);
}

function addVertex(x, y) {
  if (clickOnCanvas() && vertices.length < nbrMaxVertices) {
    let som = new Vertex(x, y);
    if (!overlay(som, vertices)) {
      vertices.push(som);
    }
  }
}

function deleteVertex() {
  for (let i = 0; i < vertices.length; i++) {
    if (keyIsPressed === true && (keyCode === 17 || keyCode === 91) && selectedVertex(i) && clickOnCanvas()) {
      vertices.splice(i, 1);
    }
  }
}

function selectedVertex(i) {
  return abs(mouseX - vertices[i].x) < radiusVertices && abs(mouseY - vertices[i].y) < radiusVertices;
}

function draw() {
  background(255);

  addVertex(mouseX, mouseY);
  deleteVertex();

  nbrCurrentVertices.innerHTML = vertices.length;
  for (let i = 0; i < document.getElementsByClassName("nbrMaxVertices").length; i++) {
    document.getElementsByClassName("nbrMaxVertices")[i].innerHTML = nbrMaxVertices;
  }

  let reachedVertex = [];
  let unreachedVertex = [];

  for (let i = 1; i < vertices.length; i++) {
    unreachedVertex.push(vertices[i]);
  }

  reachedVertex.push(vertices[0]);


  while (unreachedVertex.length > 0) {
    let recordDistance = Infinity;
    let reachedIndex;
    let unreachedIndex;

    for (let i = 0; i < reachedVertex.length; i++) {
      for (let j = 0; j < unreachedVertex.length; j++) {
        let v1 = reachedVertex[i];
        let v2 = unreachedVertex[j];
        let d = dist(v1.x, v1.y, v2.x, v2.y);

        if (d < recordDistance) {
          recordDistance = d;
          reachedIndex = i;
          unreachedIndex = j;
        }
      }
    }
    stroke(0);
    strokeWeight(thicknessEdges);
    line(reachedVertex[reachedIndex].x, reachedVertex[reachedIndex].y, unreachedVertex[unreachedIndex].x, unreachedVertex[unreachedIndex].y);
    reachedVertex.push(unreachedVertex[unreachedIndex]);
    unreachedVertex.splice(unreachedIndex, 1);
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
    noStroke();
    fill(255, 0, 255);
    circle(this.x, this.y, radiusVertices * 2);
  }
}
