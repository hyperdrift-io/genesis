# [App Name]

[App Description]

## Getting Started

Follow these steps to run the application locally:

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Features

- [Feature List]

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Ant Design, CSS Modules
- **State Management**: Zustand
- **PWA Support**: Service Worker, Web Manifest
- **Architecture**: Module Pattern, API Client

## Project Structure

```
src/
├── app/                 # Next.js App Router files
├── components/          # Reusable UI components
├── modules/             # Business logic and API modules
│   ├── api/             # API interaction modules
│   └── core/            # Core business logic
├── pages/               # Additional Next.js pages
├── stores/              # Zustand stores
├── types/               # TypeScript type definitions
└── views/               # Page-level components
```

## Development Guidelines

Refer to the `.cursorrules` file in the project root for coding standards and best practices to ensure consistency across the codebase.

Ant Design is used as the default UI component library. See `docs/rules/COMPONENTS.md` for usage examples.

## PWA Features

This app is configured as a Progressive Web App (PWA), which means it can be installed on mobile devices and used offline. Test offline functionality to ensure a seamless user experience. 