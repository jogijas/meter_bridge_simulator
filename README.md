# 🔬 Meter Bridge (Slide Wire Bridge) Simulator

A modern, responsive web-based physics simulator developed using **Vite**, **vanilla** and **JavaScript modules**. This interactive application mimics a physical laboratory apparatus setup, enabling students and researchers to calculate an unknown electrical resistance value using the classical **Wheatstone Bridge Balanced Principle**.

---

## 💻 Technical Setup Guide

### 📋 Prerequisites
Make sure you have [Node.js](https://nodejs.org) installed (LTS version recommended) before compiling or launching the local workspace.

### ⚙️ Installation & Workspace Upkeep
To initialize your local workspace and set up dependencies, clone or extract your project files, enter the directory, and perform the following sequence:

1. **Navigate to the Root Workspace:**
   ```bash
   cd meter_bridge_simulator
   ```
2. **Install Local Node Package Dependencies:**
   ```bash
   npm install
   ```

### 🚀 Running the Local Development Environment
To initiate the hot-reloading development server for real-time sandbox experimentation, run:
```bash
npm run dev
```
Once compilation ends, click or copy the terminal's provided local link (typically `http://localhost:5173`) to view and interact with the application.

### 📦 Building for Web Deployment
To compile your decoupled JavaScript files (`main.js`, `simul.js`, `jas.js`, `contact.js`, `imgs.js`), style configurations (`style.css`), and asset paths into a singular optimized production directory (`/dist`), run:
```bash
npm run build
```

---

## 🔬 Experimental Laboratory Manual

### 🎯 Aim
To determine the resistance of an unknown resistor using a metre bridge.

### 🧰 Apparatus Components
* **AI Metre Bridge Simulation Assembly** (Uniform 1 meter or 100 cm constantan resistance wire AC).
* **Sturdy Wooden Board** equipped with an embedded measurement rule scale.
* **Thick L-Shaped Copper Metal Strips** providing zero-resistance structural gaps.
* **Variable Known Resistance Box (S)** connected in the right gap.
* **Unknown Resistance Coil (R)** connected in the left gap.
* **Center-Zero Galvanometer (G)** to locate balanced null electrical loops.
* **Metallic Slider Jockey (J)** for precision wire point matching.

---

### 📚 Theory and Description

A metre bridge operates fundamentally under the balanced electrical criteria governing a **Wheatstone's Bridge Network**. As configured, it models four distinct resistor pathways (P, Q, R, and S) interconnected in a closed quadrilateral mesh ABCD. 

Terminals A and C route directly to an operating battery source passing through a key K1 and current adjustment rheostat Rh. Midpoint terminals B and D join across a high-sensitivity galvanometer (G) governed by an independent contact gateway K2.

When No Deflection occurs within Galvanometer G => R / S = P / Q

This balancing law lets us solve for an unknown R parameter once P, Q, and S match criteria values. Within the physical meter wire arrangement:
* Unknown resistor R anchors across the **left operational gap**.
* Known resistance box S maps across the **right operational gap**.
* Terminal B bonds directly to the input of Galvanometer G.
* The output of Galvanometer G feeds the slider Jockey J, tracking coordinate paths directly on wire AC.

R / S = P / Q = Resistance of wire segment AD / Resistance of wire segment DC

Because the bridge wire uses a uniform material and consistent cross-sectional area, electrical resistance scales linearly alongside structural length (R ∝ l). If balance point D forms at distance l measured from A, segment DC spans exactly 100 - l. Substituting this proportional layout yields:

R = S × l / (100 - l)

---

### 📋 Step-by-Step Procedure

1. **Set Base Known Values:** Pick out a target baseline resistance value S from your variable resistance box array. Hover over any virtual plug key to review its standalone magnitude, and note the cumulative box value shown on screen.
2. **Close the Loop:** Insert circuit loop key K1 to pass DC current through the length of wire AC.
3. **Verify Connection Continuity:** Gently tap the jockey tip onto the wire near terminal A, and then shift it near terminal C. Note the indicator behavior on the Galvanometer dial face.
4. **Evaluate Direction Deflection:** Ensure the Galvanometer shows distinct, opposite deflections when touching the outer extremes. If the dial needle moves left at terminal A and right at terminal C, a valid balance null point exists safely on the wire. If it does not, adjust your known box parameters (S).
5. **Protect Laboratory Assets:** Always lift or tap the jockey rather than dragging it aggressively. Ensure touch contact happens only for fractional intervals to mitigate wire heating errors.
6. **Track the Null Position:** Carefully trace along wire AC until you identify location D, where the galvanometer pointer rests perfectly at the **center zero mark (0)**. This point represents the state of balance.
7. **Optimize Measurement Error:** If the logged balance position falls at the extreme edges, recalculate or re-select value S so the balance coordinate relocates safely to the center third of the tracking rule (typically between 30 cm and 70 cm).
8. **Log and Calculate:** Document lengths l and 100 - l, and calculate the unknown element parameter value using the provided equation.

---

### 📊 Observations Log Book

| Trial Sequence | Known Resistance S (Ω) | Null Balance Point D (cm) | Measured Length l (cm) | Inverse Length (100 - l) (cm) | Calculated Unknown Resistance R (Ω) |
| :------------: | :--------------------: | :-----------------------: | :--------------------: | :--------------------------: | :---------------------------------: |
|       1        |          10.0          |           50.0            |          50.0          |             50.0             |                10.00                |
|       2        |          20.0          |           66.0            |          37.0          |             63.0             |                11.73                |

---
