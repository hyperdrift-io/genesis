# Genesis

Genesis is a hyperdrift app creation tool that generates complete web applications from a single prompt. Inspired by Tonk.xyz but streamlined for simplicity and effectiveness.

## 🌟 What is Genesis?

Genesis automates the entire process of web application creation by:
1. Using a single prompt to understand your requirements
2. Generating a complete, ready-to-run application with the right tools and configurations
3. Providing intelligent defaults that make sense
4. Including built-in rules and instructions for AI-assisted development

## 🚀 Key Features

- **Single Prompt App Creation**: Generate full applications from a simple description
- **Production-Ready Setup**: All configuration is done for you
- **AI-First Development**: Built-in LLM rules for continued development with AI assistants
- **Simplified Architecture**: No unnecessary complexity or dependencies
- **Modern Stack**: React, TypeScript, Tailwind CSS, and Supabase (optional)

## 📦 Structure of a Genesis Application

```
my-app/
├── src/
│   ├── components/   # Reusable UI components
│   ├── modules/      # Core functionality
│   ├── stores/       # State management
│   ├── views/        # Page components
│   ├── App.tsx       # Root component
│   └── index.tsx     # Entry point
├── public/           # Static assets
├── .cursor/          # AI development rules 
│   └── rules/        # LLM rules for development assistance
└── package.json      # Project configuration
```

## 🛠️ Usage

```bash
npx @genesis/create my-app
```

The CLI will prompt you for a description of your application. That's it!

## 🤖 AI-Assisted Development

Genesis creates applications with built-in rules for AI coding assistants like:
- GitHub Copilot
- Cursor
- Anthropic Claude
- OpenAI's ChatGPT

These rules help AI tools understand your codebase and make intelligent suggestions that align with your project's architecture and goals.

## 🔄 Improvements over Tonk

1. **Simplified Architecture**: Removed unnecessary dependencies like keepsync and hub
2. **Streamlined Configuration**: Focus on what matters for getting started quickly
3. **Improved AI Rules**: Better guidance for AI assistants during development
4. **Native Supabase Integration**: Optional backend-as-a-service integration
5. **Stronger Defaults**: More sensible defaults for modern web development

## 📚 License

MIT © Genesis 