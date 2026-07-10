let seed;              // random seed, fixed per-session so noise/randomness is reproducible each frame
let freqA = 2;          // frequency ratio for the x-axis oscillation
let freqB = 3;          // frequency ratio for the y-axis oscillation
let theta = 0;           // "time" variable (t) that drives the curve forward each frame
let thetaStep = 0.01;    // how much theta advances per frame (speed of the animation)
let radius;             // amplitude of the curve == half the canvas size


let canvasSize;
let overAllTexture;      // a pre-rendered noise layer, drawn on top each frame for a grainy, analog look

let solidPurples = [
  "#9b5de5", // bright violet
  "#c77dff", // light purple
  "#e0aaff", // pale lavender
  "#7209b7", // saturated purple (deepest one, used sparingly)
  "#f2c6ff", // near-white pink-lavender, for high-contrast accents
];


let fadedPurples = solidPurples.map((hex) => hex + "00");

let backgroundColor = "#2d1b4e"; // muted mid-tone purple, light enough for shapes to pop against


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
  // Re-seeding every frame with the same value keeps the "random"
  // choices (which shape, which color, etc.) visually consistent
  // in style from frame to frame, even though theta keeps moving.
  randomSeed(seed);

  noFill();
  strokeCap(SQUARE);

  push();
  translate(width / 2, height / 2);

  // Draw a batch of shapes for this frame. The loop increment is
  // randomized (random(1) is between 0 and 1) so the number of
  // shapes drawn per frame varies slightly, adding organic variety.
  for (let i = 0; i < shapesPerFrame; i += random(1)) {

    // Randomize the frequency ratios slightly each iteration.
    // This is what breaks a single clean Lissajous curve into a
    // whole *field* of overlapping, related curves.
    freqA = random(1);
    freqB = random(1);

    strokeWeight(random(50));
    rotate(random(TAU));               // TAU = 2*PI, a full turn in radians
    stroke(random(solidPurples));

    // Core Lissajous position, with extra random jitter (spread
    // further out as "i" grows, so later shapes scatter wider).
    let x = random(-i * 50, i * 50) + radius * cos(freqA * theta);
    let y = random(-i * 50, i * 50) + radius * sin(freqB * theta);

    // Size the shape using the curve's *velocity* components
    // (cos/sin of theta+step) rather than raw position -- this
    // makes shape size pulse as the curve speeds up/slows down.
    let w = radius * cos(freqA * (theta + thetaStep));
    let h = radius * sin(freqB * (theta + thetaStep));

    drawRandomShape(x, y, w, h);
  }

  pop();

  theta += thetaStep;

  // Overlay the grainy noise texture on top for a textured, analog feel.
  image(overAllTexture, 0, 0);
}

// Picks one shape at random -- but only from the "activeShapes" list
// defined above -- and draws it at (x, y) with dimensions derived
// from (w, h). This keeps shape selection data-driven: to add/remove
// a shape from the mix, just edit the activeShapes array, no need to
// touch this function.
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

// Builds a simple triangle centered roughly on (x, y), sized by (w, h).
// The three points are offset from center so the triangle's overall
// footprint matches the width/height passed in, keeping it visually
// consistent with the ellipse/rect shapes it's mixed with.
function drawTriangle(x, y, w, h) {
  let halfW = w / 2;
  let halfH = h / 2;
  triangle(
    x, y - halfH,          // top point
    x - halfW, y + halfH,  // bottom-left point
    x + halfW, y + halfH   // bottom-right point
  );
}

// Builds a full-window graphics layer of Perlin noise, tinted purple,
// used as a subtle grain/texture overlay on top of the shape field.
// noise(x, y, z) returns smooth pseudo-random values between 0 and 1;
// we scale the inputs down (i/3, j/3) so the noise pattern is soft
// and cloud-like rather than pixel-sharp static.
function buildNoiseTexture() {
  randomSeed(seed);
  colorMode(HSB, 360, 100, 100, 100);

  overAllTexture = createGraphics(windowWidth, windowHeight);
  overAllTexture.loadPixels();

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      // Hue 270 = purple in HSB. Brightness is raised (was 40) so the
      // grain adds texture without darkening/muddying the shapes and
      // background underneath. Alpha still varies with noise so the
      // grain feels organic rather than uniform.
      let n = noise(i / 3, j / 3, (i * j) / 50);
      overAllTexture.set(i, j, color(270, 40, 75, n * random(1, 15)));
    }
  }

  overAllTexture.updatePixels();
}

