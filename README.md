# MindMap Analogy Explorer

An interactive web app for generating vivid analogies using mind maps, built with Next.js, TypeScript, Tailwind CSS, and React Flow. Users can input a concept and audience, and the app generates creative analogies using the Gemini API.

## Features

- **Generate analogies**: Enter a concept and audience to get 5 creative analogies tailored to your needs.
- **Mind map visualization**: Explore analogies visually using an interactive mind map powered by React Flow.
- **Modern UI**: Built with reusable components, theming, and responsive design.
- **API integration**: Uses Google Gemini API for analogy generation.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Flow](https://reactflow.dev/) (for mind map visualization)
- [Framer Motion](https://www.framer.com/motion/) (animations)
- [Lucide React](https://lucide.dev/) (icons)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended), npm, or yarn

## Project Structure

- `app/` - Next.js app directory (routing, layout, API route)
	- `page.tsx` - Main landing page UI and logic
	- `layout.tsx` - App layout and theming
	- `api/generate/route.ts` - API route for analogy generation
- `components/` - UI components and theme provider
- `hooks/` - Custom React hooks
- `lib/` - Utility functions
- `public/` - Static assets
- `styles/` - Global styles

