#!/usr/bin/env node

import { program } from 'commander';
import { createApp } from '../src/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packagePath = join(__dirname, '..', 'package.json');
const { version } = JSON.parse(readFileSync(packagePath, 'utf8'));

program
  .name('genesis')
  .description('Minimal app generator using Nuxt + AI-driven development')
  .version(version)
  .argument('<app-name>', 'name of the app to create')
  .argument('<description>', 'description of what the app should do')
  .option('-d, --dir <directory>', 'output directory', '.')
  .action(async (appName, description, options) => {
    try {
      await createApp(appName, description, options);
    } catch (error) {
      console.error('Failed to create app:', error.message);
      process.exit(1);
    }
  });

program.parse(); 