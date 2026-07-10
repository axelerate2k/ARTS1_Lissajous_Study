// STEP 1: A single point moving around a circle
// Goal: prove to yourself that x = cos(t) and y = sin(t) traces a circle

let t = 0;          // our "time" variable - this is the angle, starts at 0
let speed = 0.02;    // how much t increases each frame (small = slow motion)
let radius = 150;    // how big the circle is, in pixels

function setup() {
  createCanvas(600, 600);  // makes a 600x600 pixel canvas
  angleMode(RADIANS);      // tells p5 to use radians for cos/sin (not degrees) - default, but explicit here so its clear
}

function draw() {
  background(240);  // redraw a light gray background every frame (clears previous frame)

  translate(width / 2, height / 2);
  // ^ moves the (0,0) origin to the CENTER of the canvas instead of top-left
  // without this, our circle would draw from the corner, which is confusing to look at

  // THE CORE MATH - this is the whole lesson in two lines:
  let x = radius * cos(t);  // x-coordinate = radius times cosine of current angle t
  let y = radius * sin(t);  // y-coordinate = radius times sine of current angle t

  // draw a small circle (dot) at that (x, y) position
  fill(0);           // fill color = black
  noStroke();        // no outline on the dot
  circle(x, y, 12);  // draw a circle at position (x,y) with diameter 12

  // draw a faint line from center to the dot, so you can SEE the "radius arm" sweeping around
  stroke(180);           // gray line color
  line(0, 0, x, y);      // line from origin (0,0) to the dot's position

  t += speed;  // increase t a little bit every frame - this is what makes it animate
  // without this line, the dot would just sit still forever at one angle
}