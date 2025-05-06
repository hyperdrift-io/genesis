# Developer Guide

## Getting Started

1. Install dependencies: `pnpm install`
2. Start the dev server: `pnpm dev`

## Project Structure

- `src/app/` - Next.js app directory
- `src/components/` - React components
- `src/services/` - Data services (API or localStorage)
- `src/store/` - Zustand stores for state management
- `src/types/` - TypeScript types

## Adding Features
- Add new entities by updating `genesis.json` and re-running Genesis.
- Add new pages/components as needed.

## Customization
- Add/modify Zustand stores in `src/store/`.
- Add/modify services in `src/services/`.

## Tech Stack Overview

| Technology | Version | Purpose | Documentation |
|------------|---------|---------|---------------|
| Next.js | ^15.0.0 | React framework | [Docs](https://nextjs.org/docs) |
| React | ^19.0.0 | UI library | [Docs](https://react.dev) |
| TypeScript | ^5.3.3 | Type safety | [Docs](https://www.typescriptlang.org/docs/) |
| Tailwind CSS | ^3.4.1 | Utility-first CSS | [Docs](https://tailwindcss.com/docs) |
| shadcn/ui | Latest | UI components | [Docs](https://ui.shadcn.com/docs) |
| Lucide Icons | ^0.312.0 | Icon library | [Guide](https://lucide.dev/guide) |
| Zustand | ^4.5.0 | State management | [Docs](https://docs.pmnd.rs/zustand) |

## UI Framework

We use [Tailwind CSS](https://tailwindcss.com) for styling with [shadcn/ui](https://ui.shadcn.com) components. This combination provides a comprehensive set of accessible, production-ready components for rapid development and a consistent user experience.

For detailed component usage, see [docs/rules/COMPONENTS.md](./COMPONENTS.md).

### Key UI Patterns

- Use Tailwind CSS utility classes for styling.
- Use shadcn/ui components for UI elements.
- Use the cn() utility for conditional class application.
- Use Lucide Icons for iconography.

## State Management

We use Zustand for state management. Each entity has its own store in the `src/store` directory.

```tsx
// Using a store
import { useUserStore } from "@/store/userStore";

function Component() {
  const { users, fetchUsers } = useUserStore();
  // ...
}
```

## React 19 Compatibility

This project uses React 19 with shadcn/ui components. All UI components have been tested and confirmed to work with React 19.

If you encounter any compatibility issues, please refer to the [shadcn/ui React 19 documentation](https://ui.shadcn.com/docs/react-19) for guidance on resolving them.

## Development Workflow

1. **Run the development server**:
   ```bash
   pnpm dev
   ```

2. **Use Cursor rules** to get inline documentation and guidance (see `.cursor/rules.MD`).

## Resources

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - utility-first CSS
- [shadcn/ui Documentation](https://ui.shadcn.com/docs) - UI components
- [Lucide Icons](https://lucide.dev/icons) - icon gallery
- [Zustand Documentation](https://docs.pmnd.rs/zustand) - state management
- [React 19 Documentation](https://react.dev) - React library docs 