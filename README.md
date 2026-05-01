# 📸 Rapid Photo — Official Passport and Visa Photos Generator

<p align="center">
  <img src="public/logo/rp-logo2.png" alt="Rapid Photo Logo" width="250">
</p>

![Rapid Photo Screenshot](https://res.cloudinary.com/djmfhatti/image/upload/v1777665354/rapid-photo-home_y56mrh.png)

<div align="center">

### [🚀 Live Demo](https://rapid-photo.vercel.app/) | [💻 GitHub Repo](https://github.com/hadialhamza/rapid-photo)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-State-orange?style=for-the-badge)](https://zustand-demo.pmnd.rs/)
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
- **🔒 Privacy-First**: Heavy client-side processing ensuring images are handled on-the-fly without permanent server storage.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (for premium animations)
- **State Management**: Zustand (Global Store for Editor & Print Cart)
- **Face Detection**: MediaPipe Tasks Vision
- **Image Editing**: react-easy-crop + Canvas API

### Backend & Processing

- **Serverless**: Vercel API Routes
- **Image Engine**: **Sharp** (High-performance resizing, JPEG optimization, 300 DPI metadata injection)
- **External AI**: remove.bg API (Subject extraction)

---

## ⚙️ How It Works (The Pipeline)

1.  **Upload**: User selects a high-res photo.
2.  **Detect**: MediaPipe scans for face bounding boxes and eye coordinates in the browser.
3.  **Smart Crop**: The engine automatically calculates the crop area based on official rules (e.g., head height ~70% of frame).
4.  **Process**: The subject is extracted via AI, background is replaced with official colors, and lighting is normalized.
5.  **Export**: The final image is sent to a Sharp-powered server to inject 300 DPI metadata and exact pixel dimensions.
6.  **Print**: User can generate a layout of 4, 8, or 12 photos on a single A4 sheet.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- remove.bg API Key(s)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hadialhamza/rapid-photo.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file and add your remove.bg API keys:

   ```env
   REMOVE_BG_API_KEY_1=your_key_here
   REMOVE_BG_API_KEY_2=your_other_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🧠 Engineering Highlights

- **Optimized Performance**: Leveraged the **Leaf Pattern** in Next.js to minimize client-side bundle size, keeping interactivity restricted to specific sub-components while maintaining Server Components for layouts.
- **Resilient API Handling**: Implemented a failover strategy for background removal that detects rate limits and dynamically switches between multiple API credentials.
- **Deterministic Processing**: Engineered a math-based "Smart Crop" utility that translates normalized facial landmarks into absolute pixel coordinates for consistent results regardless of image resolution.

---

## 👨‍💻 Author

**MD HADI AL HAMZA**  
Full Stack Developer | Rangpur, Bangladesh  
[Portfolio](https://hadialhamza.vercel.app) | [LinkedIn](https://www.linkedin.com/in/hadihamza) | [GitHub](https://github.com/hadialhamza)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
