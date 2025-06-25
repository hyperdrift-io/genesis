package templates

import "fmt"

func GenerateReadme(appName, description string) string {
	return fmt.Sprintf(`# %s

## AI Build Instructions

You are tasked with building: **%s**

## What to Build

### Core Functionality
- Implement the main features described above
- Create a modern, responsive web application
- Use Nuxt 3 + Nuxt UI for the tech stack

### UI Requirements
- **Clean, modern design** with proper spacing and typography
- **Responsive layout** that works on desktop, tablet, and mobile
- **Dark mode support** using Nuxt UI's built-in color mode
- **Professional navigation** with proper active states
- **Consistent component usage** - use UButton, UCard, UInput, etc. from Nuxt UI
- **Proper loading states** and error handling

### Technical Implementation
- **Replace the current app.vue** with the actual application
- **Create necessary pages** in the pages/ directory for routing
- **Build functional components** in components/ directory
- **Add proper state management** using Pinia stores if needed
- **Implement proper form handling** with validation
- **Add transitions and animations** for better UX

### Code Quality
- **Clean, readable code** with proper TypeScript types
- **Proper component composition** and reusability
- **Good performance** - optimize for speed and efficiency
- **Accessibility** - proper ARIA labels and keyboard navigation
- **SEO-friendly** - proper meta tags and structured data

## Current Tech Stack
- **Nuxt 3**: Vue.js framework with SSR and auto-routing
- **Nuxt UI**: Component library with Tailwind CSS
- **TypeScript**: For type safety
- **Auto-imports**: Components and composables are auto-imported

## Getting Started
`+"```"+`bash
# Install dependencies (bun is already configured)
bun install

# Start development server
bun run dev
`+"```"+`

## Build Instructions for AI
1. **Read this README completely** to understand the requirements
2. **Replace the starter template** in app.vue with the actual application
3. **Create the main functionality** as described in the requirements above
4. **Use Nuxt UI components** throughout the application
5. **Test the application** to ensure it works properly
6. **Iterate and improve** based on the requirements

**Start building now! Replace the current app.vue with the actual %s application.**`, appName, description, appName)
} 