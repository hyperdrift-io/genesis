package generator

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/fatih/color"
	"github.com/hyperdrift-io/genesis/internal/templates"
)

type Generator struct {
	outputDir      string
	packageManager string
}

func New(outputDir string) *Generator {
	return &Generator{
		outputDir:      outputDir,
		packageManager: detectPackageManager(),
	}
}

// detectPackageManager finds the fastest available package manager
func detectPackageManager() string {
	// Try bun first (fastest) - check both PATH and default location
	if _, err := exec.LookPath("bun"); err == nil {
		return "bun"
	}
	// Check bun's default installation location
	if _, err := os.Stat(os.ExpandEnv("$HOME/.bun/bin/bun")); err == nil {
		return "bun"
	}
	
	// Fall back to pnpm (fast)
	if _, err := exec.LookPath("pnpm"); err == nil {
		return "pnpm"
	}
	
	// Default to npm (slowest but always available)
	return "npm"
}

func (g *Generator) CreateApp(appName, description string) error {
	appPath := filepath.Join(g.outputDir, appName)

	// Print header
	cyan := color.New(color.FgCyan)
	yellow := color.New(color.FgYellow)
	green := color.New(color.FgGreen)
	gray := color.New(color.FgHiBlack)

	cyan.Printf("🚀 Creating %s...\n", appName)
	gray.Printf("Description: %s\n", description)
	gray.Printf("Package Manager: %s ⚡\n", g.packageManager)
	fmt.Println()

	// Step 1: Create Nuxt app
	yellow.Println("⚡ Creating Nuxt app...")
	if err := g.createNuxtApp(appName); err != nil {
		return fmt.Errorf("failed to create Nuxt app: %w", err)
	}
	green.Println("✓ Nuxt app created")

	// Step 2: Add Nuxt UI
	yellow.Println("🎨 Adding Nuxt UI...")
	if err := g.addNuxtUI(appPath); err != nil {
		return fmt.Errorf("failed to add Nuxt UI: %w", err)
	}
	green.Println("✓ Nuxt UI added")

	// Step 3: Generate documentation
	yellow.Println("📚 Generating AI context...")
	if err := g.generateDocumentation(appName, description, appPath); err != nil {
		return fmt.Errorf("failed to generate documentation: %w", err)
	}
	green.Println("✓ AI context generated")

	// Step 4: Create starter app template
	yellow.Println("🎯 Creating starter template...")
	if err := g.createStarterTemplate(appPath, appName, description); err != nil {
		return fmt.Errorf("failed to create starter template: %w", err)
	}
	green.Println("✓ Starter template created")

	// Success message
	fmt.Println()
	green.Printf("🎉 %s created successfully!\n", appName)
	fmt.Println()
	cyan.Println("Your app is ready:")
	gray.Printf("  cd %s\n", appName)
	gray.Printf("  %s run dev\n", g.packageManager)
	fmt.Println()
	
	// Check Claude Code availability
	claudeAvailable, installMsg := g.checkClaudeCode()
	if claudeAvailable {
		cyan.Println("Build with Claude Code:")
		gray.Println(`  claude "Read the README.md and build the complete application"`)
		fmt.Println()
		yellow.Println("💡 The README.md contains the perfect AI prompt with all requirements")
	} else {
		yellow.Println("⚠️  Claude Code Setup Required:")
		fmt.Println(installMsg)
		fmt.Println()
		yellow.Println("💡 The README.md contains the perfect AI prompt for when you install Claude Code")
	}
	fmt.Println()

	return nil
}

func (g *Generator) createNuxtApp(appName string) error {
	cmd := exec.Command("npx", "nuxi@latest", "init", appName, "--package-manager", g.packageManager, "--git-init")
	cmd.Dir = g.outputDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	
	// Force non-interactive mode
	cmd.Env = append(os.Environ(), 
		"CI=true",
		"NUXT_TELEMETRY_DISABLED=1",
		"NODE_ENV=production",
	)
	
	err := cmd.Run()
	
	// Check if the app directory was created successfully despite TTY errors
	appPath := filepath.Join(g.outputDir, appName)
	if _, statErr := os.Stat(filepath.Join(appPath, "package.json")); statErr == nil {
		// App was created successfully, ignore the TTY error
		return nil
	}
	
	return err
}

func (g *Generator) getBunCommand() string {
	if _, err := exec.LookPath("bun"); err == nil {
		return "bun"
	}
	return os.ExpandEnv("$HOME/.bun/bin/bun")
}

func (g *Generator) addNuxtUI(appPath string) error {
	// First install dependencies using the detected package manager
	var installCmd *exec.Cmd
	switch g.packageManager {
	case "bun":
		installCmd = exec.Command(g.getBunCommand(), "install")
	case "pnpm":
		installCmd = exec.Command("pnpm", "install")
	default:
		installCmd = exec.Command("npm", "install")
	}
	
	installCmd.Dir = appPath
	installCmd.Stdout = os.Stdout
	installCmd.Stderr = os.Stderr
	if err := installCmd.Run(); err != nil {
		return fmt.Errorf("failed to install dependencies: %w", err)
	}

	// Then add Nuxt UI module
	cmd := exec.Command("npx", "nuxi@latest", "module", "add", "ui")
	cmd.Dir = appPath
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func (g *Generator) generateDocumentation(appName, description, appPath string) error {
	// Generate README.md with AI-optimized build instructions
	readme := templates.GenerateReadme(appName, description)
	readmePath := filepath.Join(appPath, "README.md")
	if err := os.WriteFile(readmePath, []byte(readme), 0644); err != nil {
		return fmt.Errorf("failed to write README.md: %w", err)
	}

	return nil
}

func (g *Generator) createStarterTemplate(appPath, appName, description string) error {
	// Create a clean homepage with hero section, wrapped in UApp as required by Nuxt UI
	appVue := fmt.Sprintf(`<template>
  <UApp>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Navigation -->
      <nav class="bg-white dark:bg-gray-800 shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">
                %s
              </h1>
            </div>
            <div class="flex items-center">
              <UButton variant="outline" size="sm">
                About
              </UButton>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <main class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            %s
          </h1>
          <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            %s
          </p>
          <div class="mt-10 flex items-center justify-center gap-x-6">
            <UButton size="lg">
              Get Started
            </UButton>
            <UButton variant="outline" size="lg">
              Learn More
            </UButton>
          </div>
        </div>

        <!-- Feature placeholder -->
        <div class="mt-20">
          <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              Ready to Build
            </h2>
            <p class="text-gray-600 dark:text-gray-300 text-center mb-6">
              This is a starter template created by Genesis. Use Claude Code to build the actual functionality:
            </p>
            <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <code class="text-sm text-gray-800 dark:text-gray-200">
                claude "build the functionality described in README.md"
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  </UApp>
</template>

<script setup>
// This is a starter template - use Claude Code to build the actual functionality
useHead({
  title: '%s',
  meta: [
    { name: 'description', content: '%s' }
  ]
})
</script>`, appName, appName, description, appName, description)

	// Write the new app.vue
	appVuePath := filepath.Join(appPath, "app.vue")
	if err := os.WriteFile(appVuePath, []byte(appVue), 0644); err != nil {
		return fmt.Errorf("failed to write app.vue: %w", err)
	}

	// Create assets directory and CSS file for Nuxt UI
	assetsDir := filepath.Join(appPath, "assets", "css")
	if err := os.MkdirAll(assetsDir, 0755); err != nil {
		return fmt.Errorf("failed to create assets directory: %w", err)
	}

	// Create main CSS file with proper Nuxt UI imports (not Tailwind directives)
	mainCSS := `@import "tailwindcss";
@import "@nuxt/ui";`

	mainCSSPath := filepath.Join(assetsDir, "main.css")
	if err := os.WriteFile(mainCSSPath, []byte(mainCSS), 0644); err != nil {
		return fmt.Errorf("failed to write main.css: %w", err)
	}

	// Update nuxt.config.ts to include the CSS file
	nuxtConfig := `// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css']
})`

	nuxtConfigPath := filepath.Join(appPath, "nuxt.config.ts")
	if err := os.WriteFile(nuxtConfigPath, []byte(nuxtConfig), 0644); err != nil {
		return fmt.Errorf("failed to write nuxt.config.ts: %w", err)
	}

	return nil
}

func (g *Generator) checkClaudeCode() (bool, string) {
	// Check if claude is available
	if _, err := exec.LookPath("claude"); err == nil {
		return true, ""
	}
	
	// Provide installation instructions
	installMsg := `Claude Code is not installed. To build the app with AI:

1. Install Claude Code:
   npm install -g @anthropic-ai/claude-code
   # or with bun: bun add -g @anthropic-ai/claude-code
   # or with pnpm: pnpm add -g @anthropic-ai/claude-code

2. Then run:
   claude "Read the README.md and build the complete application"

Alternatively, you can:
- Use the starter template as-is and develop manually
- Install Claude Code later when you're ready for AI assistance`

	return false, installMsg
} 