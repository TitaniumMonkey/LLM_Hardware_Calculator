
### Updated `start.sh` Script
```bash
#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Ask for the Hugging Face API key and create the .env file
read -p "Enter your Hugging Face API key: " HUGGING_FACE_TOKEN
echo "HUGGING_FACE_TOKEN=$HUGGING_FACE_TOKEN" > .env

# Add .env to .gitignore to prevent it from being committed
if ! grep -qxF '.env' .gitignore; then
  echo '.env' >> .gitignore
fi

# Build the Docker image
docker build -t llm-calculator-app .

# Run the Docker container locally, exposing it on port 8051
docker run -d -p 8051:8051 --env-file .env llm-calculator-app

# Health check to confirm that the application has started
sleep 5  # Wait for the container to start
if curl -s http://localhost:8051 > /dev/null; then
  echo "Your Application has started. Please visit 127.0.0.1:8051 on your local web browser."
else
  echo "Failed to start the application. Please check the Docker container logs for more details."
fi
