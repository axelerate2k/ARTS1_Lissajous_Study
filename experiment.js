// STEP 3: Randomness + rotation
// Goal: instead of ONE dot tracing ONE curve, draw MANY shapes,
// each one randomly rotated and randomly placed near the curve

let t = 0;           // our angle/time variable
let speed = 0.01;     // slower now, since we're drawing more per frame
let radius = 150;     // size of the curve

let a = 2;  // frequency multiplier for x
let b = 3;  // frequency multiplier for y

function setup() {
  createCanvas(600, 600);  // 600x600 canvas
  angleMode(RADIANS);      // use radians for cos/sin
}

function draw() {
  background(240, 20);
  // ^ note the second number (20) - this is a low-opacity background
  // instead of fully clearing each frame, it slightly fades the old frame
  // this creates a "trailing" ghost effect from past frames stacking up

  translate(width / 2, height / 2);
  // move origin to center of canvas

  // loop 40 times per frame - each loop draws ONE shape near the curve
  for (let i = 0; i < 40; i++) {

    // same core Lissajous math from step 2, still driving the base position
    let x = radius * cos(a * t);  // base x position from the curve
    let y = radius * sin(b * t);  // base y position from the curve

    // NEW: random jitter added to x and y
    // random(-30, 30) picks a random number between -30 and 30 each time its called
    // this scatters each shape slightly away from the exact curve point
    let jitterX = x + random(-30, 30);
    let jitterY = y + random(-30, 30);

    push();
    // ^ save the current drawing state (position, rotation) so our changes
    // below don't permanently affect anything drawn after this loop iteration

    translate(jitterX, jitterY);
    // move to this shape's specific jittered position

    // NEW: random rotation
    // random(TWO_PI) picks a random angle between 0 and 2π (a full circle)
    // rotate() spins the coordinate system by that angle before we draw
    rotate(random(TWO_PI));

    // NEW: random size and transparency for variety
    let size = random(10, 40);       // random diameter each time
    let alpha = random(50, 150);      // random transparency (0=invisible, 255=solid)

    noStroke();                       // no outline on the shape
    fill(80, 80, 200, alpha);         // blue-ish fill, with randomized transparency
    ellipse(0, 0, size, size * 0.4);
    // ^ draw an ellipse AT THE ORIGIN (0,0) - because we already translated
    // to jitterX/jitterY above, "0,0" here actually means "the jittered point"
    // size*0.4 makes it a flattened oval instead of a perfect circle, since
    // it's now rotated randomly, flattened ellipses look more dynamic than circles

    pop();
    // ^ restore the drawing state back to before this loop's translate/rotate
    // without this, rotations and translations would STACK UP across iterations
  }

  t += speed;  // advance time, so next frame's 40 shapes sit at a new curve position
}