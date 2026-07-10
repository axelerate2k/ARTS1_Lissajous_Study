let seed;              // random seed, fixed per-session so noise/randomness is reproducible each frame
let freqA = 2;          // frequency ratio for the x-axis oscillation
let freqB = 3;          // frequency ratio for the y-axis oscillation
let theta = 0;           // "time" variable (t) that drives the curve forward each frame
let thetaStep = 0.01;    // how much theta advances per frame (speed of the animation)
let radius;             // amplitude of the curve == half the canvas size


let canvasSize;
let overAllTexture;      

let solidPurples = [
  "#9b5de5", // bright violet
  "#c77dff", // light purple
  "#e0aaff", // pale lavender
  "#7209b7", // saturated purple (deepest one, used sparingly)
  "#f2c6ff", // near-white pink-lavender, for high-contrast accents
];


let fadedPurples = solidPurples.map((hex) => hex + "00");

let backgroundColor = "#2d1b4e"; 


let activeShapes = [ "rect"];

let shapesPerFrame = 20;

function setup() {
  seed = Math.random() * 1000;

  canvasSize = min(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);

  radius = canvasSize / 2;

  background(backgroundColor);

  buildNoiseTexture();
}

function draw() {
  randomSeed(seed);

  noFill();
  strokeCap(SQUARE);

  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < shapesPerFrame; i += random(1)) {

    freqA = random(1);
    freqB = random(1);

    strokeWeight(random(50));
    rotate(random(TAU));               // TAU = 2*PI, a full turn in radians
    stroke(random(solidPurples));


    let x = random(-i * 50, i * 50) + radius * cos(freqA * theta);
    let y = random(-i * 50, i * 50) + radius * sin(freqB * theta);

    let w = radius * cos(freqA * (theta + thetaStep));
    let h = radius * sin(freqB * (theta + thetaStep));

    drawRandomShape(x, y, w, h);
  }

  pop();

  theta += thetaStep;
  image(overAllTexture, 0, 0);
}

function drawRandomShape(x, y, w, h) {
  let shapeChoice = random(activeShapes);

  if (shapeChoice === "ellipse") {
    ellipse(x, y, w, h);
  } else if (shapeChoice === "triangle") {
    drawTriangle(x, y, w, h);
  } else if (shapeChoice === "rect") {
    rect(x, y, w, h);
  }
}

function drawTriangle(x, y, w, h) {
  let halfW = w / 2;
  let halfH = h / 2;
  triangle(
    x, y - halfH,          // top point
    x - halfW, y + halfH,  // bottom-left point
    x + halfW, y + halfH   // bottom-right point
  );
}
function buildNoiseTexture() {
  randomSeed(seed);
  colorMode(HSB, 360, 100, 100, 100);

  overAllTexture = createGraphics(windowWidth, windowHeight);
  overAllTexture.loadPixels();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let n = noise(i / 3, j / 3, (i * j) / 50);
      overAllTexture.set(i, j, color(270, 40, 75, n * random(1, 15)));
    }
  }

  overAllTexture.updatePixels();
}

