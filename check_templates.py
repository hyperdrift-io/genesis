#!/usr/bin/env python3
import re
import glob
import os

def check_templates():
    issues = 0
    found_files = []

    for f in glob.glob('genesis/templates/nextjs/**/*.template', recursive=True):
        with open(f, 'r') as file:
            content = file.read()
            if re.search(r'\{\{[^$]', content) or re.search(r'\{%[^$]', content):
                found_files.append(f)
                issues += 1

    if issues > 0:
        print(f'Found {issues} files with old style delimiters:')
        for f in found_files:
            print(f'- {f}')
    else:
        print('No files with old style delimiters found.')

if __name__ == "__main__":
    check_templates()
