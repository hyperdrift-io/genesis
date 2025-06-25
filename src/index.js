import { spawn } from 'child_process';
import { join } from 'path';
import colors from 'picocolors';
import { generateReadme } from './readme-generator.js';
import { generateDevelopmentGuide } from './development-generator.js';
import { writeFileSync } from 'fs';

export async function createApp(appName, description, options) {
  const outputDir = join(options.dir, appName);
  
  console.log(colors.cyan(`🚀 Creating ${appName}...`));
  console.log(colors.gray(`Description: ${description}`));
  console.log();

  try {
    // Step 1: Create Nuxt app
    console.log(colors.yellow('⚡ Creating Nuxt app...'));
    await createNuxtApp(appName, outputDir);
    console.log(colors.green('✓ Nuxt app created'));

    // Step 2: Add Nuxt UI
    console.log(colors.yellow('🎨 Adding Nuxt UI...'));
    await addNuxtUI(outputDir);
    console.log(colors.green('✓ Nuxt UI added'));

    // Step 3: Generate documentation for Claude
    console.log(colors.yellow('📚 Generating AI context...'));
    const readme = generateReadme(appName, description);
    const developmentGuide = generateDevelopmentGuide();
    
    writeFileSync(join(outputDir, 'README.md'), readme);
    writeFileSync(join(outputDir, 'DEVELOPMENT.md'), developmentGuide);
    console.log(colors.green('✓ AI context generated'));

    // Step 4: Install Claude Code if not available
    console.log(colors.yellow('🤖 Checking for Claude Code...'));
    await ensureClaudeCode();
    console.log(colors.green('✓ Claude Code ready'));

    // Step 5: Auto-generate the app with Claude
    console.log(colors.yellow('🧠 Building app with AI...'));
    console.log(colors.gray('This may take a few minutes...'));
    await buildAppWithClaude(outputDir, description);
    console.log(colors.green('✓ App built successfully'));

    console.log();
    console.log(colors.green(`🎉 ${appName} created and built!`));
    console.log();
    console.log(colors.cyan('Your app is ready:'));
    console.log(colors.gray(`  cd ${appName}`));
    console.log(colors.gray('  npm run dev'));
    console.log();
    console.log(colors.cyan('Continue development:'));
    console.log(colors.gray(`  claude "add user authentication"`));
    console.log(colors.gray(`  claude "improve the UI design"`));

  } catch (error) {
    console.error(colors.red('❌ Error creating app:'), error.message);
    throw error;
  }
}

async function createNuxtApp(appName, outputDir) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['nuxi@latest', 'init', appName], {
      stdio: 'inherit',
      cwd: process.cwd()
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Nuxt creation failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function addNuxtUI(outputDir) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['nuxi@latest', 'module', 'add', 'ui'], {
      stdio: 'inherit',
      cwd: outputDir
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Nuxt UI installation failed with code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function ensureClaudeCode() {
  return new Promise((resolve, reject) => {
    // Check if claude-code is installed
    const checkChild = spawn('claude', ['--version'], {
      stdio: 'pipe',
      cwd: process.cwd()
    });

    checkChild.on('close', (code) => {
      if (code === 0) {
        // Already installed
        resolve();
      } else {
        // Install claude-code
        console.log(colors.gray('Installing Claude Code...'));
        const installChild = spawn('npm', ['install', '-g', '@anthropic-ai/claude-code'], {
          stdio: 'inherit',
          cwd: process.cwd()
        });

        installChild.on('close', (installCode) => {
          if (installCode === 0) {
            resolve();
          } else {
            reject(new Error('Failed to install Claude Code'));
          }
        });

        installChild.on('error', reject);
      }
    });

    checkChild.on('error', () => {
      // Command not found, need to install
      console.log(colors.gray('Installing Claude Code...'));
      const installChild = spawn('npm', ['install', '-g', '@anthropic-ai/claude-code'], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      installChild.on('close', (installCode) => {
        if (installCode === 0) {
          resolve();
        } else {
          reject(new Error('Failed to install Claude Code'));
        }
      });

      installChild.on('error', reject);
    });
  });
}

async function buildAppWithClaude(outputDir, description) {
  return new Promise((resolve, reject) => {
    const buildPrompt = `Read the README.md and DEVELOPMENT.md files, then build this ${description}. 

Create:
1. A modern homepage with hero section and proper navigation
2. The main functionality as described in the README
3. Proper page routing and navigation
4. Use Nuxt UI components throughout
5. Add proper styling with Tailwind CSS
6. Make it responsive and accessible

Follow the best practices in DEVELOPMENT.md. Build a complete, working application.`;

    const child = spawn('claude', [buildPrompt], {
      stdio: 'inherit',
      cwd: outputDir
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Claude Code build failed with code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(new Error(`Failed to run Claude Code: ${error.message}`));
    });
  });
} 