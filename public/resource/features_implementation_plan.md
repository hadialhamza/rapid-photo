# Rapid Photo — Core Features Implementation Plan

এই প্ল্যানটি **ProjectDocumentation.md**-এর Core MVP এবং V1 Upgrade ফিচারগুলোকে step-by-step ইমপ্লিমেন্টেশনের জন্য তৈরি করা হয়েছে। পুরো প্রসেসিং পাইপলাইন ব্রাউজারে (client-side) চলবে, শুধুমাত্র final export server-side (Sharp) হবে।

---

## Resolved Decisions

| প্রশ্ন | সিদ্ধান্ত |
|--------|---------|
| **Editor route path** | `/editor` (file: `src/app/editor/page.tsx`) |
| **WASM model hosting** | **CDN (ডিফল্ট)** — imgly এর গ্লোবাল CDN থেকে লোড হবে। Vercel bandwidth বাঁচবে, কোনো এক্সট্রা কনফিগ লাগবে না। |
| **Export format** | **JPEG (ডিফল্ট)** — quality: 95, DPI: 300। ভবিষ্যতে PNG option যোগ হবে। |

## Dependencies to Install

> [!IMPORTANT]
> **নতুন ডিপেন্ডেন্সি ইনস্টল করা হবে:**
> - `@mediapipe/tasks-vision` — Face detection (bounding box, eye position)
> - `remove.bg API` — Server-side background removal (via API route)
> - `react-easy-crop` — Crop UI with aspect ratio lock
> - `sharp` — Server-side final image export (resize, JPEG compression)

---

## Proposed Changes

### Phase 1: Editor Page Shell & Photo Upload

প্রথমে Editor পেজের বেসিক কাঠামো তৈরি করা হবে — রাউট, লেআউট, এবং ইমেজ আপলোড ফাংশনালিটি।

---

#### [NEW] `src/app/editor/page.tsx`
- Editor পেজের মূল সার্ভার কম্পোনেন্ট
- URL `?preset=bd-passport` থেকে preset রিড করবে
- `EditorWorkspace` (client component) কে রেন্ডার করবে

#### [NEW] `src/app/editor/loading.tsx`
- Editor পেজের জন্য কাস্টম লোডিং স্টেট (existing `Loader` কম্পোনেন্ট রিইউজ)

#### [NEW] `src/components/editor/EditorWorkspace.tsx` — `"use client"`
- এটি পুরো editor এর মূল ক্লায়েন্ট কম্পোনেন্ট
- **State machine:** `upload → detecting → cropping → removing-bg → replacing-bg → enhancing → preview → export`
- সব child কম্পোনেন্টকে orchestrate করবে
- Processing pipeline এর step tracking ও progress indicator

#### [NEW] `src/components/editor/UploadZone.tsx` — `"use client"`
- Drag & drop + file select UI
- File validation (JPEG, PNG, WebP only; max 15MB)
- Client-side compression (Canvas API দিয়ে oversized image shrink)
- `onImageLoaded(imageData: ImageData)` callback

#### [NEW] `src/components/editor/FormatSelector.tsx`
- Country/format preset selector
- `SUPPORTED_FORMATS` থেকে ডাটা পড়বে
- Selected format → aspect ratio, dimensions, bg color সব প্রোভাইড করবে

#### [MODIFY] `src/lib/constants/photo-formats.ts`
- `PhotoFormat` interface এ নতুন ফিল্ড যোগ:
  - `widthPx`, `heightPx` (exact pixel dimensions)
  - `aspectRatio` (number, calculated)
  - `defaultBgHex` (hex color code)
  - `dpi` (always 300)
  - `headRatio` (0.6–0.7 range for head height)
  - `eyeLineRatio` (0.55–0.60 range for eye position)

---

### Phase 2: Face Detection Engine (MediaPipe)

MediaPipe ব্যবহার করে ফেস ডিটেকশন — bounding box এবং eye position বের করা হবে।

---

#### [NEW] `src/lib/engine/face-detector.ts`
- MediaPipe `FaceDetector` initialize ও run
- Input: `HTMLImageElement` বা `ImageBitmap`
- Output:
  ```ts
  interface FaceDetectionResult {
    faceBoundingBox: { x: number; y: number; width: number; height: number };
    leftEye: { x: number; y: number };
    rightEye: { x: number; y: number };
    confidence: number;
  }
  ```
- Error handling: no face detected, multiple faces, low confidence

#### [NEW] `src/lib/engine/smart-crop.ts`
- Input: `FaceDetectionResult` + `PhotoFormat`
- Output: `CropArea { x, y, width, height }` (pixels)
- Rules (ProjectDocumentation.md অনুসারে):
  - Head occupies ~60–70% of photo height
  - Eyes aligned at ~55–60% vertical position
  - Face centered horizontally
  - Aspect ratio locked to target format

#### [NEW] `src/components/editor/FaceOverlay.tsx` — `"use client"`
- Face detection result visualization
- Bounding box + eye markers overlay
- Confidence score indicator
- "No face detected" error state

---

### Phase 3: Crop UI (react-easy-crop)

ইউজারকে ম্যানুয়ালি ক্রপ অ্যাডজাস্ট করতে দেওয়া হবে।

---

#### [NEW] `src/components/editor/CropEditor.tsx` — `"use client"`
- `react-easy-crop` integration
- Aspect ratio locked (from selected format)
- Initial crop position = smart crop output
- Zoom slider control
- "Reset to Auto" button
- Output: `croppedAreaPixels` → Canvas API crop

#### [NEW] `src/lib/engine/crop-utils.ts`
- `getCroppedImage(imageSrc, pixelCrop)` → `Blob`
- Canvas API ব্যবহার করে actual cropping
- High-quality rendering (imageSmoothingQuality: 'high')

---

### Phase 4: Background Removal (remove.bg API)

ক্রপ করা ইমেজ থেকে ব্যাকগ্রাউন্ড রিমুভ করা হবে। Remove.bg API সার্ভার সাইড রাউটের মাধ্যমে কল করা হবে যেন API key নিরাপদ থাকে।

---

#### [NEW] `src/app/api/remove-bg/route.ts`
- Next.js Server Route Handler (POST)
- `remove.bg` API integration (ব্যবহার করবে `REMOVE_BG_API_KEY` env variable)
- Input: FormData containing the cropped image file
- Output: Transparent PNG image response
- Error handling: Rate limits, Invalid format, Missing API Key

#### [NEW] `src/lib/engine/bg-removal-client.ts`
- Client-side helper function
- Input: cropped image `Blob`
- Output: transparent PNG `Blob`
- `fetch("/api/remove-bg")` দিয়ে সার্ভারে রিকোয়েস্ট পাঠাবে
- Error handling and retry logic

#### [NEW] `src/components/editor/ProcessingOverlay.tsx` — `"use client"`
- Full-screen loading overlay (processing এর সময়)
- Step indicator: "Detecting face..." → "Cropping..." → "Removing background..."
- Custom `Loader` কম্পোনেন্ট রিইউজ

---

### Phase 5: Edge Refinement + Background Replacement

মাস্ক edge smoothing এবং নতুন ব্যাকগ্রাউন্ড যোগ করা হবে।

---

#### [NEW] `src/lib/engine/edge-refiner.ts`
- Canvas API based mask refinement
- Feathering edges (gaussian blur on alpha channel)
- Color decontamination (remove color spill from original bg)
- Input: transparent PNG `ImageData`
- Output: refined transparent PNG `ImageData`

#### [NEW] `src/lib/engine/bg-replacer.ts`
- Input: refined transparent PNG + target background color (hex)
- Output: final composited image `Blob`
- Canvas compositing: draw solid color → draw subject on top

#### [NEW] `src/components/editor/BackgroundPicker.tsx` — `"use client"`
- Color swatch grid (White, Blue, Light Blue, Off-white, Light Grey)
- Custom color picker (optional)
- Live preview update
- Format-specific defaults (India → White, Bangladesh → Blue/White)

---

### Phase 6: Auto Lighting Correction

লাইটিং কারেকশন — শুধুমাত্র brightness, contrast, gamma (NO face reshaping/beautifying).

---

#### [NEW] `src/lib/engine/lighting-corrector.ts`
- Canvas API pixel manipulation
- Features:
  - Brightness normalization (histogram analysis)
  - Gamma correction
  - Contrast adjustment
  - White balance correction
- Face-aware enhancement (MediaPipe region থেকে প্রাপ্ত area তে focused)
- Toggle ON/OFF support
- **NO skin smoothing, NO face reshaping** (ProjectDocumentation.md constraint)

#### [NEW] `src/components/editor/EnhanceToggle.tsx` — `"use client"`
- "Auto Enhance" toggle switch
- Before/after mini-preview (existing `CompareSlider` কম্পোনেন্ট রিইউজ)

---

### Phase 7: Quality Validation

ফাইনাল ইমেজ ভ্যালিডেশন — ইমেজ কোয়ালিটি চেক করা হবে।

---

#### [NEW] `src/lib/engine/quality-validator.ts`
- Checks:
  - Face size too small (< 50% of frame)
  - Face off-center (> 10% deviation)
  - Image too dark/bright (avg luminance out of range)
  - Blur detection (Laplacian variance)
- Output:
  ```ts
  interface ValidationResult {
    passed: boolean;
    warnings: { type: string; message: string; severity: 'warning' | 'error' }[];
  }
  ```

#### [NEW] `src/components/editor/ValidationPanel.tsx`
- Warning/error cards
- Auto-fix suggestions
- "Retake photo" prompt for critical issues

---

### Phase 8: Preview & Final Export

ফাইনাল প্রিভিউ এবং সার্ভার-সাইড এক্সপোর্ট (Sharp)। **ডিফল্ট ফরম্যাট: JPEG (quality: 95)**।

---

#### [NEW] `src/components/editor/FinalPreview.tsx` — `"use client"`
- Before/after comparison (`CompareSlider` রিইউজ)
- Full-size preview
- Format info display (dimensions, DPI, file size estimate)
- "Download" button → triggers server export

#### [NEW] `src/app/api/export/route.ts`
- Next.js Route Handler (POST)
- Input: FormData with image blob + target format config
- Processing (Sharp):
  - Resize to exact pixel dimensions
  - Set DPI metadata to 300
  - **JPEG compression (quality: 95)** — ডিফল্ট ফরম্যাট
- Output: downloadable image Response
- Content-Disposition header: `passport-photo-{format-id}.jpg`

#### [NEW] `src/lib/engine/export-client.ts`
- Client-side helper to call `/api/export`
- FormData construction
- Download trigger (blob → URL.createObjectURL → anchor click)

---

### Phase 9: Editor Layout & Navigation Polish

Editor পেজের ওভারঅল লেআউট পলিশ করা হবে।

---

#### [NEW] `src/components/editor/EditorToolbar.tsx`
- Step indicator / breadcrumb
- "Start Over" button
- Format badge (currently selected format)

#### [NEW] `src/components/editor/EditorSidebar.tsx`
- Collapsible sidebar for controls
- Format selection, crop controls, bg picker, enhance toggle
- Responsive: bottom sheet on mobile, sidebar on desktop

---

## File Structure Summary

```
src/
├── app/
│   ├── editor/
│   │   ├── page.tsx              ← Editor route (/editor)
│   │   └── loading.tsx           ← Editor loading state
│   └── api/
│       ├── export/
│       │   └── route.ts          ← Server-side Sharp export (JPEG default)
│       └── remove-bg/
│           └── route.ts          ← Server-side remove.bg API handler
├── components/
│   ├── editor/
│   │   ├── EditorWorkspace.tsx   ← Main orchestrator (client)
│   │   ├── UploadZone.tsx        ← Drag & drop upload
│   │   ├── FormatSelector.tsx    ← Country/preset picker
│   │   ├── FaceOverlay.tsx       ← Face detection viz
│   │   ├── CropEditor.tsx        ← react-easy-crop wrapper
│   │   ├── ProcessingOverlay.tsx  ← Loading states
│   │   ├── BackgroundPicker.tsx   ← BG color selection
│   │   ├── EnhanceToggle.tsx      ← Lighting toggle
│   │   ├── ValidationPanel.tsx    ← Quality warnings
│   │   ├── FinalPreview.tsx       ← Before/after + download
│   │   ├── EditorToolbar.tsx      ← Step indicator
│   │   └── EditorSidebar.tsx      ← Controls panel
│   └── ui/                        ← Existing reusable components
└── lib/
    ├── engine/
    │   ├── face-detector.ts       ← MediaPipe wrapper
    │   ├── smart-crop.ts          ← Rule-based auto crop
    │   ├── crop-utils.ts          ← Canvas crop helper
    │   ├── bg-removal-client.ts   ← Client for remove-bg API route
    │   ├── edge-refiner.ts        ← Mask smoothing
    │   ├── bg-replacer.ts         ← Background compositing
    │   ├── lighting-corrector.ts  ← Brightness/contrast/gamma
    │   ├── quality-validator.ts   ← Image quality checks
    │   └── export-client.ts       ← Export API client
    └── constants/
        └── photo-formats.ts       ← Extended format data
```

---

## Implementation Order

| Phase | বিষয় | Priority | Estimated Work |
|-------|--------|----------|----------------|
| 1 | Editor Shell + Upload | 🔴 Critical | Medium |
| 2 | Face Detection (MediaPipe) | 🔴 Critical | Medium |
| 3 | Crop UI (react-easy-crop) | 🔴 Critical | Medium |
| 4 | Background Removal (remove.bg API) | 🔴 Critical | Medium |
| 5 | Edge Refinement + BG Replace | 🟡 Important | Medium |
| 6 | Auto Lighting Correction | 🟡 Important | Medium |
| 7 | Quality Validation | 🟢 Nice to have | Small |
| 8 | Preview + Server Export (JPEG) | 🔴 Critical | Medium |
| 9 | Layout Polish | 🟢 Nice to have | Small |

> Phase 1-4, 8 মিলে **Core MVP** complete হবে।
> Phase 5-6 হলো **V1 Upgrade**।
> Phase 7, 9 হলো **V2 Polish**।

---

## Verification Plan

### Automated Tests
- `npx next build` — TypeScript & build errors check
- Browser test: upload a selfie → full pipeline → download exported JPEG photo

### Manual Verification
1. বিভিন্ন ধরনের ছবি দিয়ে টেস্ট (selfie, group photo, no face, blurry)
2. সব supported format এ একটা করে JPEG export টেস্ট
3. Mobile responsiveness check
4. File size ও DPI validation of exported JPEG image
