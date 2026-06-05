# 🧠 EMOTION MIRROR
### *AI-Powered Real-Time Biometric Emotion Intelligence Dashboard*

```text
===========================================================================
  ███████╗███╗   ███╗ ██████╗ ████████╗██╗ ██████╗ ███╗   ██╗    ██╗  ██╗██╗   ██╗██████╗ 
  ██╔════╝████╗ ████║██╔═══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║    ██║  ██║██║   ██║██╔══██╗
  █████╗  ██╔████╔██║██║   ██║   ██║   ██║██║   ██║██╔██╗ ██║    ███████║██║   ██║██║  ██║
  ██╔══╝  ██║╚██╔╝██║██║   ██║   ██║   ██║██║   ██║██║╚██╗██║    ██╔══██║██║   ██║██║  ██║
  ███████╗██║ ╚═╝ ██║╚██████╔╝   ██║   ██║╚██████╔╝██║ ╚████║    ██║  ██║╚██████╔╝██████╔╝
  ╚══════╝╚═╝     ╚═╝ ╚═════╝    ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝    ╚═╝  ╚═╝ ╚══════╝╚══════╝ 
===========================================================================
                      BIOMETRIC SCANNING SYSTEM - V1.0.0
```

[![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![face--api.js](https://img.shields.io/badge/face--api.js-0.22.2-FF6F00?style=flat-square)](https://github.com/justadudewhohacks/face-api.js)
[![FramerMotion](https://img.shields.io/badge/Framer_Motion-11.0.0-F107A3?style=flat-square)](https://www.framer.com/motion/)

Emotion Mirror is a sophisticated browser-based real-time biometric analysis platform. Using the client device's webcam feed, it executes multiple deep learning networks simultaneously entirely inside the browser. It maps facial boundaries, tracks 68 coordinates of facial mesh landmarks, identifies gender/age characteristics, and calculates expression probabilities to display a premium, data-dense sci-fi HUD.

![Demo](./demo.gif)

---

## ⚡ Key Features

- 💻 **Neural Simulator (Demo Mode)**: A high-tech digital twin wireframe head renders directly on the feed canvas. Rotates (yaw/pitch coordinates), blinks, cycles expressions, and inputs telemetry data in real time. Perfect for testing and screen-recording when a physical webcam is unavailable!
- 🎥 **Zero-Lag Biometric Tracking**: 30 FPS webcam tracking utilizing HTML5 Canvas synchronization overlays with face-api.js.
- 🩺 **rPPG Heart Monitor**: Remote photoplethysmography tracks skin green-channel color variations (simulated sinusoids in simulator mode) to calculate heart rate (BPM) and Heart Rate Variability (HRV) with a real-time scrolling wave canvas.
- 👁️ **Biometric Liveness Detection (Anti-Spoofing)**: Analyzes Eye Aspect Ratio (EAR) to detect eye blinks and coordinate variance to flag presentation photo attacks as `STATIC (SUSPECT)` vs `VERIFIED (SECURE)`.
- 🧠 **Cognitive Telemetry Dashboard**: Real-time Focus level, Stress index, and Mental Fatigue estimation derived from emotional state and blinking metrics.
- 🧬 **Multiple ML Classifiers**: Runs 5 separate deep convolutional neural networks simultaneously client-side via WebGL.
- 🎨 **Futuristic Theme Selector**: Switch between 4 custom color palettes instantly (*Cyberpunk Neon*, *Bio-Tech Green*, *Quantum Amber*, and *Obsidian Eclipse*) changing text accents, shadows, and canvas overrides.
- 📊 **Real-time Analytics HUD**:
  - **Mood Meter**: Radial speedometer calculating a composite "Positivity Index".
  - **Live Recharts Spectrum**: Optimised real-time bar graph displaying the percentage scores of all 7 expressions.
  - **Session Telemetry**: Records session uptime, peak concurrent subjects seen, and dominant expression.
- 🕐 **Biometric Trace Timeline**: Scrollable list logging previous readings, throttled to a readable 1-second interval.
- 📸 **Biometric Export System**: "Capture" triggers combine video canvas layers, burn in subject ID overlays, and save a custom biometrics status report onto a downloadable PNG file.
- 💾 **Data Log Export**: Export the entire session logs and snapshot registry database as a formatted JSON report file.
- ⚙️ **HUD Settings Drawer**: Toggle mesh layers, demographic estimates, canvas sparklines, and modify model confidence levels on the fly.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: React 18 + Vite (Client-side bootstrapper)
- **Styling**: Tailwind CSS + Custom CSS (featuring scanlines, custom scrollbars, and neon glows)
- **AI Core**: `face-api.js` (TensorFlow.js browser-adapted wrappers)
- **Motion Engine**: `framer-motion` (for boot screen transitions and telemetry lists)
- **Graphs**: `recharts` (custom SVG dashboard plots)
- **Utilities**: `date-fns` (time calculations) and `clsx` (dynamic classes)

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- Google Chrome or any modern browser supporting WebGL and webcam media access
- Integrated or external Webcam

### Step 1: Clone and Scrape Dependencies
```bash
git clone <your-repo-url>
cd emotion-mirror
npm install
```

### Step 2: Set up Model Weights
We include a custom automation script to download the weight manifests and shard binaries directly from the source repository.
```bash
# Programmatic model downloads to public/models/
node download-models.js
```

Alternatively, you can manually download the weights files from [JustADudeWhoHacks Weights Repo](https://github.com/justadudewhohacks/face-api.js/tree/master/weights) and place them under the `/public/models/` folder:
- `tiny_face_detector_model-weights_manifest.json` and `tiny_face_detector_model-shard1`
- `face_landmark_68_model-weights_manifest.json` and `face_landmark_68_model-shard1`
- `face_recognition_model-weights_manifest.json`, `face_recognition_model-shard1`, and `face_recognition_model-shard2`
- `face_expression_model-weights_manifest.json` and `face_expression_model-shard1`
- `age_gender_model-weights_manifest.json` and `age_gender_model-shard1`

### Step 3: Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser. Enable camera permissions when prompted.

---

## 🧠 How the ML Models Work

All models run locally client-side via **TensorFlow.js** bindings inside `face-api.js`:
1. **TinyFaceDetector**: A sub-network utilizing depth-wise separable convolutions to identify bounding boxes of faces quickly. Designed for resource-constrained environments (like mobile and browsers).
2. **FaceLandmark68Net**: Generates 68 separate point matrices on the face mapping eyes, eyebrows, nose bridge, lip contours, and jaw profiles.
3. **FaceRecognitionNet**: Employs a ResNet-34-like architecture to extract face descriptor vectors (128 floating point values) representing unique facial features.
4. **FaceExpressionNet**: Learns micro-expression wrinkles and muscle configurations to return probabilities for: *Neutral, Happy, Sad, Angry, Surprised, Fearful, Disgusted*.
5. **AgeGenderNet**: A multi-task model classifying age range values and returning male/female classifications.

---

## 💡 Technical Accomplishments & Optimizations

### 1. Asynchronous Model Loading Orchestration
By loading 5 networks sequentially, we prevent high memory usage on startup. We bind callback listeners directly into the React UI state, enabling our Cyberpunk Loading Screen to stack progress bars and update labels dynamically as each weight manifests.

### 2. Canvas-Video Frame Locking (30fps)
To prevent frame processing lags, `useFaceDetection.js` uses an internal boolean lock (`isProcessingRef`). If an inference step takes longer than a single frame interval (e.g. on slow CPUs), the frame is skipped, avoiding call-stack queuing. This keeps the webcam feed executing at a smooth 30 FPS.

### 3. Throttled Log Buffer Management
Pushing 30 telemetry frames per second to the timeline would make it run too fast to read. `useEmotionHistory.js` solves this by introducing a 1000ms cooldown, capping history arrays at 50 records and slicing values efficiently.

### 4. Non-Remounting Recharts Plots
Recharts charts can lag when data updates frequently. By fixing the chart layout coordinates, disabling animations, and updating chart metrics inline via react state, we keep rendering speeds fast without causing component unmount cycles.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE details.
