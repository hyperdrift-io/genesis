# Genesis V2

**One-command app creation** using Nuxt + Claude Code integration

**Built with Go** for fast startup, single binary distribution, and zero dependencies.

## What Genesis V2 Does

Genesis creates a complete, working Nuxt 3 app automatically using AI. **No manual steps, no configuration** - just describe what you want and get a fully built app.

## Installation

### Download Binary (Recommended)

```bash
# macOS (Apple Silicon)
curl -L https://github.com/hyperdrift-io/genesis/releases/latest/download/genesis-darwin-arm64 -o genesis
chmod +x genesis
sudo mv genesis /usr/local/bin/

# macOS (Intel)
curl -L https://github.com/hyperdrift-io/genesis/releases/latest/download/genesis-darwin-amd64 -o genesis
chmod +x genesis
sudo mv genesis /usr/local/bin/

# Linux (x64)
curl -L https://github.com/hyperdrift-io/genesis/releases/latest/download/genesis-linux-amd64 -o genesis
chmod +x genesis
sudo mv genesis /usr/local/bin/

# Windows (x64)
# Download genesis-windows-amd64.exe from releases page
```

### Or Build from Source

**Requires Go 1.19+ installed first:**

```bash
# Install Go if not already installed:
# macOS: brew install go
# Linux: sudo apt install golang-go  (Ubuntu/Debian)
# Windows: Download from https://golang.org/dl/

# Then install Genesis:
go install github.com/hyperdrift-io/genesis/cmd/genesis@latest

# Or clone and build:
git clone https://github.com/hyperdrift-io/genesis.git
cd genesis
make build
```

## Usage

```bash
# One command creates AND builds your entire app
genesis my-store "E-commerce store for handmade jewelry"

# Wait a few minutes while AI builds your app...
# ✓ Nuxt app created
# ✓ Nuxt UI added  
# ✓ AI context generated
# ✓ Claude Code ready
# ✓ App built successfully

cd my-store
npm run dev
# Your complete app is ready! 🎉
```

## How It Works

1. **Creates Nuxt 3 app** with `npx nuxi init`
2. **Adds Nuxt UI** with `npx nuxi module add ui`  
3. **Generates README.md** with your app description
4. **Generates DEVELOPMENT.md** with Nuxt UI best practices
5. **Installs Claude Code** (if not already installed)
6. **Auto-builds the app** using Claude Code with intelligent prompts

## What You Get

A **complete, working application** with:
- Modern homepage with hero section
- Main functionality as described
- Proper navigation and routing  
- Nuxt UI components throughout
- Responsive design with Tailwind CSS
- Best practices and clean code

## Examples

```bash
# E-commerce store
genesis jewelry-store "E-commerce for handmade jewelry with custom sizing"

# SaaS application  
genesis project-tool "Project management tool for small teams with kanban boards"

# Blog platform
genesis tech-blog "Technical blog with article creation and comment system"

# Each creates a complete, working app automatically
```

## Continue Development

After Genesis builds your app, continue enhancing it:

```bash
cd my-app
claude "add user authentication with login/signup"
claude "implement payment processing with Stripe"
claude "add admin dashboard for content management"
```

## Why This Approach Works

- **Single binary distribution** - No dependencies, no runtime required
- **Fast startup** - Go performance vs Node.js
- **No templates to maintain** - AI generates fresh, modern code
- **No configuration hell** - Works with Nuxt + Nuxt UI defaults  
- **Always up-to-date** - Uses latest best practices
- **Complete applications** - Not just scaffolding, but working apps
- **AI-driven development** - Intelligent code generation and implementation

## Development

```bash
# Build for current platform
make build

# Build for all platforms  
make dist

# Test locally
make dev

# Install locally
make install
```

## Architecture

```
genesis/
├── cmd/genesis/            # CLI entry point
├── internal/
│   ├── generator/          # Main creation logic + Claude integration
│   └── templates/          # README and dev guide generators
├── Makefile               # Build automation
└── go.mod                 # Go dependencies
```

**Benefits:** Single binary, fast startup, zero dependencies 🚀

---

*Genesis V1 archive available at tag `v1-archive`*
