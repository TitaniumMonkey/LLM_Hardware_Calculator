#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Ensure Docker is installed and running
if ! command -v docker &> /dev/null; then
  echo "Error: Docker is not installed. Please install Docker and try again."
  exit 1
fi

if ! systemctl is-active --quiet docker; then
  echo "Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

# Ask for the Hugging Face API key and create the .env file
read -p "Enter your Hugging Face API key: " HUGGING_FACE_TOKEN
if [ -z "$HUGGING_FACE_TOKEN" ]; then
  echo "Error: Hugging Face API key cannot be empty."
  exit 1
fi

echo "HUGGING_FACE_TOKEN=$HUGGING_FACE_TOKEN" > .env

# Add .env to .gitignore to prevent it from being committed
if ! grep -qxF '.env' .gitignore; then
  echo '.env' >> .gitignore
fi

# Build the Docker image
docker build -t llm-calculator-app .

# Run the Docker container locally, exposing it on port 8051
docker run -p 8051:8051 llm-calculator-app
