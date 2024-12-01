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
│   ├── requirements.txt      # Python dependencies
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

### 1. Clone the Repository
```bash
git clone https://github.com/TitaniumMonkey/LLM_Hardware_Calculator.git
cd LLM-Hardware-Calculator
```

### 2. Set Up Environment Variables
After cloning the repository, run the following command to enter your Hugging Face API key:
```bash
read -p "Enter your Hugging Face API key: " HUGGING_FACE_TOKEN
echo "HUGGING_FACE_TOKEN=$HUGGING_FACE_TOKEN" > .env
```

### 3. Build and Run the Docker Container

#### Build the Docker Image
```bash
docker build -t llm-calculator-app .
```

#### Run the Container
```bash
docker run -d -p 8051:8051 --env-file .env llm-calculator-app
```

Once the container is running, the application will be available at:
[http://localhost:8051](http://localhost:8051)

---

## Development and Testing

### Set Up Local Development Environment
For development without Docker, install dependencies and run the app locally:
1. Install Python dependencies:
    ```bash
    bash scripts/setup_llm_app.sh
    ```
2. Run the application:
    ```bash
    streamlit run app/app.py
    ```

### Update Python Dependencies
To update or add new dependencies, modify `app/requirements.txt` and then reinstall:
```bash
pip install -r app/requirements.txt
```

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

