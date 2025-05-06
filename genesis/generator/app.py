import json
import shutil
from pathlib import Path
import os

from jinja2 import Environment, FileSystemLoader, select_autoescape


class AppGenerator:
    """Generate application files from a specification"""

    def __init__(self, spec, output_dir):
        self.spec = spec
        self.output_dir = Path(output_dir)
        self.template_dir = Path(__file__).parent.parent / "templates"
        self.env = Environment(
            loader=FileSystemLoader(str(self.template_dir)),
            autoescape=select_autoescape(["html", "tsx", "js", "ts"]),
            variable_start_string='{{$',  # Use custom delimiters to avoid conflicts with JSX
            variable_end_string='$}}',
            block_start_string='{%$',
            block_end_string='$%}',
            comment_start_string='{#$',
            comment_end_string='$#}',
        )

    def render_template(self, template_path, output_path, context):
        # Use os.path.normpath to ensure consistent path format across platforms
        template_rel = str(template_path.relative_to(self.template_dir))
        template_rel = os.path.normpath(template_rel).replace(os.sep, '/')

        print(f"Rendering template: {template_rel} to {output_path}")

        # Try to load the template directly
        try:
            template = self.env.get_template(template_rel)
        except Exception as e:
            print(f"Error loading template '{template_rel}': {str(e)}")

            # Check if template path contains special characters that might need handling
            if '[' in template_rel or '{' in template_rel or '%' in template_rel:
                # Try alternative path formats
                alt_paths = [
                    template_rel.replace('[id]', '{id}'),
                    template_rel.replace('{id}', '[id]'),
                    template_rel.replace('%7Bid%7D', '[id]'),
                    template_rel.replace('[id]', '%7Bid%7D')
                ]

                for alt_path in alt_paths:
                    try:
                        print(f"Trying alternative template path: {alt_path}")
                        template = self.env.get_template(alt_path)
                        print(f"Successfully loaded alternative template: {alt_path}")
                        break
                    except Exception:
                        continue
                else:
                    raise Exception(f"Could not load template '{template_rel}' or any alternatives")
            else:
                raise

        # Try to render the template with the context
        try:
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, "w") as f:
                f.write(template.render(**context))
            print(f"Successfully rendered {template_rel}")
        except Exception as e:
            print(f"Error rendering template '{template_rel}': {str(e)}")
            print(f"Template context keys: {list(context.keys())}")
            raise

    def generate(self):
        self.output_dir.mkdir(parents=True, exist_ok=True)
        tech_stack = self.spec.get("tech_stack", "nextjs")
        template_path = self.template_dir / tech_stack
        if not template_path.exists():
            print(f"Template '{tech_stack}' not found, using 'nextjs'")
            template_path = self.template_dir / "nextjs"
        if not template_path.exists():
            print(f"No templates found at {template_path}")
            print("Please make sure the templates directory exists and contains template files")
            import sys

            sys.exit(1)
        base_dir = template_path / "base"
        if base_dir.exists():
            self._copy_template_base(base_dir, self.output_dir)
        with open(self.output_dir / "genesis.json", "w") as f:
            json.dump(self.spec, f, indent=2)
        self._process_root_templates(template_path)
        for entity in self.spec.get("entities", []):
            self._generate_entity(entity.get("name", "item"), template_path)
        if self.spec.get("requires_supabase", False):
            self._generate_supabase_config(template_path)
        print(f"\nApplication generated successfully at: {self.output_dir}")

    def _get_base_template_vars(self):
        app_name = self.spec.get("name", "Genesis App")
        features_list = ""
        for feature in self.spec.get("features", []):
            features_list += f"- {feature.replace('_', ' ').title()}\n"
        entity_links = ""
        nav_links = ""
        for entity in self.spec.get("entities", []):
            entity_name = entity.get("name", "item")
            capitalized_name = entity_name.capitalize()
            if entity_name.endswith("y"):
                plural_name = f"{entity_name[:-1]}ies"
            elif entity_name.endswith("s"):
                plural_name = entity_name
            else:
                plural_name = f"{entity_name}s"
            entity_links += f"""
            <Link href="/{plural_name}" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{capitalized_name}s</h3>
              <p className="text-gray-600">Manage your {entity_name}s</p>
            </Link>
            """
            nav_links += f"""
              <Link
                href="/{plural_name}"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {capitalized_name}s
              </Link>
            """
        if not entity_links:
            entity_links = """
            <div className="block p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Genesis</h3>
              <p className="text-gray-600">Your application scaffolding is ready!</p>
            </div>
            """
        requires_supabase = self.spec.get("requires_supabase", False)
        supabase_config = (
            "// Supabase not required for this application"
            if not requires_supabase
            else """
        // Supabase configuration
        export const supabaseConfig = {
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
          anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          tableName: '{{table_name}}s',
        };
        """
        )
        return {
            "app_name": app_name,
            "app_title": app_name.title(),
            "description": self.spec.get("description", "An app generated by Genesis"),
            "features_list": features_list,
            "entity_links": entity_links,
            "nav_links": nav_links,
            "mobile_nav_links": nav_links.replace(
                'className="text-gray-600',
                'className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-600',
            ),
            "supabase_config": supabase_config,
            "requires_supabase": str(requires_supabase).lower(),
            "local_first": not requires_supabase,
        }

    def _process_root_templates(self, template_path):
        template_vars = self._get_base_template_vars()
        root_templates = [
            ("app/layout.tsx.template", "src/app/layout.tsx"),
            ("app/page.tsx.template", "src/app/page.tsx"),
            ("app/globals.css.template", "src/app/globals.css"),
            ("components/Navbar.tsx.template", "src/components/Navbar.tsx"),
            ("postcss.config.js.template", "postcss.config.js"),
            ("tailwind.config.js.template", "tailwind.config.js"),
            ("README.md.template", "README.md"),
            ("lib/utils.ts.template", "src/lib/utils.ts"),
            ("components/ui/button.tsx.template", "src/components/ui/button.tsx"),
            ("components/ui/card.tsx.template", "src/components/ui/card.tsx"),
            ("components/ui/input.tsx.template", "src/components/ui/input.tsx"),
            ("components/ui/label.tsx.template", "src/components/ui/label.tsx"),
            ("components/ui/textarea.tsx.template", "src/components/ui/textarea.tsx"),
            (".cursorrules.json.template", ".cursorrules.json"),
            ("COMPONENTS.md.template", "docs/rules/COMPONENTS.md"),
            ("dev-guide.md.template", "DEV-GUIDE.md"),
        ]
        for template_rel_path, output_rel_path in root_templates:
            # Normalize path separators
            template_rel_path = template_rel_path.replace('\\', '/')

            # Create full template path
            full_template_path = template_path / template_rel_path

            # Check if template exists before attempting to render
            if not full_template_path.exists():
                print(f"Warning: Template {full_template_path} not found, skipping.")
                continue

            self.render_template(
                full_template_path,
                self.output_dir / output_rel_path,
                template_vars,
            )
        package_json_path = self.output_dir / "package.json"
        if not package_json_path.exists():
            package_json = {
                "name": self.spec.get("name", "genesis-app"),
                "version": "0.1.0",
                "private": True,
                "scripts": {
                    "dev": "next dev",
                    "build": "next build",
                    "start": "next start",
                    "lint": "next lint",
                },
                "dependencies": {
                    "next": "^15.0.0",
                    "react": "^18.3.1",
                    "react-dom": "^18.3.1",
                    "zustand": "^4.5.0",
                    "lucide-react": "^0.312.0",
                    "class-variance-authority": "^0.7.0",
                    "clsx": "^2.1.0",
                },
                "devDependencies": {
                    "typescript": "^5.3.3",
                    "@types/react": "^18.2.48",
                    "@types/node": "^20.11.0",
                    "@types/react-dom": "^18.2.18",
                    "tailwindcss": "^3.4.1",
                    "autoprefixer": "^10.4.14",
                    "postcss": "^8.4.24",
                    "tailwindcss-animate": "^1.0.7",
                },
                "engines": {"node": ">=18.0.0"},
                "packageManager": "pnpm@8.15.0",
            }
            if self.spec.get("requires_supabase", False):
                package_json["dependencies"]["@supabase/supabase-js"] = "^2.39.3"
            with open(package_json_path, "w") as f:
                json.dump(package_json, f, indent=2)
        else:
            with open(package_json_path, "r") as f:
                package_json = json.load(f)
            package_json["name"] = self.spec.get("name", "genesis-app")
            package_json["description"] = self.spec.get("description", "An app generated by Genesis")
            if "dependencies" not in package_json:
                package_json["dependencies"] = {}
            package_json["dependencies"].update(
                {
                    "next": "^15.0.0",
                    "react": "^18.3.1",
                    "react-dom": "^18.3.1",
                    "zustand": "^4.5.0",
                    "lucide-react": "^0.312.0",
                    "class-variance-authority": "^0.7.0",
                    "clsx": "^2.1.0",
                }
            )
            if self.spec.get("requires_supabase", False):
                package_json["dependencies"]["@supabase/supabase-js"] = "^2.39.3"
            if "devDependencies" not in package_json:
                package_json["devDependencies"] = {}
            package_json["devDependencies"].update(
                {
                    "tailwindcss": "^3.4.1",
                    "autoprefixer": "^10.4.14",
                    "postcss": "^8.4.24",
                    "tailwindcss-animate": "^1.0.7",
                }
            )
            # Remove workspace field if it exists
            if "workspace" in package_json:
                del package_json["workspace"]

            package_json["engines"] = {"node": ">=18.0.0"}
            package_json["packageManager"] = "pnpm@8.15.0"
            with open(package_json_path, "w") as f:
                json.dump(package_json, f, indent=2)
        components_json_path = self.output_dir / "components.json"
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
                    "cssVariables": True,
                },
                "aliases": {"components": "@/components", "utils": "@/lib/utils"},
            }
            with open(components_json_path, "w") as f:
                json.dump(components_json, f, indent=2)
        tsconfig_path = self.output_dir / "tsconfig.json"
        if not tsconfig_path.exists():
            self.render_template(template_path / "tsconfig.json.template", tsconfig_path, template_vars)

    def _copy_template_base(self, src_dir, dest_dir):
        for item in src_dir.iterdir():
            dest_path = dest_dir / item.name
            if item.name in [".git", "node_modules", ".next", "dist", "build"]:
                continue
            if item.is_dir():
                dest_path.mkdir(exist_ok=True)
                self._copy_template_base(item, dest_path)
            else:
                shutil.copy2(item, dest_path)

    def _generate_entity(self, entity_name, template_path):
        entity_type = entity_name.capitalize()
        for entity in self.spec.get("entities", []):
            if entity.get("name") == entity_name:
                entity_type = entity.get("type", entity_name).capitalize()
                break
        capitalized_name = entity_name.capitalize()
        if entity_name.endswith("y"):
            plural_name = f"{entity_name[:-1]}ies"
        elif entity_name.endswith("s"):
            plural_name = entity_name
        else:
            plural_name = f"{entity_name}s"
        entity_functionality = self.spec.get("functionality", [])
        entity_relationships = []
        for rel in self.spec.get("relationships", []):
            if rel.get("entity1") == entity_name or rel.get("entity2") == entity_name:
                entity_relationships.append(rel)
        print(f"Generating entity: {entity_name}")
        template_vars = {
            "entity_name": entity_name,
            "entity_type": entity_type,
            "capitalized_name": capitalized_name,
            "plural_name": plural_name,
            "requires_supabase": str(self.spec.get("requires_supabase", False)).lower(),
        }
        template_vars.update(self._get_base_template_vars())

        # Helper function to try multiple template path variations for templates with special characters
        def try_template_paths(base_path, template_name):
            # Priority ordered list of path formats to try
            path_formats = [
                f"{template_name}",
                f"{template_name.replace('[id]', '{id}')}",
                f"{template_name.replace('{id}', '[id]')}",
                f"{template_name.replace('[id]', '%7Bid%7D')}",
            ]

            for path_format in path_formats:
                template_file = base_path / path_format
                if template_file.exists():
                    return template_file

            # If no variation exists, return the original path
            return base_path / template_name

        types_dir = self.output_dir / "src" / "types"
        types_dir.mkdir(parents=True, exist_ok=True)
        self.render_template(
            template_path / "types" / "entity.ts.template",
            types_dir / f"{entity_name}.ts",
            template_vars,
        )
        components_dir = self.output_dir / "src" / "components"
        components_dir.mkdir(parents=True, exist_ok=True)
        self.render_template(
            template_path / "components" / "EntityCard.tsx.template",
            components_dir / f"{capitalized_name}Card.tsx",
            template_vars,
        )
        self.render_template(
            template_path / "components" / "EntityForm.tsx.template",
            components_dir / f"{capitalized_name}Form.tsx",
            template_vars,
        )
        services_dir = self.output_dir / "src" / "services"
        services_dir.mkdir(parents=True, exist_ok=True)
        self.render_template(
            template_path / "services" / "entityService.ts.template",
            services_dir / f"{entity_name}Service.ts",
            template_vars,
        )
        if self.spec.get("requires_supabase", False):
            utils_dir = self.output_dir / "src" / "utils"
            utils_dir.mkdir(parents=True, exist_ok=True)
            self.render_template(
                template_path / "services" / "entitySupabaseService.ts.template",
                services_dir / f"{entity_name}SupabaseService.ts",
                template_vars,
            )
            supabase_util_template = template_path / "utils" / "supabase.ts.template"
            supabase_util_output = utils_dir / "supabase.ts"
            if not supabase_util_output.exists():
                self.render_template(supabase_util_template, supabase_util_output, template_vars)
        store_dir = self.output_dir / "src" / "store"
        store_dir.mkdir(parents=True, exist_ok=True)
        self.render_template(
            template_path / "store" / "entityStore.ts.template",
            store_dir / f"{entity_name}Store.ts",
            template_vars,
        )
        app_dir = self.output_dir / "src" / "app"
        entity_page_dir = app_dir / plural_name
        entity_page_dir.mkdir(parents=True, exist_ok=True)
        self.render_template(
            template_path / "app" / "entities" / "page.tsx.template",
            entity_page_dir / "page.tsx",
            template_vars,
        )

        # For paths with special characters like [id], try multiple formats
        entity_id_dir = entity_page_dir / "[id]"
        entity_id_dir.mkdir(parents=True, exist_ok=True)

        # Use try_template_paths for templates with special characters
        id_template_path = try_template_paths(
            template_path / "app" / "entities",
            "[id]/page.tsx.template"
        )
        self.render_template(
            id_template_path,
            entity_id_dir / "page.tsx",
            template_vars,
        )

        new_dir = entity_page_dir / "new"
        new_dir.mkdir(parents=True, exist_ok=True)
        self.render_template(
            template_path / "app" / "entities" / "new" / "page.tsx.template",
            new_dir / "page.tsx",
            template_vars,
        )

        edit_dir = entity_id_dir / "edit"
        edit_dir.mkdir(parents=True, exist_ok=True)

        # Use try_template_paths for edit template with special characters
        edit_template_path = try_template_paths(
            template_path / "app" / "entities",
            "[id]/edit/page.tsx.template"
        )
        self.render_template(
            edit_template_path,
            edit_dir / "page.tsx",
            template_vars,
        )

        if entity_relationships:
            self._generate_relationship_code(entity_name, entity_relationships)
        print(f"Generated files for entity '{entity_name}' using Next.js App Router")

    def _generate_relationship_code(self, entity_name, relationships):
        import_code = ""
        field_code = ""
        relationship_code = ""
        for rel in relationships:
            rel_type = rel.get("type")
            entity1 = rel.get("entity1")
            entity2 = rel.get("entity2")
            if entity1 != entity_name and entity2 != entity_name:
                continue
            if entity1 == entity_name:
                related_entity = entity2.capitalize()
                import_code += f"import {{ {related_entity} }} from '@/types/{entity2}';\n"
            else:
                related_entity = entity1.capitalize()
                import_code += f"import {{ {related_entity} }} from '@/types/{entity1}';\n"
            if rel_type == "belongs_to":
                if entity1 == entity_name:
                    field_code += f"  {entity2}Id: string;\n"
                    field_code += f"  {entity2}?: {entity2.capitalize()};\n"
                    relationship_code += f"  // This {entity1} belongs to a {entity2}\n"
            elif rel_type == "has_many":
                if entity1 == entity_name:
                    field_code += f"  {entity2}s?: {entity2.capitalize()}[];\n"
                    relationship_code += f"  // This {entity1} has many {entity2}s\n"
            elif rel_type == "has_one":
                if entity1 == entity_name:
                    field_code += f"  {entity2}Id?: string;\n"
                    field_code += f"  {entity2}?: {entity2.capitalize()};\n"
                    relationship_code += f"  // This {entity1} has one {entity2}\n"
            elif rel_type == "many_to_many":
                if entity1 == entity_name:
                    field_code += f"  {entity2}s?: {entity2.capitalize()}[];\n"
                    relationship_code += f"  // This {entity1} has a many-to-many relationship with {entity2}s\n"
                else:
                    field_code += f"  {entity1}s?: {entity1.capitalize()}[];\n"
                    relationship_code += f"  // This {entity_name} has a many-to-many relationship with {entity1}s\n"
        return {
            "import_code": import_code,
            "field_code": field_code,
            "relationship_code": relationship_code,
        }

    def _generate_supabase_config(self, template_path):
        if not self.spec.get("requires_supabase", False):
            return
        utils_dir = self.output_dir / "src" / "utils"
        utils_dir.mkdir(parents=True, exist_ok=True)

        # Path to the supabase util template
        supabase_util_template = template_path / "utils" / "supabase.ts.template"

        # Check if template exists
        if not supabase_util_template.exists():
            print(f"Warning: Supabase template not found at {supabase_util_template}, trying alternative formats")
            alt_templates = [
                template_path / "utils" / "supabase.ts.template",
                template_path / "utils" / "supabase.template.ts",
                template_path / "utils" / "supabase.template"
            ]

            for alt_template in alt_templates:
                if alt_template.exists():
                    supabase_util_template = alt_template
                    print(f"Using alternative template: {alt_template}")
                    break
            else:
                print(f"No supabase template found, skipping supabase config generation")
                return

        supabase_util_output = utils_dir / "supabase.ts"
        if not supabase_util_output.exists():
            self.render_template(supabase_util_template, supabase_util_output, self._get_base_template_vars())
        env_file = self.output_dir / ".env.local"
        if not env_file.exists():
            with open(env_file, "w") as f:
                f.write(
                    """# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Add your Supabase URL and anon key from your project settings
# https://app.supabase.io/project/_/settings/api
"""
                )
        env_example = self.output_dir / ".env.example"
        with open(env_example, "w") as f:
            f.write(
                """# Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
"""
            )
        readme_path = self.output_dir / "README.md"
        if readme_path.exists():
            with open(readme_path, "r") as f:
                readme_content = f.read()
            if "Supabase Setup" not in readme_content:
                with open(readme_path, "a") as f:
                    f.write(
                        """
## Supabase Setup

This application is configured to use Supabase for data storage. To set it up:

1. Create a Supabase account and project at [supabase.com](https://supabase.io)
2. Copy your project URL and anon key from the API settings
3. Add these to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Start your development server with `pnpm dev`

Note: The application includes a fallback to localStorage when Supabase credentials are not provided, which is useful for development.
"""
                    )
