//Copyright (c) 2025 J.S.Jasrotia. License: MIT. See LICENSE file for details.
import imgs from './imgs.js';
export function initSimulation(container) {
  const img = container.querySelector("#bgimg"); 
  
  
  const svg = container.querySelector("#svg");
  const spring = container.querySelector("#spring");
  const mass = container.querySelector("#mass");
  const needleA = container.querySelector("#needleA");
  const jkeyMove = container.querySelector("#jkeyMove");
  const jslider = container.querySelector("#jslider");
  const rbx1 = container.querySelector("#rbx1");
  const rbx2_1 = container.querySelector("#rbx2_1");
  const rbx2_2 = container.querySelector("#rbx2_2");
  const rbx5 = container.querySelector("#rbx5");
  const rbx10 = container.querySelector("#rbx10");
  const rbx20_1 = container.querySelector("#rbx20_1");
  const rbx20_2 = container.querySelector("#rbx20_2");
  const rbx50 = container.querySelector("#rbx50");
  const rbx100 = container.querySelector("#rbx100");
  const rbx200_2 = container.querySelector("#rbx200_2");
  const rbx200_1 = container.querySelector("#rbx200_1");
  const rbx500 = container.querySelector("#rbx500");
  const rbx1k = container.querySelector("#rbx1k");
  const rbx2k_2 = container.querySelector("#rbx2k_2");
  const rbx2k_1 = container.querySelector("#rbx2k_1");
  const Sval = container.querySelector("#Sval");
  const pqText = container.querySelector("#pqText");
  const colband = container.querySelector("#colband");
  if (!svg || !spring || !mass || !needleA || !jslider) {
    console.error("Simulation elements not found");
    return;
  }

  /* ================= CONSTANTS ================= */

  const anchor = { x: 1100, y: 305 };

  //const MASS_WIDTH = 6;
  //const MASS_HEIGHT = 2;
  
  const maxX = 650;
  const minX = -890;
  
  const maxdY = 325;
  const mindY = 290;
  //const wireLength = maxX - minX; 
  // SLIDER limits (independent)
  const sliderMinX = 28;
  const sliderMaxX = 405;
  const sliderY = 238;
  const coils = 12;
  const radius = 16;
  const maxAngle = 48;
  // Spring physics
  const k = 0.08;        // stiffness
  const damping = 0.88;  // energy loss

  // Rest (snap-back) position
  //const restPos = { x: 938, y: 565 };
  const restPos = { x: 1105, y: 480 };
  const sldrestPos = { x: sliderMaxX, y: sliderY };
  /* ================= STATE ================= */

  let massPos = { ...restPos };
  let jsliderPos = { ...sldrestPos };
  let velocity = { x: 0, y: 0 };

  let dragging = false;
  let dragOffset = { x: 0, y: 0 };
  
  let sliderDragging = false;
  let sliderdragOffset = { x: 0, y: 0 };

  let animating = false;
  let jmouseSldrX=0;
  let jmouseX = 0;
  let jmouseY = 0;
  let AngleV  =0;
  let isUp = true;
  let isDn = true;
  let S = 0;
  const Resistor_R = new Array(10, 22, 33, 47, 68, 100, 220, 330, 470, 680, 1000, 1200, 1800, 2200, 3300,4700);
  let R = 10;
  //const R = Resistor_R[Math.floor(Math.random() * Resistor_R.length)];
  ///console.log(R);
  /* ================= HELPERS ================= */
  
  //window.addEventListener("DOMContentLoaded", () => {
  //const img = container.querySelector("#bgimg");
  
    //const img = document.getElementById('bgimg');
    if (img) {
        img.setAttribute('href', imgs['img']); // modern browsers
        document.querySelector("#loader")?.remove();
        //console.log('img loaded');
    }
    
  const svgWrapper = container.querySelector("#svg-wrapper");
  document.addEventListener("contextmenu", e => e.preventDefault());
  document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['s', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
  }
});
  if (img.complete) {
    // image is already loaded from cache
    document.querySelector("#loader")?.remove();
    svgWrapper.style.visibility = "visible";
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && ['s', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
  }
});
    initJas();
  } else {
    img.addEventListener("load", () => {
      svgWrapper.style.visibility = "visible";
      document.querySelector("#loader")?.remove();
      initJas();
    });
  }
 //});
   function getSVGPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function buildSpringPath(x2, y2) {
    const dx = x2 - anchor.x;
    const dy = y2 - anchor.y;
    const length = Math.hypot(dx, dy);
    if (length < 10) return "";
    jmouseX = dx;
    jmouseY = dy;
    const ux = dx / length;
    const uy = dy / length;
    const px = -uy;
    const py = ux;

    const points = coils * 20;
    let d = `M ${anchor.x} ${anchor.y}`;

    for (let i = 1; i <= points; i++) {
      const p = i / points;
      const angle = p * Math.PI * 2 * coils;
      const offset = Math.sin(angle) * radius;

      const x = anchor.x + ux * (p * length) + px * offset;
      const y = anchor.y + uy * (p * length) + py * offset;

      d += ` L ${x} ${y}`;
    }
    return d;
  }

  function update() {
  spring.setAttribute("d", buildSpringPath(massPos.x, massPos.y));
  colband.setAttribute(
    "transform",
    `translate(-160,19) scale(1)`
  );
   
   colband.addEventListener("click", () => {
  R = Resistor_R[Math.floor(Math.random() * Resistor_R.length)];
  console.log(R);
});

  // Move path using transform
    mass.setAttribute(
    "transform",
    `translate(${massPos.x + 15}, ${massPos.y + 96 })`
  );
  
  jslider.setAttribute(
  "transform",
  `translate(${jsliderPos.x}, ${jsliderPos.y}) scale(3)`
);
   //console.log(sliderTosensitivity(jsliderPos.x));
   const sensitivity = sliderTosensitivity(jsliderPos.x);
  if(jmouseY >= mindY && jmouseY <= maxdY && jmouseX >=minX && jmouseX <= maxX && !isUp)
        {
    //const P = jmouseX  - minX;
        
    //const Q = maxX - jmouseX ;
    const wireLength = maxX - minX;       
    //const sensitivity = 2;
    const P = ((jmouseX - minX) / wireLength) * 100;
    const Q = 100 - P;  
    //console.log(P.toFixed(2)+" "+Q.toFixed(2));
    //pqText.textContent = "P = "+P.toFixed(2)+"  "+"Q = "+Q.toFixed(2);
    if (Q <= 0 || S <= 0){pqText.textContent = "Resistance Box value is zero !";return;}
    const balanceP = (R / (R + S)) * 100;
    //const error = (P / Q) - (R / S);
    const error = P - balanceP;
    //console.log(error.toFixed(2));
    const maxError = 100; // cm
    const normalizedError = error / maxError;
    //pqText.textContent = "P = "+P.toFixed(2)+" Error = " + error.toFixed(2)+" Q = "+Q.toFixed(2);
    //const angle = clamp(error * sensitivity, -maxAngle, maxAngle);
    /*
    const angle = clamp(
      Math.tanh(error * sensitivity) * maxAngle,
      -maxAngle,
      maxAngle
    );*/
    
    const angle = clamp(
     normalizedError * maxAngle * sensitivity,
     -maxAngle,
     maxAngle
);
    
    needleA.style.transform = `rotate(${angle}deg)`;
    //pqText.textContent = "angle = "+ angle.toFixed(2);
    //pqText.textContent = "P = "+P.toFixed(2)+" Angle = " + angle.toFixed(2)+" Q = "+Q.toFixed(2);
    
    //console.log(Math.abs(error));
    if (Math.abs(error) < 0.1) {
      needleA.setAttribute("transform", "rotate(0)");
      pqText.textContent = "P = "+P.toFixed(2)+" Balanced"+" Q = "+Q.toFixed(2);
      //balanceText.style.color = "green";
    } else {
      pqText.textContent = "P = "+P.toFixed(2)+" Not Balanced"+" Q = "+Q.toFixed(2);
      //balanceText.style.color = "red";
    }
    
    
    }
  else{
       pqText.textContent = "thinknucleus.com"
       needleA.style.transform = `rotate(0deg)`;
     }
          

}

  
  /* ================= POINTER EVENTS ================= */
function initJas() {
  mass.addEventListener("pointerdown", (e) => {
    dragging = true;
    animating = false;

    const p = getSVGPoint(e);
    dragOffset.x = p.x - massPos.x;
    dragOffset.y = p.y - massPos.y;

    velocity.x = 0;
    velocity.y = 0;
    mass.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  mass.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const p = getSVGPoint(e);
    massPos.x = p.x - dragOffset.x;
    massPos.y = p.y - dragOffset.y;
    //if(jmouseY >= mindY && jmouseY <= maxdY && jmouseX >=minX && jmouseX <= maxX && !isUp)
    //    {
  /*  const P = ((jmouseX - minX) / wireLength) * 100;
    const Q = 100 - P;  
    pqText.textContent = "P = "+P.toFixed(2)+"  "+"Q = "+Q.toFixed(2);
    
    if (Q <= 0 || S <= 0) return;
    const balanceP = (R / (R + S)) * 100;
    const error = (P / Q) - (R / S);
   / 
    
    AngleV = sliderToAngle(jmouseX).toFixed(1);
    needleA.style.transform = `rotate(${AngleV}deg)`;
        }else
        {
            needleA.style.transform = `rotate(0deg)`;
            pqText.textContent = "thinknucleus.com"
            } */
    update();
    
  });

  mass.addEventListener("pointerup", release);
  mass.addEventListener("pointercancel", release);
  jkeyMove.addEventListener("pointerdown", () => {
  isUp = !isUp;
  moveKey(jkeyMove,46.5, 5, 46.5, 25);
 });
   
  jslider.addEventListener("pointerdown", (e) => {
      sliderDragging = true;
      const p = getSVGPoint(e);
      sliderdragOffset = p.x -jsliderPos.x;
     
      jslider.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
  
  jslider.addEventListener("pointermove", (e) => {
      if (!sliderDragging) return;
       const p = getSVGPoint(e);
       let x = p.x - sliderdragOffset;
       x = Math.max(sliderMinX, Math.min(sliderMaxX, x));
       jsliderPos.x = x;
       update();    
    });                       
  
    jslider.addEventListener("pointerup", () => sliderDragging = false);
    jslider.addEventListener("pointercancel", () => sliderDragging = false);

    resistorKeys.forEach(r => {
    r.isDown = true;          // electrical DOWN
    r.activeResistance = 0;  // no resistance
  });
    Sval.textContent = 0+" Ω";
}

  function release() {
    dragging = false;
    if (!animating) {
      animating = true;
      requestAnimationFrame(animate);
      needleA.style.transform = `rotate(0deg)`;
    }
  }

  /* ================= PHYSICS ================= */

  function animate() {
    if (dragging) return;

    // Hooke's law toward rest position
    const dx = massPos.x - restPos.x;
    const dy = massPos.y - restPos.y;

    const fx = -k * dx;
    const fy = -k * dy;

    velocity.x += fx;
    velocity.y += fy;

    velocity.x *= damping;
    velocity.y *= damping;

    massPos.x += velocity.x;
    massPos.y += velocity.y;
    
    update();

    // settle threshold
    if (Math.abs(dx) + Math.abs(dy) > 0.1 ||
        Math.abs(velocity.x) + Math.abs(velocity.y) > 0.1) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
      massPos = { ...restPos };
      update();
    }
  }
 /* 
  function sliderToAngle(value) {
    const inMin = minX;
    const inMax = maxX;
    const outMin = maxAngle;   // notice flip
    const outMax = -maxAngle;

    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}

function sliderTosensitivity(value){
    const inMin = sliderMinX;
    const inMax = sliderMaxX;
    const outMin = 1;   // notice flip
    const outMax = 5;

    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}
*/
function sliderTosensitivity(value){
    const inMin = sliderMinX;
    const inMax = sliderMaxX;
    const outMin = 5;   // flipped
    const outMax = 1;

    return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
}


function moveKey(key, x1, y1, x2, y2) {
  key.style.transition = "transform 120ms ease-out";
  key.style.transform = isUp
    ? `translate(${x1}px, ${y1}px) scale(0.7)`
    : `translate(${x2}px, ${y2}px) scale(0.7)`;
}

function moveKeyR(key, x, y) {
  key.style.transition = "transform 120ms ease-out";
  key.setAttribute(
    "transform",
    `translate(${x}, ${y}) scale(0.6)`
  );
  calculateTotalResistance();
}

function calculateTotalResistance() {
     const total = resistorKeys.reduce(
    (sum, r) => sum + r.activeResistance,
    0
  );
     S = total;
  //console.log(S);
  Sval.textContent = S+" Ω";
}
const resistorKeys = [
    new ResistorKey({
      el: rbx1,
      resistance: 1,
      up:   { x: 1217, y: 195 },
      down: { x: 1217, y: 205 },
      moveKeyR
    }),
  new ResistorKey({
    el: rbx2_1,
    resistance: 2,
    up:   { x: 1260, y: 195 },
    down: { x: 1260, y: 205 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx2_2,
    resistance: 2,
    up:   { x: 1305, y: 195 },
    down: { x: 1305, y: 205 },
    moveKeyR
    
  }),
  new ResistorKey({
    el: rbx5,
    resistance: 5,
    up:   { x: 1345, y: 195 },
    down: { x: 1345, y: 205 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx10,
    resistance: 10,
    up:   { x: 1391, y: 195 },
    down: { x: 1391, y: 205 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx20_1,
    resistance: 20,
    up:   { x: 1438, y: 195 },
    down: { x: 1438, y: 205 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx20_2,
    resistance: 20,
    up:   { x: 1483, y: 195 },
    down: { x: 1483, y: 205 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx50,
    resistance: 50,
    up:   { x: 1532, y: 205 },
    down: { x: 1532, y: 215 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx100,
    resistance: 100,
    up:   { x: 1475, y: 194 },
    down: { x: 1475, y: 204 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx200_2,
    resistance: 200,
    up:   { x: 1432, y: 194 },
    down: { x: 1432, y: 204 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx200_1,
    resistance: 200,
    up:   { x: 1386, y: 194 },
    down: { x: 1386, y: 204 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx500,
    resistance: 500,
    up:   { x: 1340, y: 194 },
    down: { x: 1340, y: 204 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx1k,
    resistance: 1000,
    up:   { x: 1300, y: 194 },
    down: { x: 1300, y: 204 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx2k_2,
    resistance: 2000,
    up:   { x: 1257, y: 194 },
    down: { x: 1257, y: 204 },
    moveKeyR
  }),
  new ResistorKey({
    el: rbx2k_1,
    resistance: 2000,
    up:   { x: 1214, y: 194 },
    down: { x: 1214, y: 204 },
    moveKeyR
  })
];
  update();
}
class ResistorKey {
  constructor({ el, resistance, up, down, moveKeyR }) {
    this.el = el;
    this.baseResistance = Number(resistance);
    this.activeResistance = this.baseResistance;
    this.up = up;
    this.down = down;
    this.moveKeyR = moveKeyR;
    this.isDown = false;
    this.el.addEventListener("pointerdown", this.toggle.bind(this));
  }
  toggle() {
    this.isDown = !this.isDown;
    this.activeResistance = this.isDown ? 0 : this.baseResistance;
    this.moveKeyR(
      this.el,
      this.isDown ? this.down.x : this.up.x,
      this.isDown ? this.down.y : this.up.y
    );
  }
}

function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }
