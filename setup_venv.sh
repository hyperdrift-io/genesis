#!/bin/bash

# Exit on error
set -e

# Choose Python version
PYTHON="python3"
if command -v python3.12 &> /dev/null; then
    PYTHON="python3.12"
elif command -v python3.11 &> /dev/null; then
    PYTHON="python3.11"
elif command -v python3.10 &> /dev/null; then
    PYTHON="python3.10"
elif command -v python3.9 &> /dev/null; then
    PYTHON="python3.9"
elif command -v python3.8 &> /dev/null; then
    PYTHON="python3.8"
fi

# Check Python version
VERSION=$($PYTHON --version)
echo "Using $VERSION"

# Create virtual environment
echo "Creating virtual environment..."
$PYTHON -m venv venv

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install development dependencies
echo "Installing dependencies..."
pip install -r requirements.txt
pip install -e .

echo ""
echo "Virtual environment setup complete!"
echo "To activate the virtual environment, run: source venv/bin/activate"
echo "To deactivate, run: deactivate" 