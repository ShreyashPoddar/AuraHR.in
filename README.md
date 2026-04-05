# 🌌 AuraHR | AI-Powered Recruitment Ecosystem

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google-cloud)](https://deepmind.google/technologies/gemini/)

**Live at: [aurahr.in](https://aurahr.in)**

AuraHR is a next-generation recruitment platform that leverages Gemini 1.5 Flash to automate the entire hiring pipeline—from JD parsing and candidate grading to AI-proctored assessments and intelligent interview co-piloting.

---

## 🚀 Key Features

### 1. AI-Driven Sourcing & Matching
- **Smart JD Parsing**: Automatically extracts technical requirements, seniority, and soft skills using Gemini 1.5 Flash.
- **Weighted Grading (60/20/20)**: Complex scoring model based on Experience (60%), Technical Alignment (20%), and Social/Project Presence (20%).
- **Social Enrichment**: Puppeteer-driven scraping of GitHub and LinkedIn profiles to provide a 360-degree candidate view.
- **OCR Resume Parsing**: AWS Textract integration for high-accuracy data extraction from PDFs.

### 2. Intelligent Assessment & Proctoring
- **Dynamic Assessment Generation**: AI-generated technical tests tailored to the specific Job Description.
- **Dual-Channel Proctoring**: 
  - **Eye Tracking**: MediaPipe-powered real-time gaze detection to prevent cheating.
  - **Tab Enforcement**: Real-time monitoring of browser visibility and focus.

### 3. Interview Ecosystem
- **AI Interview Co-Pilot**: Real-time STT (Speech-to-Text) relay via Socket.io with live Gemini feedback for recruiters.
- **Automated Scheduling**: Two-way sync with Google Calendar API for friction-less slot booking.
- **Jitsi Integration**: Automated secure conference room generation for every interview.

### 4. Recruiter Command Center
- **Dynamic Kanban Board**: Drag-and-drop candidate management from "Matched" to "Offered".
- **Automated Communication**: Resend API integration for automated offer/rejection emails triggered by stage changes.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL (AWS EC2 hosted)](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [NextAuth (Credentials & OAuth)](https://next-auth.js.org/)
- **AI/LLM**: [Gemini 1.5 Flash](https://aistudio.google.com/)
- **Vision/STT**: MediaPipe FaceMesh & Web Speech API
- **Infrastructure**: AWS (S3, Textract, EC2), Resend, Google Calendar API
- **Real-time**: Socket.io & Express

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL instance
- Google Cloud Console Project (for Calendar API)
- Gemini API Key

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/ShreyashPoddar/AuraHR.in.git
   cd aurahr-next
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file based on the environment section in the source.

4. **Run Locally**
   ```bash
   npm run dev
   # In a separate terminal for real-time features:
   npm run socket-server
   ```

---

## 🎨 Design Aesthetics
AuraHR features a premium, state-of-the-art "Glassmorphism" design system with:
- **Dark Mode Native**: High-contrast, easy-on-the-eyes workspace.
- **Micro-Animations**: Framer Motion powered transitions.
- **Dynamic Glows**: CSS-gradient blobs to maintain a futuristic feel.

---
