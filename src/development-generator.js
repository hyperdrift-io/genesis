// Development guide generator - provides the "How" for Claude

export function generateDevelopmentGuide() {
  return `# Development Guide

## Best Practices for this Nuxt 3 + Nuxt UI Project

### Component Usage

Always use Nuxt UI components for consistency:

\`\`\`vue
<!-- Use these components -->
<UButton>Click me</UButton>
<UCard>Content here</UCard>
<UContainer>Page content</UContainer>
<UInput v-model="value" />
<UTextarea v-model="text" />
<USelect v-model="selected" :options="options" />
\`\`\`

### Page Structure

Follow this pattern for pages:

\`\`\`vue
<template>
  <UContainer>
    <div class="space-y-6">
      <!-- Page content -->
    </div>
  </UContainer>
</template>

<script setup>
// Page logic here
</script>
\`\`\`

### API Routes

Create API routes in \`server/api/\`:

\`\`\`typescript
// server/api/items.get.ts
export default defineEventHandler(async (event) => {
  // Handle GET requests
  return { items: [] }
})

// server/api/items.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  // Handle POST requests
  return { success: true }
})
\`\`\`

### State Management

Use Pinia stores in \`stores/\`:

\`\`\`typescript
// stores/app.ts
export const useAppStore = defineStore('app', {
  state: () => ({
    items: []
  }),
  actions: {
    async fetchItems() {
      const { data } = await $fetch('/api/items')
      this.items = data
    }
  }
})
\`\`\`

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Leverage Nuxt UI's built-in color system: \`primary\`, \`secondary\`, \`success\`, \`warning\`, \`error\`
- Use semantic spacing: \`space-y-4\`, \`gap-6\`, \`p-4\`, \`m-6\`
- Make components responsive with \`sm:\`, \`md:\`, \`lg:\` prefixes

### Form Handling

\`\`\`vue
<template>
  <UForm :state="form" @submit="onSubmit">
    <UInput v-model="form.name" label="Name" required />
    <UButton type="submit">Submit</UButton>
  </UForm>
</template>

<script setup>
const form = reactive({
  name: ''
})

async function onSubmit() {
  await $fetch('/api/submit', {
    method: 'POST',
    body: form
  })
}
</script>
\`\`\`

### Navigation

Use Nuxt's built-in navigation:

\`\`\`vue
<template>
  <nav>
    <NuxtLink to="/">Home</NuxtLink>
    <NuxtLink to="/about">About</NuxtLink>
  </nav>
</template>
\`\`\`

### Error Handling

\`\`\`vue
<script setup>
// Handle async data with error states
const { data, error, pending } = await useFetch('/api/data')

if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Data not found'
  })
}
</script>
\`\`\`

### SEO & Meta

\`\`\`vue
<script setup>
useSeoMeta({
  title: 'Page Title',
  description: 'Page description'
})
</script>
\`\`\`

Remember: Keep components simple, use Nuxt UI for consistency, and leverage Nuxt 3's auto-imports.`;
} 