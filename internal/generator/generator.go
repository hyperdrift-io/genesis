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
	outputDir string
}

func New(outputDir string) *Generator {
	return &Generator{
		outputDir: outputDir,
	}
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

	// Step 4: Ensure Claude Code is available
	yellow.Println("🤖 Checking for Claude Code...")
	if err := g.ensureClaudeCode(); err != nil {
		return fmt.Errorf("failed to ensure Claude Code: %w", err)
	}
	green.Println("✓ Claude Code ready")

	// Step 5: Build the app with Claude
	yellow.Println("🧠 Building app with AI...")
	gray.Println("This may take a few minutes...")
	if err := g.buildAppWithClaude(appPath, description); err != nil {
		return fmt.Errorf("failed to build app with Claude: %w", err)
	}
	green.Println("✓ App built successfully")

	// Success message
	fmt.Println()
	green.Printf("🎉 %s created and built!\n", appName)
	fmt.Println()
	cyan.Println("Your app is ready:")
	gray.Printf("  cd %s\n", appName)
	gray.Println("  npm run dev")
	fmt.Println()
	cyan.Println("Continue development:")
	gray.Println(`  claude "add user authentication"`)
	gray.Println(`  claude "improve the UI design"`)
	fmt.Println()

	return nil
}

func (g *Generator) createNuxtApp(appName string) error {
	cmd := exec.Command("npx", "nuxi@latest", "init", appName)
	cmd.Dir = g.outputDir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func (g *Generator) addNuxtUI(appPath string) error {
	cmd := exec.Command("npx", "nuxi@latest", "module", "add", "ui")
	cmd.Dir = appPath
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func (g *Generator) generateDocumentation(appName, description, appPath string) error {
	// Generate README.md
	readme := templates.GenerateReadme(appName, description)
	readmePath := filepath.Join(appPath, "README.md")
	if err := os.WriteFile(readmePath, []byte(readme), 0644); err != nil {
		return fmt.Errorf("failed to write README.md: %w", err)
	}

	// Generate DEVELOPMENT.md
	devGuide := templates.GenerateDevelopmentGuide()
	devPath := filepath.Join(appPath, "DEVELOPMENT.md")
	if err := os.WriteFile(devPath, []byte(devGuide), 0644); err != nil {
		return fmt.Errorf("failed to write DEVELOPMENT.md: %w", err)
	}

	return nil
}

func (g *Generator) ensureClaudeCode() error {
	// Check if claude is available
	if err := exec.Command("claude", "--version").Run(); err != nil {
		// Install claude-code
		color.New(color.FgHiBlack).Println("Installing Claude Code...")
		cmd := exec.Command("npm", "install", "-g", "@anthropic-ai/claude-code")
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		return cmd.Run()
	}
	return nil
}

func (g *Generator) buildAppWithClaude(appPath, description string) error {
	buildPrompt := fmt.Sprintf(`Read the README.md and DEVELOPMENT.md files, then build this %s.

Create:
1. A modern homepage with hero section and proper navigation
2. The main functionality as described in the README
3. Proper page routing and navigation
4. Use Nuxt UI components throughout
5. Add proper styling with Tailwind CSS
6. Make it responsive and accessible

Follow the best practices in DEVELOPMENT.md. Build a complete, working application.`, description)

	cmd := exec.Command("claude", buildPrompt)
	cmd.Dir = appPath
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
} 