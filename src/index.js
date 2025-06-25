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

    console.log();
    console.log(colors.green(`🎉 ${appName} created successfully!`));
    console.log();
    console.log(colors.cyan('Next steps:'));
    console.log(colors.gray(`  cd ${appName}`));
    console.log(colors.gray('  npm run dev'));
    console.log();
    console.log(colors.cyan('Start development with Claude:'));
    console.log(colors.gray(`  claude "Read the README and build this app step by step"`));

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