🧭 PROJECT OVERVIEW
🎯 Goal
Build a premium, browser-first passport & visa photo generator that provides official passport and visa photos with absolute privacy and professional quality.

Key Objectives:

- Precision Face Alignment: Rule-based auto-cropping using MediaPipe.
- Professional Background Removal: High-quality subject separation using remove.bg API with a multi-key rotation system.
- Quality Enhancement: Non-destructive lighting correction and optional skin smoothing.
- Global Standards: Support for 150+ countries and various official formats.
- Print-Ready Layouts: Create A4 PDF sheets with multiple photos for physical printing.
- Privacy First: Processing happens on-the-fly; no user images are stored permanently.

🧱 SYSTEM ARCHITECTURE
🟦 Frontend (Primary Interaction Layer)

- Next.js (App Router) + Tailwind CSS
- State Management: Zustand (Editor state, Print Cart)
- Client-side Processing:
  - Face Detection (MediaPipe)
  - Interactive Cropping (react-easy-crop)
  - Image Filtering (Canvas API)
  - Auto-Lighting & Noiseware
- UI Components: Framer Motion for premium animations, Lucide React icons.

🟩 Backend (Processing & API Layer)

- Vercel API Routes (Next.js)
- Background Removal: Proxy to remove.bg API with automatic rotation across multiple API keys to handle rate limits and credits.
- Final Export Engine: Sharp (High-quality resizing, JPEG compression, DPI metadata).
- PDF Generation: Client-side layout for A4 print sheets.

⚙️ CORE TECHNOLOGY STACK
🧠 Frontend Libraries

1. Face Detection: MediaPipe Tasks Vision
   - Used for: Face bounding box, eye position, and auto-crop initialization.
2. Crop UI: react-easy-crop
   - Used for: Aspect-ratio locked cropping, manual adjustments.
3. State Management: Zustand
   - Used for: Global editor state, print layout cart, and format selections.
4. Animations: Framer Motion
   - Used for: Smooth page transitions and micro-interactions.

🧾 Backend & Engine 5. Background Removal: remove.bg API

- Used for: Professional-grade subject extraction with fine edge detail.

6. Final Image Processing: Sharp
   - Used for: 300 DPI metadata injection, JPEG optimization, exact pixel resizing.
7. Processing Utilities: Canvas API
   - Used for: Real-time filters (brightness, contrast, smoothing) and preview compositing.

📐 SUPPORTED PHOTO FORMATS

- 150+ Countries: Including USA, UK, India, Bangladesh, Schengen, Canada, etc.
- Standard Formats: Passport, Visa, Stamp, ID Card, etc.
- Resolution: 300 DPI (Standard for official documents).

🧠 CORE PROCESSING PIPELINE
STEP 1 — Upload & Detect
User uploads an image. MediaPipe immediately scans for faces and eye positions.

STEP 2 — Smart Auto-Crop
Rule-based engine calculates the perfect crop:

- Head occupies ~60–70% of height.
- Eyes aligned at ~55–60% vertical line.
- Centered horizontally based on face midpoint.

STEP 3 — Manual Adjustment
User fine-tunes the crop using the interactive editor (Zoom/Rotate/Drag).

STEP 4 — Background Removal
Server-side processing using remove.bg API. The system automatically rotates through multiple API keys to ensure service availability.

STEP 5 — Quality Enhancement

- Auto-Lighting: Non-destructive brightness and contrast normalization.
- Noiseware: Optional skin smoothing for a professional studio look.

STEP 6 — Background Replacement
User selects from official colors (White, Off-white, Blue, Light Blue, etc.).

STEP 7 — Review & Compare
Compare original vs. processed image using the interactive slider.

STEP 8 — Print Layout (Optional)
Add processed photos to the "Print Cart" to generate an A4 PDF with multiple copies.

STEP 9 — Final Export
Server-side export using Sharp to ensure exact pixel dimensions and 300 DPI metadata.

🎨 UI/UX DESIGN
The application follows a modular multi-page structure:

- Home: High-converting landing page with features and how-it-works.
- Editor: The core workspace (Upload → Edit → Export).
- Supported Formats: Searchable directory of all global photo standards.
- Information Pages: Dedicated Features, How It Works, and Contact pages.
- Professional Policies: Privacy Policy and Terms of Service.

🔥 KEY FEATURES (STATUS)
✅ Completed

- [x] AI Face Detection & Smart Crop
- [x] High-Quality Background Removal (remove.bg API with Multi-Key Rotation)
- [x] 150+ Country Formats Support
- [x] Auto-Lighting & Noiseware Filters
- [x] Before/After Comparison UI
- [x] Print-Ready A4 PDF Generator
- [x] Responsive Premium Design
- [x] Privacy-First Workflow

⚠️ DESIGN CONSTRAINTS (IMPORTANT)
❌ Do NOT:

- Reshape facial features or alter identity.
- Use heavy stylistic AI filters.
- Store user images permanently on servers.
  ✅ DO:
- Preserve official identity standards.
- Maintain 300 DPI print quality.
- Ensure deterministic and predictable results.
- Prioritize trust and data privacy.

🚀 ARCHITECTURE SUMMARY
UPLOAD → MediaPipe (Face) → react-easy-crop → remove.bg API → Sharp (Export) → Print PDF (A4)

🧠 PRODUCT POSITIONING
Rapid Photo is an "Official Passport and Visa Photos Generator" designed for reliability, speed, and privacy.
