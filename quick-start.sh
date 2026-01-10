#!/bin/bash

# Optimize My Resume - Local Development Quick Start
# This script helps you get started quickly with the local Ollama environment

set -e

echo "========================================="
echo "Optimize My Resume - Local Dev Setup"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✅ Node.js $(node --version)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm $(npm --version)${NC}"
fi

# Check Ollama
if ! command -v ollama &> /dev/null; then
    echo -e "${YELLOW}⚠️  Ollama not found${NC}"
    echo "Install Ollama from: https://ollama.ai/download"
    echo ""
    read -p "Do you want to continue without Ollama? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo -e "${GREEN}✅ Ollama $(ollama --version 2>&1 | head -n1)${NC}"

    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama server is running${NC}"

        # List installed models
        MODELS=$(ollama list 2>/dev/null | tail -n +2 | awk '{print $1}' | grep -v "^$" || echo "")
        if [ -z "$MODELS" ]; then
            echo -e "${YELLOW}⚠️  No Ollama models installed${NC}"
            echo ""
            echo "Recommended: Install Llama 3.1"
            read -p "Install llama3.1:8b now? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                echo "Downloading llama3.1:8b (this may take a few minutes)..."
                ollama pull llama3.1:8b
            fi
        else
            echo -e "${GREEN}✅ Installed models:${NC}"
            echo "$MODELS" | while read -r model; do
                echo "   - $model"
            done
        fi
    else
        echo -e "${YELLOW}⚠️  Ollama server is not running${NC}"
        echo "Start it with: ollama serve"
        echo ""
        read -p "Start Ollama server in background? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo "Starting Ollama server..."
            nohup ollama serve > /tmp/ollama.log 2>&1 &
            sleep 2
            if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
                echo -e "${GREEN}✅ Ollama server started${NC}"
            else
                echo -e "${RED}❌ Failed to start Ollama server${NC}"
                echo "Check logs: tail -f /tmp/ollama.log"
            fi
        fi
    fi
fi

echo ""
echo "========================================="
echo "Installing Dependencies"
echo "========================================="
echo ""

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ node_modules already exists${NC}"
    read -p "Reinstall dependencies? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install
    fi
else
    npm install
fi

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Make sure Ollama is running:"
echo "   ${YELLOW}ollama serve${NC}"
echo ""
echo "2. Start the development server:"
echo "   ${GREEN}npm run dev${NC}"
echo ""
echo "3. Open your browser to:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo ""
echo "4. (Optional) Install more models:"
echo "   ${YELLOW}ollama pull mistral${NC}"
echo "   ${YELLOW}ollama pull gemma2:9b${NC}"
echo "   ${YELLOW}ollama pull qwen2.5:7b${NC}"
echo "   ${YELLOW}ollama pull phi3${NC}"
echo ""
echo "For help, see:"
echo "  - README-LOCAL-DEV.md"
echo "  - SETUP-GUIDE.md"
echo "  - docs/MODEL-CONFIGURATION-GUIDE.md"
echo ""
echo "Happy coding! 🚀"
echo ""
