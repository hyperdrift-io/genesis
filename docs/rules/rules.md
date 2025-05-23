# Genesis App Development Guidelines

## General Rules
- Use Tailwind CSS for styling with shadcn/ui components for UI elements.
- Use component composition and Tailwind utility classes for responsive layouts.
- Use CSS Modules only when Tailwind utilities are insufficient for complex styling needs.
- Remove unused imports and variables.
- Focus on business logic in views and stores; technical concerns (API calls, routing) are already handled.

## State Management
- Use the default state management approach provided by React (useState, useReducer, context) unless otherwise specified.
- Keep business logic in stores or API modules to maintain separation of concerns.

## API and Modules Pattern
- Use the pre-configured API modules in 'src/modules/api/' for backend interactions; do not make direct API calls from components or stores.
- If no backend is set up, rely on mock data in the API modules for development.
- Place non-API business logic in dedicated modules under 'src/modules/core/'.

## Component Structure
- Build UI components using shadcn/ui primitives and Tailwind CSS utility classes.
- Use CSS Modules only for complex styling needs that can't be addressed with Tailwind.
- Clearly define prop types using TypeScript interfaces.
- Keep components small and focused on a single responsibility.

## Routing and Navigation
- Use Next.js pages for routing; place new pages in 'src/pages/' following the existing structure.
- Define dynamic routes with bracket notation (e.g., [id].tsx) for entity details or dynamic segments.

## TypeScript
- Define interfaces for all entity types in 'src/types/'.
- Use TypeScript generics for reusable components and functions.
- Avoid 'any' type; prefer explicit types or unknown with type guards.

## Styling with Tailwind CSS
- Use Tailwind utility classes directly in JSX for component styling.
- Follow the utility-first approach - compose small utility classes rather than creating custom CSS.
- Use the cn() utility function to conditionally apply classes.
- Maintain consistent spacing, colors and typography using Tailwind's design system.

## Testing
- Write tests for new components and stores following existing patterns.
- Test business logic independently of UI components.
- Use mock data and services for testing to avoid dependencies on external services.

## PWA Features
- Respect the service worker registration in '_app.tsx' for offline capabilities.
- Test your app in offline mode to ensure it works properly.
- Update the manifest.json for app-specific metadata if needed.

## Extending the App
- For new entities not covered by the initial setup, create corresponding types, stores, and API modules following existing patterns.
- Avoid re-generating the app unless significant structural changes are needed.

---

# Genesis AI Rules

## Rule 1: Query Routing
All feature or implementation queries must be checked against the rules in this document before proceeding. This ensures consistent and minimal framework growth.

## Rule 2: UI Components
Always use the shadcn UI library to reduce complexity. Always prefer shadcn components over direct Radix UI primitives when possible. Use the latest version compatible with React 19.

## Rule 3: React 19 Compatibility
All code should be written with React 19 compatibility in mind. When adding new dependencies, ensure they are compatible with React 19.

## Rule 4: Supabase Requirement
If a requested feature requires persistence, relational queries, authentication, real-time data, or any other functionality typically provided by a backend database, you MUST use Supabase to fulfill this requirement. Do not include Supabase unless such a requirement is present.

---

_This document is referenced by the AI to determine how to respond to user queries and which technologies to include._ 