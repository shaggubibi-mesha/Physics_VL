
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const slider = document.getElementById("slider");

let mode = "pendulum", running = true, time = 0;
let last = 0;

const data = {
  pendulum: ["Simple Pendulum","Pendulum Length","T = 2π√(L/g)"],
  projectile: ["Projectile Motion","Launch Speed","R = v²sin(2θ)/g"],
  freefall: ["Free Fall","Drop Height","s = ½gt²"],
  spring: ["Spring Oscillation","Spring Stiffness","T = 2π√(m/k)"]
};

function choose(name) {
  mode = name;
  time = 0;
  running = true;
  document.getElementById("title").textContent = data[name][0];
  document.getElementById("sliderLabel").textContent = data[name][1];
  document.getElementById("formula").textContent = "Formula: " + data[name][2];
  slider.min = name === "pendulum" ? 30 : 20;
  slider.max = name === "pendulum" ? 150 : 150;
  slider.value = name === "pendulum" ? 100 : 80;
update();
draw();
}  
function update() {
  let v = Number(slider.value);
  document.getElementById("value").textContent = v;

  let result, unit, frequency = 0;
  if (mode === "pendulum") {
    result = 2 * Math.PI * Math.sqrt((v / 100) / 9.81);
    unit = "s";
    frequency = 1 / result;
  } else if (mode === "projectile") {
    result = v * v / 9.81;
    unit = "m";
  } else if (mode === "freefall") {
    result = Math.sqrt(2 * v / 9.81);
    unit = "s";
  } else {
    result = 2 * Math.PI * Math.sqrt(5 / v);
    unit = "s";
  }

  document.getElementById("result").textContent =
    (mode === "pendulum" ? "Time period: " :
     mode === "projectile" ? "Horizontal range (45°): " :
     mode === "freefall" ? "Fall time: " :
     "Time period: ") + result.toFixed(2) + " " + unit;

  document.getElementById("frequency").textContent =
    "Frequency: " + (mode === "pendulum"
      ? frequency.toFixed(3) + " Hz"
      : "Not calculated for this experiment");

  document.getElementById("cycles").textContent =
    "Complete oscillations: " +
    (mode === "pendulum"
      ? Math.floor(time / result)
      : "--");

  document.getElementById("measured").textContent =
    "Measured time period: " +
    (mode === "pendulum" && time >= result
      ? (time / Math.floor(time / result)).toFixed(2) + " s"
      : "Waiting for a complete oscillation");
}

slider.addEventListener("input", () => { update(); draw(); });

function start() { running = true; }
function pause() { running = false; }
function reset() { time = 0; running = false; draw(); }

function draw() {
  let w = canvas.width, h = canvas.height;
  ctx.clearRect(0,0,w,h);
  ctx.strokeStyle = "#1d304a";
  for (let x=0; x<w; x+=30) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke();
  }
  for (let y=0; y<h; y+=30) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
  }

  let v = Number(slider.value), x = w/2, y = 70;
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#53e8f5";
  ctx.fillStyle = "#a48aff";

  if (mode === "pendulum") {
    let len = v;
    let length = v / 100;
let omega = Math.sqrt(9.81 / length);
let angle = 0.65 * Math.sin(time * omega);
    let bx = x + len*Math.sin(angle);
    let by = y + len*Math.cos(angle);
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(bx,by); ctx.stroke();
    ctx.beginPath(); ctx.arc(x,y,5,0,7); ctx.fill();
    ctx.beginPath(); ctx.arc(bx,by,15,0,7); ctx.fill();
  }

  if (mode === "projectile") {
    let speed = v/3, angle = Math.PI/4;
    ctx.beginPath();
    for(let i=0;i<=80;i++){
      let t=i/80*2.5;
      let px=35+speed*Math.cos(angle)*t*35;
      let py=h-30-(speed*Math.sin(angle)*t-4.905*t*t)*18;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.stroke();
    let t=(time%2.5);
    let px=35+speed*Math.cos(angle)*t*35;
    let py=h-30-(speed*Math.sin(angle)*t-4.905*t*t)*18;
    py=Math.min(h-30,Math.max(15,py));
    ctx.beginPath(); ctx.arc(px,py,10,0,7); ctx.fill();
  }

  if (mode === "freefall") {
    let fy=80+(time%2)*70*v/50;
    fy=Math.min(h-35,fy);
    ctx.beginPath(); ctx.arc(x,fy,13,0,7); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x,80); ctx.lineTo(x,h-25); ctx.stroke();
  }

  if (mode === "spring") {
    let displacement=35*Math.cos(time*3);
    ctx.beginPath(); ctx.moveTo(x,35);
    for(let i=1;i<=15;i++){
      ctx.lineTo(x+(i%2? -12:12),35+i*(100+displacement)/15);
    }
    ctx.lineTo(x,135+displacement); ctx.stroke();
    ctx.fillRect(x-23,135+displacement,46,35);
  }
}
function animate(now) {
if(running) {
  if(last) time += Math.min((now-last)/1000,0.05);
  draw();
  update();
}
  }
  last = now;
  requestAnimationFrame(animate);


choose("pendulum");
requestAnimationFrame(animate);
