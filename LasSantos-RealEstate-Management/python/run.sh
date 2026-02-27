#!/bin/bash

# Los Santos Builders - Quick Start Script
echo "=========================================="
echo "Los Santos Builders - Python Application"
echo "=========================================="

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
echo -e "${GREEN}Activating virtual environment...${NC}"
source venv/bin/activate

# Install/Update dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
pip install -q -r requirements.txt

echo ""
echo "=========================================="
echo "Starting Los Santos Builders Applications"
echo "=========================================="
echo -e "${GREEN}✓ Flask API Server (http://localhost:5000)${NC}"
echo -e "${GREEN}✓ Dash Dashboard (http://localhost:8050)${NC}"
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down applications...${NC}"
    kill $API_PID 2>/dev/null
    kill $DASH_PID 2>/dev/null
    echo -e "${GREEN}Done!${NC}"
    exit 0
}

# Setup signal handlers
trap cleanup SIGINT SIGTERM

# Start Flask API in background
python api.py &
API_PID=$!
echo -e "${GREEN}✓ Flask API started (PID: $API_PID)${NC}"

# Small delay to ensure API starts
sleep 2

# Start Dash Dashboard in background
python app.py &
DASH_PID=$!
echo -e "${GREEN}✓ Dash Dashboard started (PID: $DASH_PID)${NC}"

echo ""
echo "=========================================="
echo "Applications are running!"
echo "=========================================="
echo ""
echo "Available URLs:"
echo -e "  Flask API:      ${GREEN}http://localhost:5000${NC}"
echo -e "  Dash Dashboard: ${GREEN}http://localhost:8050${NC}"
echo ""
echo "Press Ctrl+C to stop all applications"
echo ""

# Wait for background processes
wait $API_PID 2>/dev/null
wait $DASH_PID 2>/dev/null
