#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Build the Docker image
docker build -t llm-calculator-app .

# Run the Docker container locally, exposing it on port 8051
docker run -d -p 8051:8051 --env-file .env llm-calculator-app
