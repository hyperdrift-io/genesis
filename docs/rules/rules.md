# Genesis App Development Guidelines

## General Rules
- Use Ant Design (ant.design) components for all UI elements unless a specific requirement cannot be met by Ant Design.
- Use plain CSS files for shared/global styles (e.g., layout, typography, colors).
- Use CSS Modules for component-specific (non-shared) styles to ensure encapsulation and avoid style leakage.
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
- Build UI components using Ant Design primitives and patterns.
- Use CSS Modules for component-specific styles and plain CSS for shared styles.
- Clearly define prop types using TypeScript interfaces.
- Keep components small and focused on a single responsibility.

## Routing and Navigation
- Use Next.js pages for routing; place new pages in 'src/pages/' following the existing structure.
- Define dynamic routes with bracket notation (e.g., [id].tsx) for entity details or dynamic segments.

## TypeScript
- Define interfaces for all entity types in 'src/types/'.
- Use TypeScript generics for reusable components and functions.
- Avoid 'any' type; prefer explicit types or unknown with type guards.

## Styling with CSS
- Use plain CSS files for global/shared styles.
- Use CSS Modules for component-specific styles.
- Avoid inline styles except for dynamic or one-off cases.

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

## Rule 2: Supabase Requirement
If a requested feature requires persistence, relational queries, authentication, real-time data, or any other functionality typically provided by a backend database, you MUST use Supabase to fulfill this requirement. Do not include Supabase unless such a requirement is present.

---

_This document is referenced by the AI to determine how to respond to user queries and which technologies to include._ 