# Genesis V2

Minimal app generator using Nuxt + AI-driven development

## What Genesis V2 Does

Genesis creates a basic Nuxt 3 + Nuxt UI app and generates documentation that gives Claude (or other AI tools) the context needed to build your app intelligently.

**No templates. No complex rules. Just minimal setup + AI intelligence.**

## Installation

```bash
npm install -g genesis
```

## Usage

```bash
genesis my-app "E-commerce store for handmade jewelry"
cd my-app
npm run dev

# Then use Claude to build it
claude "Read the README and build this app step by step"
```

## How It Works

1. **Creates Nuxt 3 app** with `npx nuxi init`
2. **Adds Nuxt UI** with `npx nuxi module add ui`  
3. **Generates README.md** with your app description and context
4. **Generates DEVELOPMENT.md** with Nuxt UI best practices
5. **You use Claude** to build the actual functionality

## Why This Approach Works

- **No config hell**: Just Nuxt + Nuxt UI defaults
- **No maintenance**: AI does the intelligent work
- **Always modern**: Uses latest Nuxt conventions
- **Simple**: ~100 lines of code total

## Examples

```bash
# Create different types of apps
genesis blog-app "Personal blog with articles and comments"
genesis store-app "E-commerce for vintage clothes"
genesis saas-app "Project management tool for small teams"

# Claude builds them all using the same simple context
```

## Architecture

```
genesis/
├── bin/genesis.js           # CLI entry point
├── src/
│   ├── index.js            # Main creation logic
│   ├── readme-generator.js # Generates README context
│   └── development-generator.js # Generates dev guidelines
└── package.json
```

**Total:** ~100 lines of JavaScript. That's it.

---

*Genesis V1 archive available at tag `v1-archive`*
