<div align="center">
  <br />
</div>

<p align="center">
  <strong>React + TypeScript frontend for Echo Chat — a real-time ephemeral messaging platform.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react" alt="React 19" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Vite-v7-646CFF?style=flat-square&logo=vite" alt="Vite 7" /></a>
  <a href="#"><img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS 4" /></a>
  <a href="#"><img src="https://img.shields.io/badge/shadcn%2Fui-Latest-000000?style=flat-square" alt="shadcn/ui" /></a>
</p>

---

## Overview

This is the frontend for [Echo Chat](../readme.md), a real-time chat application built with the MERN stack. It connects to the Echo Chat backend via Socket.IO for live messaging and REST for room creation.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui (Radix UI primitives) |
| Icons | HugeIcons |

## Getting Started

```bash
pnpm install
pnpm dev
```

The dev server starts at `http://localhost:5173`. Make sure the [backend](../Backend/README.md) is running on `http://localhost:5000`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm typecheck` | Run TypeScript type checking |

## Project Structure

```
Frontend/
├── src/
│   ├── components/   # Reusable UI components (shadcn/ui)
│   └── ...           # App source files
├── public/           # Static assets
├── index.html
├── vite.config.ts
└── package.json
```
