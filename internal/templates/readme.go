package templates

import "fmt"

func GenerateReadme(appName, description string) string {
	return fmt.Sprintf(`# %s

## What to Build
%s

## Tech Stack
- **Nuxt 3**: Vue.js framework with SSR, auto-routing, and modern tooling
- **Nuxt UI**: Comprehensive component library with Tailwind CSS
- **TypeScript**: For type safety and better DX

## Getting Started

`+"```"+`bash
npm install
npm run dev
`+"```"+`

## Development with Claude

This project is set up for AI-assisted development. Use commands like:

`+"```"+`bash
claude "Read the README and DEVELOPMENT.md, then build the homepage"
claude "Create the main functionality described above"
claude "Add navigation and improve the UI"
`+"```"+`

## Project Structure

`+"```"+`
%s/
├── pages/          # Auto-routed pages
├── components/     # Vue components
├── server/         # API routes  
├── assets/         # Build assets
├── public/         # Static files
└── stores/         # Pinia stores
`+"```"+`

The DEVELOPMENT.md file contains best practices and patterns to follow.`, appName, description, appName)
} 