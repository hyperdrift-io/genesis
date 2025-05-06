# Genesis Architecture

This document outlines the architecture and implementation details for Genesis, a hyperdrift app creation tool.

## Core Components

### 1. CLI Package (`@genesis/create`)

The core CLI tool for bootstrapping applications with a single prompt.

```
@genesis/create/
├── bin/                 # CLI entry points
├── src/
│   ├── create.ts        # Main creation logic
│   ├── templates/       # Template generators
│   │   ├── react.ts     # React template generator
│   │   └── react-supabase.ts # React+Supabase template
│   ├── prompts/         # User interaction prompts
│   └── utils/           # Helper utilities
├── templates/           # Static template files
│   ├── react/           # React template
│   └── react-supabase/  # React+Supabase template
└── package.json
```

### 2. Templates

Pre-configured application templates that serve as the foundation for Genesis apps.

#### React Template

A modern React application with TypeScript, Tailwind CSS, and Vite.

#### React+Supabase Template

Extends the React template with Supabase integration for authentication, database, and storage.

### 3. Rules System

AI development rules that guide AI assistants in understanding and extending the generated applications.

```
.cursor/rules/
├── src-components-rules.mdc  # Rules for component development
├── src-modules-rules.mdc     # Rules for module development
├── src-stores-rules.mdc      # Rules for state management
├── src-views-rules.mdc       # Rules for view components
└── global-rules.mdc          # Global project rules
```

## Implementation Plan

### Phase 1: Core CLI and Base Templates

1. Develop the CLI infrastructure
2. Create the React template with minimal dependencies
3. Implement basic AI rules for development guidance

### Phase 2: Supabase Integration

1. Add Supabase template with authentication
2. Implement database schema generation from prompt
3. Create AI rules for Supabase integration

### Phase 3: Enhancement and Refinement

1. Improve prompt engineering for better app generation
2. Add template variants (e.g., mobile-first, dashboard)
3. Enhance AI rules with more specific guidance

## Technical Decisions

### 1. Framework Choice

**React + TypeScript**: Provides a strong foundation with excellent tooling and community support.

### 2. Build System

**Vite**: Faster development and build times compared to Create React App or webpack configurations.

### 3. Styling

**Tailwind CSS**: Utility-first approach that allows for rapid UI development with shadcn/ui components.

### 4. Backend (Optional)

**Supabase**: Open-source Firebase alternative with PostgreSQL, authentication, and storage.

### 5. State Management

**React Query + Context API**: Simple yet powerful combination for most application needs.

## Simplifications from Tonk

1. **Removed Keepsync**: No specialized synchronization library, using Supabase for data persistence when needed
2. **No Hub Component**: Simplified architecture without the hub concept
3. **Streamlined Configuration**: Fewer configuration files with better defaults
4. **Simplified Rules**: More focused AI guidance rules

## Development Workflow

1. User runs `npx @genesis/create my-app`
2. CLI prompts for app description
3. Genesis generates the application based on description:
   - Selects appropriate template
   - Configures components based on requirements
   - Sets up necessary dependencies
   - Creates initial views and components
4. User begins development with AI assistance guided by built-in rules 