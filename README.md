# LLM Hardware Calculator

The **LLM Hardware Calculator** is a web application designed to calculate hardware requirements for running large language models (LLMs). It helps users estimate VRAM, storage requirements, and suggests suitable GPU configurations. The application is built with Streamlit and is deployable using Docker for ease of use.

---

## Features

- **GPU Memory Estimation**: Calculates VRAM needed for training or inference based on model parameters.
- **Storage Requirement Estimation**: Computes disk space requirements for different quantization levels.
- **GPU Suggestions**: Provides recommendations for GPU setups based on user inputs.
- **Hugging Face Integration**: Fetches model metadata from Hugging Face via API.

---

## Project Structure

```
LLM-Hardware-Calculator/
├── Dockerfile                # Docker build configuration
├── README.md                 # Project documentation
├── .env                      # Environment variables (e.g., API tokens)
├── .gitignore                # Files and folders to ignore in Git
├── app/                      # Main application code
│   ├── app.py                # Streamlit application
├── scripts/                  # Utility scripts for development and deployment
│   ├── setup_llm_app.sh      # Script to set up local development environment
│   ├── start.sh              # Script to start the Docker container
```

---

## Requirements

- **System**: Docker installed and running.
- **Environment Variables**:
  - `HUGGING_FACE_TOKEN`: An API token for accessing Hugging Face's model metadata.

---

## Getting Started

# LLM Hardware Calculator Setup Guide

### Prerequisites
- Ensure you have Git, Docker, and Bash installed on your system.
- Obtain a Hugging Face API key.

---

### 1. Clone or Update the Repository

Use the following script to clone the repository if it doesn't exist, or update it if it already has been cloned:

#!/bin/bash

# Clone the repository if it doesn't already exist, otherwise update it
if [ ! -d "LLM_Hardware_Calculator" ]; then
  echo "Cloning the repository..."
  git clone https://github.com/TitaniumMonkey/LLM_Hardware_Calculator.git
  cd LLM_Hardware_Calculator
else
  echo "Updating the repository..."
  cd LLM_Hardware_Calculator
  git pull origin main
fi

# Wait for 2 seconds before running the start script
echo "Preparing to run the start script..."
sleep 2

# Run the start script
chmod +x ./start.sh
./start.sh

---

Once the container is running, the application will be available at:
[http://localhost:8051](http://localhost:8051)


---

## Usage Instructions

### Application Workflow
1. Enter model details such as size, context length, and quantization type.
2. The app will calculate:
   - **GPU memory requirements** for training or inference.
   - **Storage requirements** based on model parameters.
   - **Recommended GPU configurations** for the given hardware requirements.
3. Optionally, fetch model metadata directly from Hugging Face by providing the model URL.

---

## Example Inputs and Outputs

### Inputs:
- **Model Size**: 13B
- **Quantization Type**: FP16 (16-bit floating point)
- **Context Length**: 2048 tokens
- **Batch Size**: 4

### Outputs:
- **Estimated VRAM**: 24 GB
- **Recommended Storage**: 250 GB
- **Suggested GPU Configurations**:
  - 2 x NVIDIA RTX 3090
  - 1 x NVIDIA A100

---

## Troubleshooting

### Common Issues
- **Docker Build Fails**: Ensure Docker is installed and running, and the `.env` file exists with the correct API token.
- **App Not Accessible**: Check if the correct port (8051) is exposed or modify the port in the `docker run` command.

---

## Contribution

Contributions are welcome! Fork the repository, make your changes, and submit a pull request. For significant updates, please open an issue to discuss your proposed changes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

