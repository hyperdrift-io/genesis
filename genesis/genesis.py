#!/usr/bin/env python3
import argparse
import os
import re
import json
import shutil
from pathlib import Path
import sys

class Entity:
    def __init__(self, name, entity_type, attributes=None):
        self.name = name
        self.type = entity_type
        self.attributes = attributes or []

    def __repr__(self):
        return f"Entity(name='{self.name}', type='{self.type}')"

class PromptAnalyzer:
    """Analyzer for app descriptions to extract entities and features"""

    def __init__(self):
        self.entity_patterns = [
            (r'user', 'user'),
            (r'product', 'product'),
            (r'post', 'post'),
            (r'comment', 'comment'),
            (r'order', 'order'),
            (r'item', 'item'),
            (r'category', 'category'),
            (r'profile', 'profile'),
            (r'task', 'task'),
            (r'project', 'project'),
        ]

        self.feature_patterns = [
            (r'auth|login|signin|register', 'authentication'),
            (r'admin|dashboard', 'admin_dashboard'),
            (r'payment|checkout', 'payment_processing'),
            (r'search', 'search'),
            (r'notification', 'notifications'),
            (r'messaging|chat', 'messaging'),
            (r'upload|image|photo', 'file_upload'),
            (r'real-time|realtime|live', 'real_time'),
            (r'persist|database|store|save', 'persistence'),
        ]

    def analyze(self, description):
        """Analyze a description to extract entities and features"""
        description = description.lower()

        # Extract entities
        entities = []
        for pattern, entity_type in self.entity_patterns:
            if re.search(pattern, description):
                entities.append(Entity(entity_type, entity_type))

        # Extract features
        features = []
        for pattern, feature in self.feature_patterns:
            if re.search(pattern, description):
                features.append(feature)

        # Default features
        if not any(f == 'authentication' for f in features) and any(e.type == 'user' for e in entities):
            features.append('authentication')

        # Only add persistence if explicitly mentioned or if authentication is needed
        # This supports a local-first approach by default
        persistence_needed = any(f in ['persistence'] for f in features)

        # If we need auth, we'll need persistence too, but otherwise keep it local-first
        if 'authentication' in features and not persistence_needed:
            features.append('persistence')

        # Determine tech stack and backend requirements
        tech_stack = 'nextjs'
        backend = False
        requires_supabase = False

        # Only use Supabase if we explicitly need persistence features
        if any(f in ['authentication', 'persistence', 'file_upload', 'real_time'] for f in features):
            requires_supabase = True
            backend = True

        return {
            'name': 'app',
            'description': description,
            'entities': [{'name': e.name, 'type': e.type} for e in entities],
            'features': features,
            'tech_stack': tech_stack,
            'backend': backend,
            'requires_supabase': requires_supabase,
            'local_first': not requires_supabase
        }

class AppGenerator:
    """Generate application files from a specification"""

    def __init__(self, spec, output_dir):
        self.spec = spec
        self.output_dir = Path(output_dir)
        self.template_dir = Path(__file__).parent / 'templates'

    def generate(self):
        """Generate the application files"""
        # Create the output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Choose template based on tech stack
        tech_stack = self.spec.get('tech_stack', 'nextjs')
        template_path = self.template_dir / tech_stack

        if not template_path.exists():
            print(f"Template '{tech_stack}' not found, using 'nextjs'")
            template_path = self.template_dir / 'nextjs'

        if not template_path.exists():
            print(f"No templates found at {template_path}")
            print("Please make sure the templates directory exists and contains template files")
            sys.exit(1)

        # Copy template base files (non-template files)
        base_dir = template_path / 'base'
        if base_dir.exists():
            self._copy_template_base(base_dir, self.output_dir)

        # Create genesis.json with the spec
        with open(self.output_dir / 'genesis.json', 'w') as f:
            json.dump(self.spec, f, indent=2)

        # Process the root templates first
        self._process_root_templates(template_path)

        # Generate entity files
        for entity in self.spec.get('entities', []):
            self._generate_entity(entity.get('name', 'item'), template_path)

        # Generate Supabase configuration if required
        if self.spec.get('requires_supabase', False):
            self._generate_supabase_config(template_path)

        print(f"\nApplication generated successfully at: {self.output_dir}")

    def _get_base_template_vars(self):
        """Get the base template variables for substitution"""
        app_name = self.spec.get('name', 'Genesis App')

        # Format features for README
        features_list = ""
        for feature in self.spec.get('features', []):
            features_list += f"- {feature.replace('_', ' ').title()}\n"

        # Generate entity links for home page
        entity_links = ""
        nav_links = ""

        for entity in self.spec.get('entities', []):
            entity_name = entity.get('name', 'item')
            capitalized_name = entity_name.capitalize()
            plural_name = f"{entity_name}s" if not entity_name.endswith('s') else entity_name

            # Add entity link for homepage
            entity_links += f"""
            <Link href="/{plural_name}" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{capitalized_name}s</h3>
              <p className="text-gray-600">Manage your {entity_name}s</p>
            </Link>
            """

            # Add navigation link
            nav_links += f"""
              <Link
                href="/{plural_name}"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {capitalized_name}s
              </Link>
            """

        # If no entities, provide default content
        if not entity_links:
            entity_links = """
            <div className="block p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Genesis</h3>
              <p className="text-gray-600">Your application scaffolding is ready!</p>
            </div>
            """

        # Check if Supabase is required
        requires_supabase = self.spec.get('requires_supabase', False)
        supabase_config = """// Supabase not required for this application""" if not requires_supabase else """
        // Supabase configuration
        export const supabaseConfig = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          tableName: '{{table_name}}s',
        };
        """

        return {
            "{{app_name}}": app_name,
            "{{app_title}}": app_name.title(),
            "{{description}}": self.spec.get('description', 'An app generated by Genesis'),
            "{{features_list}}": features_list,
            "{{entity_links}}": entity_links,
            "{{nav_links}}": nav_links,
            "{{mobile_nav_links}}": nav_links.replace('className="text-gray-600', 'className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600'),
            "{{supabase_config}}": supabase_config,
            "{{requires_supabase}}": str(requires_supabase).lower()
        }

    def _process_root_templates(self, template_path):
        """Process root project templates"""
        # Get base template variables
        template_vars = self._get_base_template_vars()

        # Root templates to process
        root_templates = [
            ('app/layout.tsx.template', 'src/app/layout.tsx'),
            ('app/page.tsx.template', 'src/app/page.tsx'),
            ('app/globals.css.template', 'src/app/globals.css'),
            ('components/Navbar.tsx.template', 'src/components/Navbar.tsx'),
            ('tailwind.config.js.template', 'tailwind.config.js'),
            ('postcss.config.js.template', 'postcss.config.js'),
            ('README.md.template', 'README.md'),
            ('lib/utils.ts.template', 'src/lib/utils.ts'),
            ('components/ui/button.tsx.template', 'src/components/ui/button.tsx'),
            ('components/ui/card.tsx.template', 'src/components/ui/card.tsx'),
            ('components/ui/input.tsx.template', 'src/components/ui/input.tsx'),
            ('components/ui/label.tsx.template', 'src/components/ui/label.tsx'),
            ('components/ui/textarea.tsx.template', 'src/components/ui/textarea.tsx'),
            ('.cursorrules.json.template', '.cursorrules.json'),
            ('COMPONENTS.md.template', 'COMPONENTS.md'),
            ('dev-guide.md.template', 'DEV-GUIDE.md')
        ]

        # Process each template
        for template_rel_path, output_rel_path in root_templates:
            self._process_template(
                template_path / template_rel_path,
                self.output_dir / output_rel_path,
                template_vars
            )

        # Generate package.json
        package_json_path = self.output_dir / 'package.json'
        if not package_json_path.exists():
            # Create a basic package.json if it doesn't exist
            package_json = {
                "name": self.spec.get('name', 'genesis-app'),
                "version": "0.1.0",
                "private": True,
                "scripts": {
                    "dev": "next dev",
                    "build": "next build",
                    "start": "next start",
                    "lint": "next lint"
                },
                "dependencies": {
                    "next": "^15.0.0",
                    "react": "^18.3.1",
                    "react-dom": "^18.3.1",
                    "zustand": "^4.5.0",
                    "lucide-react": "^0.312.0",
                    "class-variance-authority": "^0.7.0",
                    "clsx": "^2.1.0",
                    "tailwind-merge": "^2.2.0",
                    "tailwindcss-animate": "^1.0.7",
                    "@radix-ui/react-slot": "^1.0.2",
                    "@radix-ui/react-label": "^2.0.2"
                },
                "devDependencies": {
                    "typescript": "^5.3.3",
                    "@types/react": "^18.2.48",
                    "@types/node": "^20.11.0",
                    "@types/react-dom": "^18.2.18",
                    "tailwindcss": "^4.0.0-alpha.2",
                    "autoprefixer": "^10.4.16"
                },
                "engines": {
                    "node": ">=18.0.0",
                    "pnpm": ">=8.0.0"
                },
                "packageManager": "pnpm@8.15.0"
            }

            # Add Supabase dependencies if required
            if self.spec.get('requires_supabase', False):
                package_json['dependencies']['@supabase/supabase-js'] = "^2.39.3"

            with open(package_json_path, 'w') as f:
                json.dump(package_json, f, indent=2)
        else:
            # Update existing package.json
            with open(package_json_path, 'r') as f:
                package_json = json.load(f)

            package_json['name'] = self.spec.get('name', 'genesis-app')
            package_json['description'] = self.spec.get('description', 'An app generated by Genesis')

            # Ensure dependencies are using latest versions
            if 'dependencies' not in package_json:
                package_json['dependencies'] = {}

            package_json['dependencies'].update({
                'next': '^15.0.0',
                'react': '^18.3.1',
                'react-dom': '^18.3.1',
                'zustand': '^4.5.0',
                'lucide-react': '^0.312.0',
                'class-variance-authority': '^0.7.0',
                'clsx': '^2.1.0',
                'tailwind-merge': '^2.2.0',
                'tailwindcss-animate': '^1.0.7',
                '@radix-ui/react-slot': '^1.0.2',
                '@radix-ui/react-label': '^2.0.2'
            })

            # Add Supabase dependencies if required
            if self.spec.get('requires_supabase', False):
                package_json['dependencies']['@supabase/supabase-js'] = "^2.39.3"

            if 'devDependencies' not in package_json:
                package_json['devDependencies'] = {}

            package_json['devDependencies'].update({
                'tailwindcss': '^4.0.0-alpha.2',
                'autoprefixer': '^10.4.16'
            })

            # Add pnpm configuration
            package_json['engines'] = {
                'node': '>=18.0.0',
                'pnpm': '>=8.0.0'
            }
            package_json['packageManager'] = 'pnpm@8.15.0'

            with open(package_json_path, 'w') as f:
                json.dump(package_json, f, indent=2)

        # Create or update components.json for shadcn/ui
        components_json_path = self.output_dir / 'components.json'
        if not components_json_path.exists():
            components_json = {
                "$schema": "https://ui.shadcn.com/schema.json",
                "style": "default",
                "rsc": True,
                "tsx": True,
                "tailwind": {
                  "config": "tailwind.config.js",
                  "css": "src/app/globals.css",
                  "baseColor": "slate",
                  "cssVariables": True
                },
                "aliases": {
                  "components": "@/components",
                  "utils": "@/lib/utils"
                }
            }

            with open(components_json_path, 'w') as f:
                json.dump(components_json, f, indent=2)

        # Create tsconfig.json if it doesn't exist
        tsconfig_path = self.output_dir / 'tsconfig.json'
        if not tsconfig_path.exists():
            self._process_template(
                template_path / 'tsconfig.json.template',
                tsconfig_path,
                template_vars
            )

    def _copy_template_base(self, src_dir, dest_dir):
        """Copy non-template files from template base directory"""
        for item in src_dir.iterdir():
            dest_path = dest_dir / item.name

            # Skip certain files and directories
            if item.name in ['.git', 'node_modules', '.next', 'dist', 'build']:
                continue

            if item.is_dir():
                dest_path.mkdir(exist_ok=True)
                self._copy_template_base(item, dest_path)
            else:
                shutil.copy2(item, dest_path)

    def _generate_entity(self, entity_name, template_path):
        """Generate files from templates for an entity"""
        # Find entity in spec and setup variables
        entity_type = entity_name.capitalize()  # Default to capitalized name
        for entity in self.spec.get('entities', []):
            if entity.get('name') == entity_name:
                entity_type = entity.get('type', entity_name).capitalize()
                break

        capitalized_name = entity_name.capitalize()
        plural_name = f"{entity_name}s" if not entity_name.endswith('s') else entity_name

        print(f"Generating entity: {entity_name}")

        # Define template variables for substitution
        template_vars = {
            "{{entity_type}}": capitalized_name,
            "{{entity_name}}": entity_name,
            "{{plural_name}}": plural_name,
            "{{app_name}}": self.spec.get('name', 'Genesis App'),
            "{{app_title}}": self.spec.get('name', 'Genesis App').title(),
            "{{requires_supabase}}": str(self.spec.get('requires_supabase', False)).lower(),
            "{{table_name}}": entity_name.lower(),
            "{{cursor_rule_ui}}": """
// CURSOR_RULE: UI Components Guide
// - Use shadcn/ui components for consistent UI (Card, Button, Input, etc.)
// - Import Lucide icons for visual elements
// - Use the cn() utility for class name merging
// - Follow the design system with CSS variables in globals.css
// - Keep responsive design in mind (use Tailwind responsive classes)
// - Add dark mode support where appropriate
"""
        }

        # Map of template paths to output paths
        template_mappings = {
            'types/entity.ts.template': f'src/types/{entity_name}.ts',
            'components/EntityCard.tsx.template': f'src/components/{capitalized_name}Card.tsx',
            'components/EntityForm.tsx.template': f'src/components/{capitalized_name}Form.tsx',
            'services/entityService.ts.template': f'src/services/{entity_name}Service.ts',
            'store/entityStore.ts.template': f'src/store/{entity_name}Store.ts',
            'app/entity/page.tsx.template': f'src/app/{plural_name}/page.tsx',
            'app/entity/layout.tsx.template': f'src/app/{plural_name}/layout.tsx',
            'app/entity/new/page.tsx.template': f'src/app/{plural_name}/new/page.tsx',
            'app/entity/{id}/page.tsx.template': f'src/app/{plural_name}/[id]/page.tsx',
            'app/entity/{id}/edit/page.tsx.template': f'src/app/{plural_name}/[id]/edit/page.tsx',
            'app/api/entity/route.ts.template': f'src/app/api/{plural_name}/route.ts',
            'app/api/entity/{id}/route.ts.template': f'src/app/api/{plural_name}/[id]/route.ts'
        }

        # Add Supabase specific templates if required
        if self.spec.get('requires_supabase', False):
            template_mappings['services/supabaseEntityService.ts.template'] = f'src/services/{entity_name}SupabaseService.ts'

        # Process each template with variable substitution
        for template_rel_path, output_rel_path in template_mappings.items():
            template_full_path = template_path / template_rel_path
            output_full_path = self.output_dir / output_rel_path

            self._process_template(template_full_path, output_full_path, template_vars)

    def _generate_supabase_config(self, template_path):
        """Generate Supabase configuration files"""
        print("Generating Supabase configuration...")

        # Create .env.local template with Supabase variables
        env_path = self.output_dir / '.env.local.example'
        with open(env_path, 'w') as f:
            f.write("""# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
""")

        # Create Supabase client utility
        template_vars = self._get_base_template_vars()

        supabase_client_path = template_path / 'utils/supabase.ts.template'
        output_client_path = self.output_dir / 'src/utils/supabase.ts'

        self._process_template(supabase_client_path, output_client_path, template_vars)

        # Update README with Supabase setup instructions
        readme_path = self.output_dir / 'README.md'
        if readme_path.exists():
            with open(readme_path, 'r') as f:
                content = f.read()

            # Add Supabase setup section if not already present
            if 'Supabase Setup' not in content:
                supabase_setup = """
## Supabase Setup

This project uses Supabase for backend services. To set up:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env.local` file from `.env.local.example`
4. Update the Supabase URL and anon key in `.env.local`
5. Set up your database tables according to the entity models in this project
"""
                content = content.replace('## Project Structure', f"{supabase_setup}\n\n## Project Structure")

                with open(readme_path, 'w') as f:
                    f.write(content)

    def _process_template(self, template_path, output_path, template_vars):
        """Process a single template file with variable substitution"""
        if not template_path.exists():
            print(f"Template file not found: {template_path}")
            return

        # Create parent directories if they don't exist
        output_path.parent.mkdir(parents=True, exist_ok=True)

        try:
            # Read template content
            with open(template_path, 'r') as f:
                content = f.read()

            # Process conditionals ({{#if condition}} ... {{else}} ... {{/if}})
            # This is a simple implementation of conditional processing
            for condition_match in re.finditer(r'{{#if\s+([^}]+)}}\s*\n(.*?)\s*{{else}}\s*\n(.*?)\s*{{\/if}}',
                                           content, re.DOTALL):
                condition, if_block, else_block = condition_match.groups()

                # Evaluate the condition
                condition_value = False
                if '==' in condition:
                    left, right = condition.split('==')
                    left = left.strip()
                    right = right.strip(' "\'')

                    # Get the actual value from template_vars
                    if left in template_vars:
                        left_value = template_vars[left]
                        condition_value = (left_value == right)

                # Replace with the appropriate block
                replacement = if_block if condition_value else else_block
                content = content.replace(condition_match.group(0), replacement)

            # Replace all template variables
            for var, value in template_vars.items():
                content = content.replace(var, value)

            # Write to output file
            with open(output_path, 'w') as f:
                f.write(content)

        except Exception as e:
            print(f"Error processing template {template_path}: {str(e)}")

def main():
    """Main entry point for Genesis CLI"""
    parser = argparse.ArgumentParser(description="Generate web applications from descriptions")

    # Main command
    parser.add_argument("name", help="Name of the application")
    parser.add_argument("--description", "-d", help="Description of the application")
    parser.add_argument("--output", "-o", help="Output directory", default=".")

    args = parser.parse_args()

    # Get the app name and normalize it
    app_name = args.name.lower().replace(' ', '-')

    # Get description from args or prompt the user
    description = args.description
    if not description:
        description = input("Describe your application: ")

    print(f"Creating application '{app_name}' with description: {description}")

    # Analyze the description
    analyzer = PromptAnalyzer()
    spec = analyzer.analyze(description)
    spec['name'] = app_name

    # Set the output directory
    output_dir = Path(args.output) / app_name

    # Generate the application
    generator = AppGenerator(spec, output_dir)
    generator.generate()

    print(f"\nApplication generated successfully at: {output_dir}")
    print("\nTo get started:")
    print(f"  cd {app_name}")
    print("  pnpm install")
    print("  pnpm dev")

if __name__ == "__main__":
    main()
