<div align="center">
  <img src="public/favicon.ico" alt="AlgoNotes Logo" width="80" height="80" />
  <h1 align="center">AlgoNotes</h1>
  <p align="center">
    <strong>A modern, open platform for mastering Data Structures and Algorithms.</strong>
  </p>
  <p align="center">
    Built with Next.js 15, TypeScript, Node.js, Express, Prisma, and PostgreSQL.
  </p>
</div>

<hr />

## 🌟 Overview

AlgoNotes is a full-stack learning platform designed to make data structures and algorithms (DSA) stick. It combines comprehensive documentation, visual intuition, and an interactive code playground with sandboxed execution.

### Key Features
- **📚 24+ In-Depth Topics:** From Arrays to Dynamic Programming, complete with intuitions and visual guides.
- **💻 Interactive Playground:** Write and run code directly in the browser (powered by Judge0) supporting C++, Java, Python, and JavaScript.
- **🧩 Practice Problems:** LeetCode-style problem solving with immediate execution feedback.
- **🌓 Dark Mode & Responsive:** Premium UI tailored for both desktop and mobile.
- **⚡ Fast & SEO Optimized:** Built on Next.js 15 App Router with full-text search capability.

## 🏗️ Architecture

AlgoNotes is divided into two decoupled services:

1. **Frontend (`/src`)**: Next.js 15 App Router, React 19, Tailwind CSS, Monaco Editor.
2. **Backend (`/backend`)**: Node.js, Express, TypeScript, Prisma ORM, JWT Auth, rate limiting.

They communicate via REST APIs. The code execution is securely delegated to an isolated Judge0 instance.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 20.9.0
- PostgreSQL >= 15
- npm or pnpm

### Local Setup (Development)

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Configure Environment Variables**
   ```bash
   # Root level
   cp .env.example .env.local

   # Backend level
   cd backend
   cp .env.example .env
   ```
   Ensure you set `DATABASE_URL` in both `.env` files to point to your PostgreSQL instance.

3. **Database Initialization**
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```

4. **Start the Development Servers**
   ```bash
   # Start backend
   cd backend
   npm run dev

   # In a new terminal, start frontend
   npm run dev
   ```

5. Visit `http://localhost:3000` to access the platform.

### Docker Deployment (Production)

To deploy the entire stack (Postgres, Backend, Frontend, Nginx) using Docker Compose:

1. **Setup Environment**
   ```bash
   cp docker/.env.example docker/.env
   # Edit docker/.env with your production secrets (DB password, JWT secrets, API URL)
   ```

2. **Launch**
   ```bash
   docker-compose up -d --build
   ```

The application will be available at port `8080` (or whatever `APP_PORT` you specified in `.env`).

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS, Radix UI, Monaco Editor, Lucide Icons, MDX.
- **Backend:** Node.js, Express, TypeScript, Zod, Prisma, JSON Web Tokens.
- **Database:** PostgreSQL.
- **Code Execution:** Judge0 CE.
- **Infrastructure:** Docker, Docker Compose, Nginx.

## 📖 Content Management

Documentation is written in MDX (Markdown with JSX) and stored in `content/docs/`. Adding a new topic is as simple as creating a new `.mdx` file with the appropriate frontmatter.

## 🛡️ License

This project is open-source and available under the MIT License.
