// STEP 5 (full window version)
// Same as before, but canvas and noise texture now match the actual browser window

let t = 0;
let speed = 0.01;
let radius;  // no longer a fixed number - we'll calculate this based on window size

let a = 2;
let b = 3;

let seed = 42;
let noiseTexture;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // ^ windowWidth/windowHeight are built-in p5 variables that hold the ACTUAL
  // browser window's pixel size - so the canvas always fills the screen exactly

  colorMode(HSB, 360, 100, 100, 100);

  radius = min(windowWidth, windowHeight) * 0.3;
  // ^ base the curve's size on whichever dimension is smaller (width or height)
  // this keeps the curve proportional and fully visible on any screen shape

  background(270, 15, 98);

  noiseTexture = createGraphics(windowWidth, windowHeight);
  // ^ texture layer now matches the canvas size exactly - this is the actual fix
  // before, it was hardcoded to 600x600 while the canvas was some other size

  noiseTexture.colorMode(HSB, 360, 100, 100, 100);

  randomSeed(seed);
  noiseSeed(seed);

  noiseTexture.loadPixels();
  for (let i = 0; i < windowWidth; i++) {       // loop across the REAL window width
    for (let j = 0; j < windowHeight; j++) {    // loop across the REAL window height
      let n = noise(i / 8, j / 8);
      let grainAlpha = map(n, 0, 1, 0, 12);
      noiseTexture.set(i, j, color(20, 10, 10, grainAlpha));
    }
  }
  noiseTexture.updatePixels();
}
function draw() {
  fill(270, 15, 98, 8);
  noStroke();
  rect(0, 0, width, height);

  push();  // NEW: save the untransformed state before we shift the origin
  translate(width / 2, height / 2);  // move origin to center - ONLY for the shapes below

  for (let i = 0; i < 25; i++) {
    let x = radius * cos(a * t);
    let y = radius * sin(b * t);

    let jitterX = x + random(-40, 40);
    let jitterY = y + random(-40, 40);

    push();
    translate(jitterX, jitterY);
    rotate(random(TWO_PI));

    let hue = random(260, 300);
    let sat = random(40, 80);
    let bright = random(60, 95);
    let alpha = random(30, 70);

    noStroke();
    fill(hue, sat, bright, alpha);

    let size = random(15, 50);
    ellipse(0, 0, size, size * random(0.3, 0.6));

    pop();
  }
  pop();  // NEW: undo the width/2, height/2 shift - back to true (0,0) top-left

  t += speed;

  image(noiseTexture, 0, 0);
  // ^ now this runs in the TRUE coordinate space, so it correctly covers the whole canvas
}

function windowResized() {
  // ^ p5 calls this automatically whenever the browser window changes size
  resizeCanvas(windowWidth, windowHeight);
  // ^ resize the actual canvas to match the new window size

  radius = min(windowWidth, windowHeight) * 0.3;
  // ^ recalculate radius so the curve still looks proportional after resizing

  // NOTE: we do NOT rebuild noiseTexture here on every resize, since looping over
  // every pixel is slow - for now it'll just stretch/mismatch slightly on resize.
  // We can fix that properly later if you end up resizing often during testing.
}