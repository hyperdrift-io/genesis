# UI Components Guide

This project uses [Tailwind CSS](https://tailwindcss.com) for styling with [shadcn/ui](https://ui.shadcn.com) components, providing a comprehensive set of accessible, production-ready components for rapid development and a consistent user experience.

## Core Libraries

| Library      | Version | Description                | Documentation                                      |
|--------------|---------|----------------------------|----------------------------------------------------|
| Tailwind CSS | Latest  | Utility-first CSS framework | [Docs](https://tailwindcss.com/docs)              |
| shadcn/ui    | Latest  | Reusable UI components     | [Docs](https://ui.shadcn.com/docs)                |
| Lucide Icons | 0.312.0 | Beautiful & consistent icon toolkit | [Docs](https://lucide.dev/guide/installation) / [Icons](https://lucide.dev/icons) |
| Zustand      | 4.5.0   | Small, fast state management | [Docs](https://docs.pmnd.rs/zustand/getting-started/introduction) |

## Using Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build designs directly in your markup:

### Button Example
```tsx
<button className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
  Click me
</button>
```

### Responsive Design
```tsx
<div className="md:flex">
  <div className="md:flex-shrink-0">
    <img className="h-48 w-full object-cover md:w-48" src="/img/example.jpg" alt="Example" />
  </div>
  <div className="p-8">
    <h2 className="text-xl font-semibold text-gray-900">Title</h2>
    <p className="mt-2 text-gray-600">Description goes here</p>
  </div>
</div>
```

## Using shadcn/ui Components

This project uses shadcn/ui components, which provide a set of reusable, accessible UI components styled with Tailwind CSS:

### Button Component
```tsx
import { Button } from "@/components/ui/button";

<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Card Component
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>
```

### Form Components
```tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="username">Username</Label>
    <Input id="username" placeholder="Enter username" />
  </div>
  <Button type="submit">Submit</Button>
</div>
```

## Using Lucide Icons

This project includes Lucide for beautiful, consistent icons:

```tsx
import { Heart, Share, Trash } from "lucide-react";

<Heart className="h-5 w-5" />
<Share className="h-5 w-5" />
<Trash className="h-5 w-5" />
```

Browse all available icons at [lucide.dev/icons](https://lucide.dev/icons).

## State Management with Zustand

Zustand is used for state management:

```tsx
import { useUserStore } from '@/store/userStore';

function Component() {
  const { users, fetchUsers } = useUserStore();
  // ...
}
```

## Styling Guidelines

- Use **Tailwind CSS classes** directly in your JSX for styling components
- Use the **cn() utility** for conditionally applying classes:
  ```tsx
  import { cn } from "@/lib/utils";
  
  <div className={cn(
    "base-class always-applied",
    condition && "class-applied-conditionally"
  )}>
    Content
  </div>
  ```
- Follow the **utility-first approach** - compose small utility classes rather than writing custom CSS
- Maintain consistent spacing, colors, and typography using Tailwind's design system

## React 19 Compatibility

All UI components in this project are compatible with React 19. If you encounter any issues, please refer to the [shadcn/ui React 19 documentation](https://ui.shadcn.com/docs/react-19).