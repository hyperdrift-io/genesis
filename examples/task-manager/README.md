# Task-Manager

A task management app built with Next.js, React 19, and shadcn/ui.

## Getting Started

1. Install dependencies:
```bash
pnpm install
```

2. Start the development server:
```bash
pnpm dev
```

## Features

- Create tasks with name, description, and additional properties
- Assign tasks to users
- Track task progress with different statuses
- Set priority levels and due dates
- Filter and search tasks

## Tech Stack

- **Frontend Framework**: Next.js 15
- **UI Library**: React 19
- **Component Library**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide Icons

## React 19 Compatibility

This project uses React 19 with shadcn/ui components. All dependencies have been configured to work with React 19.

For more information on React 19 compatibility with shadcn/ui, see the [official documentation](https://ui.shadcn.com/docs/react-19).

## Development Guidelines

Please refer to the development guidelines located in:

- [Main Developer Guide](./docs/rules/DEV-GUIDE.md)
- [UI Components Guide](./docs/rules/COMPONENTS.md)
- [Cursor Rules](./.cursor/rules.MD)

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - UI components
- `src/store/` - Zustand state management
- `src/types/` - TypeScript type definitions
- `src/services/` - Data services
- `docs/rules/` - Development guidelines

## License

This project is licensed under the MIT License.
