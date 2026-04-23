# Rinoimob Website

Nuxt 3 Server-Side Rendered (SSR) website for the Rinoimob property management platform.

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure variables
4. Start development server: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build

## Environment Variables

See `.env.example` for available configuration:
- `NUXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:8080/api)

## Project Structure

```
├── pages/        # Page components (auto-routed)
├── components/   # Reusable components
├── layouts/      # Layout wrappers
├── public/       # Static assets
├── app.vue       # Root component
└── nuxt.config.ts # Nuxt configuration
```

## Technologies

- **Nuxt 3** - Vue meta-framework with SSR support
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client


Nuxt 3 SSR - Public-facing real estate listing website.

## Tech Stack
- Nuxt 3
- Vue 3
- TypeScript
- TailwindCSS
- Server-Side Rendering (SSR)

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure
- `pages/` - Nuxt pages
- `components/` - Vue components
- `layouts/` - Page layouts
- `server/` - Server API routes
- `content/` - Markdown content (blog, etc.)

## Features
- Property Listings
- SEO Optimization
- Blog/News
- Lead Capture
- Mobile Responsive

## Documentation
See [../rinoimob-docs](../rinoimob-docs) for architecture and API details.

## Issues
All development tasks are tracked in [.projects](https://github.com/revenlab/.projects/issues?q=label%3Awebsite).
