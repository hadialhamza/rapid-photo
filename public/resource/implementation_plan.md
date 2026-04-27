# Rapid Photo — Homepage Sections & Folder Structure Plan

## Part 1: Homepage Sections (Professional SaaS Landing Page)

তোমার app একটা **utility-driven SaaS tool** — এখানে user এর প্রধান concern হলো **trust**, **speed**, আর **compliance**। সেই অনুযায়ী sections:

### 📋 Section Layout (Top → Bottom)

| # | Section | কেন দরকার | Priority |
|---|---------|-----------|----------|
| 1 | **Navbar** | ✅ Already exists — Logo + nav links + CTA button | Done |
| 2 | **Hero** | ✅ Already exists — Main headline, upload CTA, trust badges | Done (enhance) |
| 3 | **Supported Formats** ⭐ | User দেখতে চায় তার দেশের photo support আছে কিনা — Country cards (🇧🇩 Bangladesh, 🇮🇳 India etc.) | **Must Add** |
| 4 | **How It Works** | ✅ Already exists — 3-step flow | Done |
| 5 | **Features** | ✅ Already exists — 4 feature cards | Done |
| 6 | **Before/After Demo** ⭐ | Interactive slider দিয়ে দেখাবে — raw selfie → processed passport photo. **Trust builder #1** | **Must Add** |
| 7 | **Privacy & Security** ⭐ | Photo processing local, no server upload — এই guarantee দেওয়া mandatory. Users are paranoid about face data | **Must Add** |
| 8 | **FAQ** ⭐ | Common doubts remove করে (requirements, rejection policy, file formats etc.) — SEO তেও help করে | **Must Add** |
| 9 | **Final CTA** ⭐ | Page এর নিচে আবার Upload CTA — user যেন scroll করে ফেরত না যেতে হয় | **Must Add** |
| 10 | **Footer** ⭐ | Links, social, legal (Privacy Policy, Terms), copyright | **Must Add** |

> [!IMPORTANT]
> **"Social Proof / Testimonials" section** এখন লাগবে না — MVP তে real user data নেই। V2 তে যোগ করা যাবে।

> [!TIP]
> **"Pricing" section** এখন দরকার নেই — app টা 100% free & local processing। Future-এ premium features আসলে তখন add করা যাবে।

### বিস্তারিত Section Breakdown

#### 🔷 Section 3: Supported Formats (NEW)
```
- Country cards grid (flag + name + photo specs)
- 🇧🇩 Bangladesh Passport: 1.5×1.9 inch, 450×570px, Blue bg
- 🇮🇳 Indian Visa: 2×2 inch, 600×600px, White bg
- Future: More countries can be added
- Each card clickable → later links to editor with preset
```

#### 🔷 Section 6: Before/After Demo (NEW)
```
- Interactive comparison slider
- Left: raw selfie (messy background, poor lighting)
- Right: processed passport photo (clean, cropped, proper bg)
- Caption: "See the difference in seconds"
```

#### 🔷 Section 7: Privacy & Security (NEW)
```
- Icon grid (3 items):
  - 🔒 "100% Local Processing" — Photos never leave your device
  - 🗑️ "No Data Storage" — Nothing saved on any server
  - ⚡ "Instant Processing" — All AI runs in your browser
- Trust badge strip
```

#### 🔷 Section 8: FAQ (NEW)
```
- Accordion-style expandable questions
- 5-6 common questions:
  - What photo requirements are supported?
  - Is my photo data secure?
  - Can I use a selfie taken from my phone?
  - What file formats are accepted?
  - What if my photo gets rejected?
  - Is this really free?
```

#### 🔷 Section 9: Final CTA (NEW)
```
- Dark gradient bg with headline
- "Ready to create your perfect passport photo?"
- Large "Upload Photo" button
- Small trust indicators below
```

#### 🔷 Section 10: Footer (NEW)
```
- Logo + tagline
- Navigation links
- Legal links (Privacy, Terms)
- Copyright
```

---

## Part 2: Best Practice Folder Structure

Project overview ও processing pipeline অনুযায়ী optimized structure:

```
src/
├── app/                              # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                    # Root layout (Navbar + Footer)
│   ├── page.tsx                      # Homepage (landing)
│   │
│   ├── editor/                       # Editor page (main processing flow)
│   │   └── page.tsx                  # Upload → Crop → BG Remove → Preview
│   │
│   └── api/                          # Backend API routes
│       └── export/
│           └── route.ts              # Sharp: final resize + JPEG compression
│
├── components/
│   ├── ui/                           # Reusable UI primitives
│   │   ├── button.tsx                ✅ exists
│   │   ├── card.tsx                  ✅ exists
│   │   ├── accordion.tsx             🆕 (for FAQ)
│   │   ├── slider.tsx               🆕 (for before/after, zoom)
│   │   ├── badge.tsx                🆕
│   │   └── dialog.tsx               🆕 (for modals)
│   │
│   ├── layout/                       # App-wide layout components
│   │   ├── Navbar.tsx                ✅ exists
│   │   └── Footer.tsx               🆕
│   │
│   ├── home/                         # Homepage sections
│   │   ├── HeroSection.tsx           ✅ exists
│   │   ├── SupportedFormatsSection.tsx  🆕
│   │   ├── HowItWorksSection.tsx     ✅ exists
│   │   ├── FeaturesSection.tsx       ✅ exists
│   │   ├── BeforeAfterSection.tsx    🆕
│   │   ├── PrivacySection.tsx        🆕
│   │   ├── FAQSection.tsx            🆕
│   │   └── CTASection.tsx            🆕
│   │
│   └── editor/                       # Editor page components
│       ├── ImageUploader.tsx         🆕 (drag & drop upload)
│       ├── FormatSelector.tsx        🆕 (country/format picker)
│       ├── CropEditor.tsx            🆕 (react-easy-crop wrapper)
│       ├── BackgroundSelector.tsx    🆕 (color swatches)
│       ├── EnhanceToggle.tsx         🆕 (auto enhance on/off)
│       ├── PhotoPreview.tsx          🆕 (final preview + before/after)
│       └── ExportButton.tsx          🆕 (download trigger)
│
├── lib/                              # Shared utilities & business logic
│   ├── utils.ts                      ✅ exists (cn helper)
│   │
│   ├── constants/                    # Static data & config
│   │   ├── photo-formats.ts          🆕 (BD passport, IN visa specs)
│   │   └── faq-data.ts              🆕
│   │
│   └── processing/                   # Core image processing pipeline
│       ├── face-detection.ts         🆕 (MediaPipe wrapper)
│       ├── smart-crop.ts             🆕 (rule-based crop engine)
│       ├── background-removal.ts     🆕 (@imgly wrapper)
│       ├── edge-refinement.ts        🆕 (Canvas/OpenCV.js)
│       ├── lighting-correction.ts    🆕 (brightness, gamma, contrast)
│       └── quality-validation.ts     🆕 (face size, blur, center check)
│
├── hooks/                            # Custom React hooks
│   ├── useImageUpload.ts             🆕
│   ├── useFaceDetection.ts           🆕
│   ├── useCropEngine.ts              🆕
│   └── useImageProcessing.ts         🆕 (orchestrates pipeline)
│
└── types/                            # TypeScript types
    ├── photo-format.ts               🆕
    └── processing.ts                 🆕

public/
├── logo/
│   └── rp-logo.png                   ✅ exists
└── resource/                         (demo images, assets)
```

### Structure এর Key Design Decisions

| Decision | কেন |
|----------|------|
| `lib/processing/` আলাদা ফোল্ডার | Pipeline এর প্রতিটা step আলাদা module — testable, replaceable |
| `lib/constants/` | Photo format specs centralized — component আর processing দুই জায়গা থেকে reuse |
| `hooks/` top-level | Processing logic কে UI থেকে decouple — Leaf Pattern মানতে সাহায্য করে |
| `components/editor/` | Editor page এর components আলাদা namespace — home components এর সাথে mix হবে না |
| `types/` top-level | Shared types — components, hooks, lib সবাই use করবে |
| `app/api/export/` | শুধু final export server-side (Sharp) — বাকি সব client-side |

> [!NOTE]
> **Leaf Pattern Enforcement**: `page.tsx` files সবসময় Server Component থাকবে। Interactive parts (upload, crop, etc.) আলাদা `'use client'` sub-components এ extract হবে।

---

## Verification Plan

### Step 1: Folder Structure
- নতুন ফোল্ডারগুলো create করা
- Constants files (photo-formats, faq-data) populate করা

### Step 2: Homepage Sections
- নতুন sections তৈরি করা (SupportedFormats, BeforeAfter, Privacy, FAQ, CTA, Footer)
- `page.tsx` তে integrate করা
- Browser-এ visual verification

### Step 3: Build Check
- `npm run build` — কোনো error নেই confirm করা
