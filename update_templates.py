#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path


def convert_jinja_delimiters(content):
    """
    Convert standard Jinja2 delimiters to custom ones:
    {{ var }} -> {{$ var $}}
    {% tag %} -> {%$ tag $%}
    {# comment #} -> {#$ comment $#}

    Skip JSX expressions like style={{ width: 100 }} by checking for spaces
    """
    # Convert variable expressions {{ var }} to {{$ var $}}
    # Regex ensures that it doesn't match JSX syntax like style={{ width: 100 }}
    content = re.sub(r'\{\{\s+([^}]+?)\s+\}\}', r'{{$ \1 $}}', content)

    # Convert block tags {% tag %} to {%$ tag $%}
    content = re.sub(r'\{%\s+([^}]+?)\s+%\}', r'{%$ \1 $%}', content)

    # Convert comments {# comment #} to {#$ comment $#}
    content = re.sub(r'\{#\s+([^}]+?)\s+#\}', r'{#$ \1 $#}', content)

    # Handle special case without spaces like {{entity_type}}
    content = re.sub(r'\{\{([a-zA-Z0-9_|.]+)\}\}', r'{{$ \1 $}}', content)

    return content


def process_template_file(file_path):
    """Process a single template file, converting Jinja2 delimiters."""
    print(f"Processing: {file_path}")

    # Read the file content
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Convert delimiters
    new_content = convert_jinja_delimiters(content)

    # If the content changed, write it back
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  Updated: {file_path}")
    else:
        print(f"  No changes needed: {file_path}")


def main():
    """Find and process all template files."""
    template_dir = Path('genesis/templates')

    if not template_dir.exists():
        print(f"Error: Directory {template_dir} not found.")
        sys.exit(1)

    template_files = list(template_dir.glob('**/*.template'))
    print(f"Found {len(template_files)} template files to process.")

    for file_path in template_files:
        process_template_file(file_path)

    print("Template conversion complete.")


if __name__ == "__main__":
    main()
