// STEP 2: Different frequencies for x and y = Lissajous curve
// Goal: see how x and y "racing" at different speeds creates loops instead of a circle

let t = 0;          // our angle/time variable, starts at 0
let speed = 0.02;    // how much t increases each frame
let radius = 150;    // size of the curve

let a = 5;  // frequency multiplier for x - try changing this number later
let b = 7;  // frequency multiplier for y - try changing this number later

let trail = [];        // an empty array to store every point the dot has visited
let maxTrailLength = 500; // how many past points we keep before erasing old ones

function setup() {
  createCanvas(600, 600);  // makes a 600x600 pixel canvas
  angleMode(RADIANS);      // use radians (not degrees) for cos/sin
}

function draw() {
  background(240);  // clear the frame each time (light gray)

  translate(width / 2, height / 2);
  // ^ move origin to center of canvas so the curve draws around the middle

  // THE CORE CHANGE FROM STEP 1:
  // in step 1, both x and y used the SAME t (so it was a=1, b=1, a perfect circle)
  // now x uses "a * t" and y uses "b * t" - two DIFFERENT speeds
  let x = radius * cos(a * t);  // x oscillates at rate "a"
  let y = radius * sin(b * t);  // y oscillates at rate "b" (different from a!)

  trail.push({ x: x, y: y });
  // ^ save this frame's point into our trail array, so we can draw the path so far

  if (trail.length > maxTrailLength) {
    trail.shift();  // remove the oldest point once we have too many (keeps memory in check)
  }

  // draw the trail as connected line segments
  noFill();               // don't fill the shape, just draw the outline path
  stroke(80, 80, 200);    // a blue-ish line color
  strokeWeight(2);        // line thickness
  beginShape();           // start defining a custom multi-point shape
  for (let i = 0; i < trail.length; i++) {
    vertex(trail[i].x, trail[i].y);  // add each stored point as a vertex in the shape
  }
  endShape();  // finish drawing the connected path

  // draw the current dot on top, so you can see WHERE on the curve we are right now
  fill(0);            // black fill
  noStroke();          // no outline
  circle(x, y, 10);    // small circle at current (x,y) position

  t += speed;  // advance time so next frame draws a new point further along the curve
}