# 📸 Rapid Photo — Official Passport and Visa Photos Generator

<p align="center">
  <img src="public/logo/rp-logo2.png" alt="Rapid Photo Logo" width="250">
</p>

![Rapid Photo Screenshot](https://res.cloudinary.com/djmfhatti/image/upload/v1777665354/rapid-photo-home_y56mrh.png)

<div align="center">

### [🚀 Live Demo](https://rapid-photo.vercel.app/) | [💻 GitHub Repo](https://github.com/hadialhamza/rapid-photo)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-blue?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-lightblue?style=for-the-badge)](https://cloudinary.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

</div>

**Rapid Photo** is a premium, privacy-first web application designed to generate official passport and visa photos instantly. By combining browser-based AI with robust server-side processing, it automates the tedious task of aligning, cropping, and background-removal according to official global standards.

---

## 🌟 Key Features

- **🤖 AI-Powered Face Alignment**: Uses Google's **MediaPipe** to detect facial landmarks and automatically calculate the perfect crop (head size, eye-line) for 150+ country standards.
- **🖼️ Intelligent Background Removal**: Seamlessly separates subjects from backgrounds using the **remove.bg API** with high-fidelity edge refinement.
- **⚡ Multi-Key Rotation System**: A custom engineering solution that automatically rotates through multiple API keys to handle rate limits and credit quotas, ensuring 100% uptime.
- **✨ Studio-Quality Filters**: Optional non-destructive lighting correction and **Noiseware** skin smoothing for a professional studio look.
- **🌍 Global Standards**: Pre-configured presets for over 150 countries (USA, UK, India, Bangladesh, Schengen Area, and more).
- **🖨️ Print-Ready Layouts**: Add multiple photos to a "Print Cart" and generate a standard A4 PDF sheet ready for physical printing.
- **🔒 Secure Google OAuth & Profiles**: Native Google OAuth authentication via **Supabase**. Synchronizes profile metadata (full name, avatar URL) via automated Postgres DB triggers to local profiles.
- **📂 User Upload History**: Logged-in users can save their generated passport photos directly to **Cloudinary** and manage their history logs right on their dashboard.
- **🛡️ Full-Featured Admin Panel**: Administrators can oversee system-wide metrics (total users, images count), search user profiles, manage accounts (promote to admin, toggle ban/unban status), and audit/delete user-uploaded images.
- **🔒 Edge Middleware & Server Guards**: Secure page transitions (using `proxy.ts`) and server actions backed by role validation (`requireUser`, `requireAdmin`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (for premium animations)
- **State Management**: Zustand (Global Store for Editor & Print Cart)
- **Face Detection**: MediaPipe Tasks Vision
- **Image Editing**: react-easy-crop + Canvas API

### Backend & Database
- **Serverless**: Vercel API Routes
- **Database**: PostgreSQL (via Supabase) with Row Level Security (RLS) policies
- **Image Hosting**: Cloudinary Image Storage
- **Image Engine**: **Sharp** (High-performance resizing, JPEG optimization, 300 DPI metadata injection)
- **External AI**: remove.bg API (Subject extraction)

---

## ⚙️ How It Works (The Pipeline)

1. **Upload**: User selects a high-res photo.
2. **Detect**: MediaPipe scans for face bounding boxes and eye coordinates in the browser.
3. **Smart Crop**: The engine automatically calculates the crop area based on official rules.
4. **Process**: The subject is extracted via AI, background is replaced with official colors, and lighting is normalized.
5. **Export & CDN Sync**: The final image is sent to a Sharp-powered server to inject 300 DPI metadata. Logged-in users have their photos securely uploaded to Cloudinary, with references saved in the database.
6. **Print**: User can generate a layout of 4, 8, or 12 photos on a single A4 sheet.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or later
- remove.bg API Key(s)
- Supabase Project & Cloudinary Credentials

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hadialhamza/rapid-photo.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Database Schema:
   Go to your **Supabase Dashboard → SQL Editor** and execute the commands inside [supabase/schema.sql](supabase/schema.sql) file. This initializes the tables, triggers, policies, and sets up explicit table grants for `service_role`.

4. Configure Environment Variables:
   Create a `.env.local` file and add your credentials:
   ```env
   # Background Removal API Keys
   REMOVE_BG_API_KEY_1=your_key_here
   REMOVE_BG_API_KEY_2=your_other_key_here

   # Cloudinary Keys
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🧠 Engineering Highlights

- **Banned Interceptors**: Banned accounts are completely blocked at the entry callback point (`/api/auth/callback/route.ts`), signing them out immediately on the server before a session cookie can be registered on the client.
- **Server Guard Abstractions**: Consolidated route and action guards into server-only utilities (`requireUser()`, `requireAdmin()`) ensuring deterministic validation.
- **Optimized Performance**: Leveraged the **Leaf Pattern** in Next.js to minimize client-side bundle size, keeping interactivity restricted to specific sub-components while maintaining Server Components for layouts.

---

## 👨‍💻 Author

**MD HADI AL HAMZA**  
Full Stack Developer | Rangpur, Bangladesh  
[Portfolio](https://hadialhamza.vercel.app) | [LinkedIn](https://www.linkedin.com/in/hadihamza) | [GitHub](https://github.com/hadialhamza)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
