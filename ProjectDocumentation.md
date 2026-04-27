🧭 PROJECT OVERVIEW
🎯 Goal
Build a browser-first passport & visa photo generator that:
Crops face correctly (rule-based)
Removes background locally (no paid API dependency)
Applies controlled lighting correction (no face alteration)
Generates print-ready photos (future phase)
Runs on Next.js + Vercel free tier

🧱 SYSTEM ARCHITECTURE
🟦 Frontend (Primary Processing Layer)
Image upload
Face detection
Crop UI + adjustments
Background removal
Lighting correction
Background selection
Preview rendering
🟩 Backend (Minimal, Vercel API routes)
Final image export (resize + format)
Optional validation checks
Print-sheet generation (later phase)

⚙️ CORE TECHNOLOGY STACK
🧠 Frontend Libraries

1. Face detection
   MediaPipe
   Used for:
   face bounding box
   eye position estimation
   auto crop initialization

2. Crop UI
   react-easy-crop
   Used for:
   aspect ratio locked cropping
   drag/zoom adjustment
   preview-based editing

3. Background removal
   @imgly/background-removal
   Used for:
   client-side segmentation
   human subject extraction

4. Edge + image processing
   Canvas API (native browser)
   OpenCV.js (optional advanced layer)
   Used for:
   feathering edges
   mask smoothing
   brightness/contrast adjustments
   histogram-based correction

🧾 Backend Libraries (Vercel API routes) 5. Final processing
Sharp
Used for:
final resize (passport standards)
format conversion (JPEG)
compression optimization

📐 SUPPORTED PHOTO FORMATS
🇮🇳 Indian Visa Photo
Size: 2 × 2 inch
Resolution: 300 DPI
Pixels: 600 × 600
Background: fixed white (#FFFFFF)

🇧🇩 Bangladesh Passport Photo
Size: 1.5 × 1.9 inch
Resolution: 300 DPI
Pixels: 450 × 570
Background: selectable (default blue)

🧠 CORE PROCESSING PIPELINE
STEP 1 — Upload
User uploads 6–8MB image
Immediate compression (client-side)

STEP 2 — Face Detection (MediaPipe)
Detect:
face bounding box
eye position

STEP 3 — Smart Crop Engine
Rules:
Lock aspect ratio (based on target format)
Head occupies ~60–70% height
Eyes aligned ~55–60% vertical position
Center horizontally

STEP 4 — Manual Adjustment UI
Using react-easy-crop:
drag image
zoom in/out
fine-tune alignment

STEP 5 — Background Removal
Using IMG.LY:
run on cropped image only
output transparent PNG

STEP 6 — Edge Refinement Layer
Apply:
feather mask edges
color decontamination
optional OpenCV.js smoothing

STEP 7 — Background Replacement
India Visa:
fixed white background
Bangladesh Passport:
selectable palette:
blue (default)
light blue
white
off-white

STEP 8 — Auto Retouch (Lighting Correction)
Rules:
brightness normalization
gamma correction
contrast adjustment
white balance correction
face-aware enhancement (MediaPipe region)
NO:
skin smoothing
face reshaping

STEP 9 — Quality Validation Engine
Checks:
face size too small
face off-center
image too dark/bright
blur detection
Output:
warnings or auto-fix suggestions

STEP 10 — Final Export (Server-side)
Using Sharp:
resize to exact pixel dimensions
compress JPEG
return downloadable image

🎨 UX FLOW DESIGN
Screen 1: Upload
drag & drop / file select
Screen 2: Auto Crop Preview
face detected overlay
suggestion shown
Screen 3: Manual Adjust
crop box (react-easy-crop)
zoom slider
Screen 4: Background Selection
color swatches (Bangladesh only)
Screen 5: Enhancement Toggle
“Auto Enhance” ON/OFF
Screen 6: Final Preview
before/after slider
download button

🔥 KEY FEATURES (FINAL PRODUCT SCOPE)
✔ Core MVP
Face detection
Smart crop
Background removal
White/blue background
Auto resize

✔ V1 Upgrade
Manual crop adjustment
Lighting correction
Edge refinement

✔ V2 Premium
Quality validation system
Multi-background presets
Before/after comparison UI

✔ V3 (future)
Print-ready sheet generator
Multi-photo layout (A4)
Batch processing

⚠️ DESIGN CONSTRAINTS (IMPORTANT)
❌ Do NOT:
beautify face
reshape identity
use heavy AI filters
rely on external APIs for core pipeline
✅ DO:
preserve identity
correct lighting only
keep processing deterministic
prioritize speed + trust

🚀 ARCHITECTURE SUMMARY
UPLOAD
↓
MediaPipe (face detection)
↓
react-easy-crop (manual adjustment)
↓
IMG.LY (background removal)
↓
Edge refinement (Canvas/OpenCV.js)
↓
Background selection
↓
Auto lighting correction
↓
Sharp (final export on server)

🧠 PRODUCT POSITIONING (IMPORTANT)
Your app is NOT:
❌ photo editor
It IS:
✅ “passport-grade photo generator system”
That positioning is what makes it trustworthy and useful.
