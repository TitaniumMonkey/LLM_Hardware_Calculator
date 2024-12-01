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
docker run -d --name llm-calculator-container -p 8051:8051 --env-file .env llm-calculator-app

# Health check to confirm that the application has started
echo "Waiting for the container to start..."
sleep 5

if curl -s http://localhost:8051 > /dev/null; then
  echo "Your application has started successfully. Please visit http://127.0.0.1:8051 on your local web browser."
else
  echo "Error: Failed to start the application. Please check the Docker container logs for more details."
  docker logs llm-calculator-container
  exit 1
fi
