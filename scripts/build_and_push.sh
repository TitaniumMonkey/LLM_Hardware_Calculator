#!/bin/bash

# Docker Hub username
DOCKER_USERNAME="titaniummonkey"
IMAGE_NAME="llm-calculator-app"
TAG="latest"

# Build the Docker image
docker build -t "$DOCKER_USERNAME/$IMAGE_NAME:$TAG" .

# Push the Docker image to Docker Hub
docker push "$DOCKER_USERNAME/$IMAGE_NAME:$TAG"
