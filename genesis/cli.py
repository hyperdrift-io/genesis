import argparse
from pathlib import Path
from genesis.analyzer import PromptAnalyzer
from genesis.generator.app import AppGenerator

def main():
    """Main entry point for Genesis CLI"""
    parser = argparse.ArgumentParser(description="Generate web applications from descriptions")
    parser.add_argument("name", help="Name of the application")
    parser.add_argument("--description", "-d", help="Description of the application")
    parser.add_argument("--functionality", "-f", help="Detailed functionality description")
    parser.add_argument("--output", "-o", help="Output directory", default=".")
    args = parser.parse_args()
    app_name = args.name.lower().replace(' ', '-')
    description = args.description
    if not description:
        description = input("Describe your application: ")
    functionality = args.functionality
    if not functionality:
        print("\nDescribe the functionality in more detail.")
        print("Include relationships between entities (e.g., 'users have many posts', 'posts belong to users')")
        print("Mention specific features like filtering, tagging, ratings, publishing workflow, etc.")
        functionality = input("\nDetailed functionality: ")
    full_description = f"{description} {functionality}"
    print(f"Creating application '{app_name}' with description: {description}")
    print(f"Implementing functionality: {functionality}")
    analyzer = PromptAnalyzer()
    spec = analyzer.analyze(full_description)
    spec['name'] = app_name
    spec['description'] = description
    output_dir = Path(args.output) / app_name
    generator = AppGenerator(spec, output_dir)
    generator.generate()
    print(f"\nApplication generated successfully at: {output_dir}")
    print("\nTo get started:")
    print(f"  cd {app_name}")
    print("  pnpm install")
    print("  pnpm dev")

if __name__ == "__main__":
    main()
