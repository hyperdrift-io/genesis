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

## 🛠️ Installation

### Global Installation

You can install Genesis globally to use it from anywhere:

```bash
pip install -e git+https://github.com/yannvr/genesis.git#egg=genesis
```

After installation, you'll have access to the `genesis` command globally:

```bash
genesis my-app --description "A blog application" --functionality "Users can create posts with tags"
```

### Development Installation

For contributing to Genesis or running from source:

```bash
git clone https://github.com/yannvr/genesis.git
cd genesis
pip install -e .
```

## 🛠️ Usage

Once installed, you can create new applications:

```bash
genesis my-app
```

The CLI will prompt you for a description of your application. That's it!

You can also provide description and functionality details directly:

```bash
genesis my-app --description "A task management app" --functionality "Users can create tasks, assign them to others, and track progress"
```

A highly DX friendly boilerplate will be created with initial typings. It doesn't not generate the app. The app is meant to generate most of the APP (UI, stores and behaviour) on the second prompt. The second prompt can be the same one as the first one (ie: `Users can create tasks, assign them to others, and track progress`)

## 🤖 AI-Assisted Development

It is best used from AI assisted IDE like:
- Cursor
- WindSurf

These rules help AI tools understand your codebase and make intelligent suggestions that align with your project's architecture and goals.
