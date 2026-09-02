<div align="center">

# ⚡ Moniruzzaman — Front-End & Full-Stack Developer Portfolio

**A high-performance, production-grade developer portfolio engineered with Next.js 16 (App Router), React 19, TypeScript, Neon Serverless PostgreSQL, and Google Gemini AI.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Neon Database](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

[**Explore Live Demo**](https://pexelneststudio.vercel.app) • [**Report Bug**](https://github.com/alvinmonir411/Protfolio/issues) • [**Request Feature**](https://github.com/alvinmonir411/Protfolio/issues)

</div>

---

## 📖 Overview

This repository houses the personal portfolio and digital playground of **Moniruzzaman**, a Front-End & MERN Full-Stack Developer specializing in building scalable web applications. The project goes beyond a static presentation site by integrating real-time API syncs, serverless databases, an interactive CLI terminal, and an AI representative powered by Google Gemini.

---

## 🚀 Key Architectural Features

### 1. 🤖 Google Gemini AI Assistant (v3.6 Flash)
- **Live AI Representative:** Integrated chat widget acting as Moniruzzaman's representative.
- **Multilingual & Context-Aware:** Converses intelligently in English, Bengali (বাংলা), and Banglish.
- **Formatted Markdown & Clickable Links:** Custom parser rendering clean hyperlinks, headers, bold tags, and bulleted lists.
- **Graceful Fallback Sequence:** Multi-model fallback chain (`gemini-3.6-flash` ➜ `gemini-3.5-flash` ➜ `gemini-flash-latest`) + intelligent local conversational engine.

### 2. ⚡ Serverless PostgreSQL with Neon DB
- **Database Engine:** Powered by Neon Serverless PostgreSQL with zero-cold-start connection pooling.
- **Dynamic Tables:**
  - `projects`: Full CRUD for title, description, category, tech stack, gallery images, and pinned status.
  - `skills`: Categorized frontend, backend, tools, and proficiency ratings.
  - `messages`: Asynchronous storage of direct client inquiries and contact submissions.
  - `profile_settings`: Dynamically customizable GitHub, LinkedIn, WhatsApp, Email, and Bio.
  - `site_views`: Live unique visitor counter tracking portfolio views.

### 3. 🔄 Real-Time GitHub Ecosystem Sync
- **Live GitHub Route (`/api/github`):** Automatically syncs with `@alvinmonir411` on GitHub.
- **Metrics Tracked:** Total public repositories (`75+`), stars, commit consistency, and top languages.
- **Live Activity Stream:** Real-time push events and commit messages with relative timestamps (`2m ago`, `2d ago`).
- **Performance Optimized:** 5-minute memory cache to prevent rate-limiting and guarantee sub-10ms response times.

### 4. 🪟 Router-Based Case Study Modals (Parallel & Intercepting Routes)
- **Zero-Flicker Interception:** Next.js `@modal/(.)projects/[projectId]` opens project case studies in a floating glassmorphic modal while maintaining background page context.
- **Preserved Scroll Position:** Configured with `scroll={false}` for zero scroll jumps on modal open/close.
- **Interactive Image Slider:** Multi-screenshot gallery with smooth zoom, thumbnail active rings, and keyboard navigation (`Esc` to close, `←` / `→` to browse).
- **Shareable Direct URLs:** Direct visits to `/projects/[projectId]` render a standalone full-page view.

### 5. 💻 Interactive Developer CLI Terminal
- **Functional Unix Terminal Emulator:** Built right into the home page.
- **Supported Commands:**
  - `$ help` — Lists all available terminal commands.
  - `$ bio` — Outputs developer career summary and background.
  - `$ skills` — Displays technical stack breakdown.
  - `$ projects` — Fetches live projects from Neon DB.
  - `$ experience` — Displays commercial tenure at SM Technology.
  - `$ contact` — Prints direct communication channels.
  - `$ theme` — Toggles application light/dark modes.
  - `$ clear` — Clears terminal buffer.

### 6. 🎛️ Full Admin Control Center (`/admin`)
- **Secure Secret Access:** Protected modal authentication shortcut in navigation logo.
- **Projects Management:** Add/Edit/Delete projects, upload multiple Cloudinary images, and toggle "Pin to Home".
- **Skills Matrix:** Manage proficiencies, icons, and tech categories.
- **Messages Inbox:** View and manage incoming client contact form submissions.
- **CV / Resume Uploader:** Upload and replace `resume.pdf` with immediate preview.
- **Profile Customizer:** Live editing of phone, email, WhatsApp, GitHub, and LinkedIn URLs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **UI Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/), Glassmorphism, Custom Animations |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) (`@neondatabase/serverless`) |
| **AI Integration** | [Google Gemini 3.6 Flash](https://ai.google.dev/) REST API |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Media Hosting** | [Cloudinary](https://cloudinary.com/) |
| **Deployment** | [Vercel](https://vercel.com/) with Speed Insights |

---

## 📂 Project Structure

```bash
protfolio/
├── app/
│   ├── @modal/                      # Parallel & Intercepting route modals
│   │   └── (.)projects/[projectId]/ # Intercepted project details modal
│   ├── Actions/                     # Server actions (Projects, Skills, Pinning)
│   ├── admin/                       # Protected admin control center
│   │   ├── projects/                # Project management UI
│   │   ├── skills/                  # Skills editor
│   │   ├── messages/                # Client messages inbox
│   │   └── settings/                # Profile, CV, & social links editor
│   ├── api/                         # Next.js API route handlers
│   │   ├── chat/                    # Google Gemini AI route
│   │   ├── github/                  # Real-time GitHub sync route
│   │   ├── messages/                # Contact form messages API
│   │   ├── profile/                 # Dynamic profile settings API
│   │   ├── projects/                # Projects CRUD API
│   │   ├── resume/                  # CV upload & metadata API
│   │   ├── skills/                  # Skills API
│   │   └── views/                   # Unique visitor analytics API
│   ├── Components/                  # Reusable UI component ecosystem
│   │   ├── AboutSection.tsx         # Bento Grid & experience stats
│   │   ├── CanvasBackground.tsx     # Interactive particle canvas
│   │   ├── ChatWidget.tsx           # Gemini AI Assistant with markdown
│   │   ├── ContactSection.tsx       # Neon DB async message form
│   │   ├── Footer.tsx               # Responsive modern footer
│   │   ├── GitHubStats.tsx          # Real-time GitHub metrics & commit feed
│   │   ├── HeroSection.tsx          # 3D holographic tilt card & bio
│   │   ├── Navber.tsx               # Smart cross-page navigation & logo fx
│   │   ├── ProjectCard.tsx          # Project card with spotlight glow
│   │   ├── ProjectDetailView.tsx    # Case study view & multi-image slider
│   │   ├── Projects.tsx             # Pinned projects section
│   │   ├── SkillsSection.tsx        # Filterable skills display
│   │   └── TerminalSection.tsx      # Interactive developer CLI emulator
│   ├── hooks/                       # Custom React hooks (useProfile, etc.)
│   ├── lib/                         # Database connection & Redux store
│   │   ├── db.ts                    # Neon PostgreSQL client initialization
│   │   └── experience.ts            # Dynamic work tenure calculator
│   ├── projects/                    # Dedicated all-projects showcase page
│   ├── globals.css                  # Custom CSS utilities & glassmorphism
│   └── layout.tsx                   # Root layout with providers & SpeedInsights
├── public/                          # Static assets, images, resume.pdf
└── scripts/                         # Neon database seed & initialization scripts
```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Neon Serverless PostgreSQL Database Connection
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"

# Google Gemini AI Integration
GEMINI_API_KEY="your_google_gemini_api_key"

# Cloudinary Storage
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

# Admin Security Key (Default: 13663)
NEXT_PUBLIC_ADMIN_SECRET="13663"
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js `20.x` or higher
- npm, yarn, or pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alvinmonir411/Protfolio.git
   cd Protfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Initialize Database Tables (Optional):**
   ```bash
   node scripts/init-neon.mjs
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```

5. **Open Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Build & Deployment

To verify and create an optimized production bundle:

```bash
# Type check and build
npm run build

# Start production server
npm run start
```

Deploy seamlessly to [Vercel](https://vercel.com/):
1. Import repository on Vercel.
2. Configure environment variables (`DATABASE_URL`, `GEMINI_API_KEY`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_ADMIN_SECRET`).
3. Deploy!

---

## 👨‍💻 Author

**Moniruzzaman**  
*Front-End & MERN Full-Stack Developer*

- 🌐 **Portfolio:** [pexelneststudio.vercel.app](https://pexelneststudio.vercel.app)
- 💼 **LinkedIn:** [linkedin.com/in/moniruzzaman13663](https://www.linkedin.com/in/moniruzzaman13663/)
- 🐙 **GitHub:** [github.com/alvinmonir411](https://github.com/alvinmonir411)
- 📧 **Email:** [alvinmonir411@gmail.com](mailto:alvinmonir411@gmail.com)
- 📱 **WhatsApp:** [+8801979915165](https://wa.me/8801979915165)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE). Built with ❤️ by Moniruzzaman.
