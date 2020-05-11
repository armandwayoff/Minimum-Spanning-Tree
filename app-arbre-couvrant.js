// Code original par Daniel Shiffman puis modifié par Armand Wayoff

const largeurCanvas = 450;
const bord = 10;
const nbrMaxSommets = document.getElementById("nbrSommets").max;

let txtNbrMaxSommets = document.getElementsByClassName("nbrMaxSommets");
let nbrSommets = document.getElementById("nbrSommets").value;
let rayonSommets = Number(document.getElementById("rayonSommets").value);
let epaisseurAretes = rayonSommets / 2;
let distMinimaleEntreSommets = rayonSommets * 3;
let sommets = [];

function setup() {
  let canvas = createCanvas(largeurCanvas, largeurCanvas);
  canvas.parent("app");
  regenerer();
}

function regenerer() {
  nbrSommets = document.getElementById("nbrSommets").value;
  rayonSommets = Number(document.getElementById("rayonSommets").value);
  epaisseurAretes = rayonSommets / 2;
  sommets = [];
  if (nbrSommets > 0) {
    sommets.push(new Sommet(random(bord + rayonSommets, width - rayonSommets - bord), random(bord + rayonSommets, height - rayonSommets - bord)));
    let iter = 1;
    while (iter < nbrSommets) {
      let som = new Sommet(random(bord + rayonSommets, width - rayonSommets - bord), random(bord + rayonSommets, height - rayonSommets - bord));
      if (!superposition(som, sommets)) {
        sommets.push(som);
        iter++;
      }
    }
  }
}

function superposition(obj, list) {
  for (let i = 0; i < list.length; i++) {
    if (dist(obj.x, obj.y, list[i].x, list[i].y) <= distMinimaleEntreSommets) {
      return true;
    }
  }
  return false;
}

function cliqueSurCavas() {
  return (mouseIsPressed && mouseButton === LEFT) && (mouseX >= bord + rayonSommets && mouseX <= width - rayonSommets - bord) && (mouseY >= bord + rayonSommets && mouseY <= height - rayonSommets - bord);
}

function ajouterSommet(x, y) {
  if (cliqueSurCavas() && sommets.length < nbrMaxSommets) {
    let som = new Sommet(x, y);
    if (!superposition(som, sommets)) {
      sommets.push(som);
    }
  }
}

function supprimerSommet() {
  for (let i = 0; i < sommets.length; i++) {
    if (keyIsPressed === true && (keyCode === 17 || keyCode === 91) && sommetSelectionne(i) && cliqueSurCavas()) {
      sommets.splice(i, 1);
    }
  }
}

function sommetSelectionne(i) {
  return abs(mouseX - sommets[i].x) < rayonSommets && abs(mouseY - sommets[i].y) < rayonSommets;
}

function draw() {
  background(255);

  ajouterSommet(mouseX, mouseY);
  supprimerSommet();

  nbrSommetsEnCours.innerHTML = sommets.length;
  for (let i = 0; i < txtNbrMaxSommets.length; i++) {
    txtNbrMaxSommets[i].innerHTML = nbrMaxSommets;
  }

  let ptnAtteints = [];
  let ptnNonAtteints = [];

  for (let i = 1; i < sommets.length; i++) {
    ptnNonAtteints.push(sommets[i]);
  }

  ptnAtteints.push(sommets[0]);


  while (ptnNonAtteints.length > 0) {
    let distRecord = Infinity;
    let indicePtnAtteint;
    let indicePtnNonAtteint;

    for (let i = 0; i < ptnAtteints.length; i++) {
      for (let j = 0; j < ptnNonAtteints.length; j++) {
        let ptnAtt = ptnAtteints[i];
        let ptnNonAtt = ptnNonAtteints[j];
        let d = dist(ptnAtt.x, ptnAtt.y, ptnNonAtt.x, ptnNonAtt.y);

        if (d < distRecord) {
          distRecord = d;
          indicePtnAtteint = i;
          indicePtnNonAtteint = j;
        }
      }
    }
    stroke(0);
    strokeWeight(epaisseurAretes);
    line(ptnAtteints[indicePtnAtteint].x, ptnAtteints[indicePtnAtteint].y, ptnNonAtteints[indicePtnNonAtteint].x, ptnNonAtteints[indicePtnNonAtteint].y);
    ptnAtteints.push(ptnNonAtteints[indicePtnNonAtteint]);
    ptnNonAtteints.splice(indicePtnNonAtteint, 1);
  }

  for (let i = 0; i < sommets.length; i++) {
    sommets[i].affichage();
  }
}

class Sommet {
  constructor(x_, y_) {
    this.x = x_;
    this.y = y_;
  }

  affichage() {
    noStroke();
    fill(255, 0, 255);
    circle(this.x, this.y, rayonSommets * 2);
  }
}
