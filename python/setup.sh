#!/bin/bash

# Los Santos Builders - Python Dashboard Setup Script
echo "=========================================="
echo "Los Santos Builders - Python Setup"
echo "=========================================="

# Check if Python is installed
echo "✓ Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "✗ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version 2>&1 | awk '{print $2}')
echo "  Python version: $PYTHON_VERSION"

# Create virtual environment
echo ""
echo "✓ Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "✓ Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "✓ Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "✓ Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "To activate the virtual environment, run:"
echo "  source venv/bin/activate"
echo ""
echo "To run the Dash dashboard, run:"
echo "  python app.py"
echo ""
echo "To run the Flask API, run:"
echo "  python api.py"
echo ""
echo "Dashboard will be available at: http://localhost:8050"
echo "API will be available at: http://localhost:5000"
echo "=========================================="
