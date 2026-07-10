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

🟩 Backend & Database (Processing, API & Storage Layer)

- Vercel API Routes (Next.js)
- Background Removal: Proxy to remove.bg API with automatic rotation across multiple API keys.
- Final Export Engine: Sharp (High-quality resizing, JPEG compression, DPI metadata).
- PDF Generation: Client-side layout for A4 print sheets.
- Database: Supabase (PostgreSQL)
  - Tables: `public.profiles` (user accounts/metadata), `public.user_images` (saved user history references to Cloudinary uploads).
  - Sync Triggers: Automated PostgreSQL trigger synchronizes Google OAuth auth.users metadata to public profiles.
- Image Storage: Cloudinary (Secure, optimized CDN delivery).

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

🧾 Backend, Database & Engine

5. Background Removal: remove.bg API
   - Used for: Professional-grade subject extraction with fine edge detail.
6. Final Image Processing: Sharp
   - Used for: 300 DPI metadata injection, JPEG optimization, exact pixel resizing.
7. Processing Utilities: Canvas API
   - Used for: Real-time filters (brightness, contrast, smoothing) and preview compositing.
8. Database Engine: PostgreSQL via Supabase
   - Used for: Storing user roles, profile states, and Cloudinary upload references. Enables Row Level Security (RLS) to safeguard records.

🛡️ SECURITY, AUTHENTICATION & ACCESS CONTROL
🔐 Edge Proxy (Turbine Middleware Routing)
- **Path Matcher**: Configured to intercept protected client paths `/dashboard`, `/editor`, and administrative sub-routes `/admin` in `src/proxy.ts`.
- **Pre-flight Checks**: Protects backend compute resources from unauthenticated requests by checking for session cookies.

🔐 Role-Based Access Control (RBAC) & Guards
- **`requireUser()`**: Validates active session. Automatically queries `profiles` database table, rejects banned users (wipes cookies, redirects client with custom Modal message), and loads profile details.
- **`requireAdmin()`**: Restricts access strictly to accounts with the `'admin'` role. Utilizes a cached profile lookup mechanism.
- **Supabase Service Role Client**: A custom admin client (`createAdminClient()`) initialized securely on the server utilizing `SUPABASE_SERVICE_ROLE_KEY` to perform administrative overrides (banning/unbanning users, auditing all uploads) bypassing RLS.

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

STEP 9 — Final Export & Sync
Server-side export using Sharp to ensure exact pixel dimensions and 300 DPI metadata. If logged in, the generated image is saved to Cloudinary, and its metadata synced with the database.

💻 ADMIN CONSOLE (MANAGEMENT DASHBOARD)
A premium, dark-themed administrative dashboard accessible to accounts with `admin` status:
- **System Metrics**: Overview cards indicating Total Users, Total Images, Admin count, and Banned user counts queried in parallel.
- **User Audits**: Lists all accounts, search by name/email, toggles roles (`user` ↔ `admin`), and toggles status (`active` ↔ `banned`).
- **Image Audits**: Feeds all user uploaded images with aspect previews. Admins can delete any generation logs which automatically purges database rows and sweeps/destroys files in Cloudinary.

🔥 KEY FEATURES (STATUS)
✅ Completed

- [x] AI Face Detection & Smart Crop
- [x] High-Quality Background Removal (remove.bg API with Multi-Key Rotation)
- [x] 150+ Country Formats Support
- [x] Auto-Lighting & Noiseware Filters
- [x] Before/After Comparison UI
- [x] Print-Ready A4 PDF Generator
- [x] Responsive Premium Design
- [x] Supabase Database & Google OAuth Integration
- [x] User History Dashboard & Cloudinary CDN Integration
- [x] Middleware Edge Auth Interceptor & Server Guards
- [x] Reusable Animation-enabled Modal UI
- [x] Admin Control Panel (User/Image Management, Search & Purge Tools)

🚀 PERFORMANCE & OFFLINE RESILIENCE OPTIMIZATION
- **Local MediaPipe Hosting**: WebAssembly files and the BlazeFace model are hosted locally in `public/mediapipe/` to eliminate external Google CDN network requests and prevent potential CORS or version mismatch issues.
- **Background Prefetching**: A client-side Prefetcher (`PrefetchMediaPipe.tsx`) downloads these assets in the background with low priority after the home page is fully loaded and the browser thread is idle.
- **Cache-First Service Worker Strategy**: The Service Worker (`sw.js`) intercepts all local `/mediapipe/*` asset requests and serves them with a Cache-First strategy to ensure instant load times and fully offline execution capability.

⚠️ DESIGN CONSTRAINTS (IMPORTANT)
❌ Do NOT:
- Reshape facial features or alter identity.
- Use heavy stylistic AI filters.
- Store user images permanently on public webroots.
  ✅ DO:
- Preserve official identity standards.
- Maintain 300 DPI print quality.
- Ensure deterministic and predictable results.
- Prioritize trust and data privacy.

🚀 ARCHITECTURE SUMMARY
UPLOAD → MediaPipe (Face) → react-easy-crop → remove.bg API → Sharp (Export) ──> Cloudinary ──> Supabase (DB Logs)

🧠 PRODUCT POSITIONING
Rapid Photo is an "Official Passport and Visa Photos Generator" designed for reliability, speed, and privacy.
