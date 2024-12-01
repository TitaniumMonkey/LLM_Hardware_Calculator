# LLM Hardware Requirements Calculator

A Streamlit application designed to help you estimate the hardware requirements (GPU and storage) for running or training large language models (LLMs). This app also provides GPU configuration suggestions based on model parameters and allows users to input a Hugging Face model URL to prefetch parameter sizes and quantization type.

## Features
- **Model Metadata Fetching**: Fetch parameter sizes and quantization type from Hugging Face models using their API.
- **GPU Memory Requirement Estimation**: Calculate VRAM requirements for various quantization types and contexts.
- **Storage Requirement Estimation**: Estimate the required storage based on model size and parameters.
- **Suggested GPU Configurations**: Provides possible GPU setups that can fulfill the VRAM requirements.
- **Custom Inputs**: Allows the user to manually input custom model sizes, batch sizes, context lengths, etc.

## Setup and Installation
### Prerequisites
- Docker installed on your system.
- Python 3.9 or higher.
- [Hugging Face API Token](https://huggingface.co/settings/tokens).

### Clone the Repository
To get started, clone the repository:
```bash
git clone https://github.com/TitaniumMonkey/LLM_Hardware_Calculator.git
cd LLM_Hardware_Calculator/
```

### Environment Variables
This application requires a Hugging Face token to fetch model metadata. You need to create a `.env` file in the root directory:

```
HUGGING_FACE_TOKEN=your_hugging_face_api_token_here
```

### Docker Setup
To build and run the Docker container:
1. Build the Docker image:
   ```bash
   docker build -t llm_calc .
   ```
2. Run the container:
   ```bash
   docker run -d -p 8501:8501 llm_calc:latest
   ```

After running the container, visit the app at [http://127.0.0.1:8501](http://127.0.0.1:8501).

## Folder Structure
```
LLM_Hardware_Calculator/
├── .env               # Environment variables (not to be committed)
├── .gitignore         # Ignore files such as .env, __pycache__, etc.
├── LICENSE            # License information
├── app.py             # Main Streamlit application file
├── dockerfile         # Dockerfile to containerize the application
├── setup_llm_app.sh   # Shell script to install dependencies
├── README.md          # Documentation for the project
```

## Usage
1. **Select Mode**: Choose either **Training** or **Inference** mode.
2. **Enter Model Identifier**: Enter the URL or identifier of a Hugging Face model to fetch its parameters.
3. **Select Model Size**: Choose from a range of pre-defined sizes or enter a custom value.
4. **Advanced Options**: Enter optional advanced parameters like context length, batch size, etc.
5. **Calculate Requirements**: Click the **Calculate Requirements** button to see the VRAM and storage requirements, along with suggested GPU configurations.


## Built With
- **Streamlit**: For the user interface.
- **Python**: Core programming language used.
- **Hugging Face API**: Fetching model metadata.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- [Hugging Face](https://huggingface.co/) for providing APIs to fetch model metadata.
- [Streamlit](https://streamlit.io/) for their easy-to-use UI framework.

## Contact
For issues, please raise a GitHub issue or reach out to the repository owner.

