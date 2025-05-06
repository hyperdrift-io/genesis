# Task-Manager

A task management app

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

- Authentication
- Persistence


## Development Guidelines

Refer to the `.cursorrules` file in the project root for coding standards and best practices to ensure consistency across the codebase.
## Supabase Setup

This application is configured to use Supabase for data storage. To set it up:

1. Create a Supabase account and project at [supabase.com](https://supabase.io)
2. Copy your project URL and anon key from the API settings
3. Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start your development server with `pnpm dev`

Note: The application includes a fallback to localStorage when Supabase credentials are not provided, which is useful for development.
