# 🚀 ProjectVerse-AI — AI-Powered Project Generation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![CI](https://github.com/shreyas026/ProjectVerse-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/shreyas026/ProjectVerse-AI/actions)
[![Stars](https://img.shields.io/github/stars/shreyas026/ProjectVerse-AI?style=social)](https://github.com/shreyas026/ProjectVerse-AI/stargazers)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org)
[![AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-3.0+-orange.svg)](https://sdk.vercel.ai/docs)

**Generate complete project structures, boilerplate code, and architectural blueprints from natural language descriptions. Powered by LLMs with intelligent template selection and customization.**

---

## 🎯 Features

- 🎨 **Project Generation** — Full-stack projects from text descriptions
- 🏗️ **Smart Templates** — Curated templates for React, Next.js, Python, Flutter, etc.
- 🧠 **AI Architecture** — Automatic tech stack recommendation based on requirements
- 📦 **Component Library** — Reusable, customizable component generation
- 🔧 **Configuration** — Package.json, tsconfig, Docker, CI/CD, env files
- 📚 **Documentation** — Auto-generated README, API docs, architecture diagrams
- 🎭 **Interactive Mode** — Step-by-step refinement with AI assistance

---

## 🏗️ Architecture

`
┌─────────────────┐
│  User Input     │
│  (Natural Lang) │
└────────┬────────┘
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Intent Parser  │────▶│  Template Matcher │
│  (LLM + Rules)  │     │  (Vector Search)  │
└────────┬────────┘     └────────┬─────────┘
         ▼                       ▼
┌─────────────────────────────────────────┐
│         Code Generator                  │
│  (Template Engine + LLM Refinement)     │
└────────┬────────────────────────────────┘
         ▼
┌─────────────────────────────────────────┐
│         Output Package                  │
│  Files + Config + Docs + Tests          │
└─────────────────────────────────────────┘
`

### Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **AI/ML** | Vercel AI SDK, OpenAI/Anthropic APIs, LangChain |
| **Backend** | Next.js API Routes, Server Actions |
| **Templates** | Handlebars, Plop.js, custom generators |
| **Deployment** | Vercel, Docker |

---

## 📁 Project Structure

`
ProjectVerse-AI/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── generate/          # Generation page
│   ├── templates/         # Template marketplace
│   └── globals.css
├── projectverse-ai/       # Core generation engine
│   ├── src/
│   │   ├── generators/    # Code generators per stack
│   │   ├── templates/     # Template definitions
│   │   ├── parsers/       # Intent parsing
│   │   ├── llm/           # LLM integration
│   │   └── utils/         # Helpers
│   ├── package.json
│   └── tsconfig.json
├── .github/workflows/     # CI/CD
└── README.md
`

---

## ⚙️ Quick Start

### Prerequisites
- Node.js 20+
- OpenAI API key (or Anthropic)

### 1. Clone & Install
`ash
git clone https://github.com/shreyas026/ProjectVerse-AI.git
cd ProjectVerse-AI
npm install
`

### 2. Environment Variables
Create .env.local:
`env
OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_anthropic_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
`

### 3. Run Development
`ash
npm run dev
`
Open http://localhost:3000

---

## 🎮 Usage

### Web Interface
1. Navigate to /generate
2. Describe your project in natural language
3. Select/refine template
4. Download or deploy generated project

### CLI (Coming Soon)
`ash
npx projectverse-ai generate "E-commerce API with auth, payments, inventory"
`

---

## 🧪 Testing & Quality

`ash
# Lint
npm run lint

# Type check
npm run typecheck

# Test
npm test

# Build
npm run build
`

---

## 📦 Supported Project Types

| Category | Templates |
|----------|-----------|
| **Web Apps** | Next.js, React, Vue, Svelte, Remix |
| **APIs** | Node/Express, Fastify, NestJS, FastAPI, Go Gin |
| **Mobile** | Flutter, React Native, Expo |
| **Desktop** | Tauri, Electron |
| **AI/ML** | Streamlit, Gradio, FastAPI + ML |
| **DevOps** | Docker, K8s, GitHub Actions, Terraform |

---

## 🤝 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License
MIT License — see [LICENSE](LICENSE)
