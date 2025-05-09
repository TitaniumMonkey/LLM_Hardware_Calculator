# LLM Hardware Calculator

<p align="center">
  <img src="https://i.imgur.com/XRpvvDW.png">
  <img src="https://i.imgur.com/Qslciss.png">
</p>

A modern web application that helps users calculate hardware requirements for running Large Language Models (LLMs) from Hugging Face or manual input. This tool provides accurate VRAM and storage requirements based on model parameters, quantization type, and advanced model settings.

## Features

- 🔍 **Hugging Face Model Fetch**: Enter any Hugging Face model link or identifier to automatically fetch model size, quantization type, and context length using the Hugging Face API (supports private models with your API key).
- 🔑 **Hugging Face API Key Support**: Enter your Hugging Face API key for accurate/private model info fetching.
- ✍️ **Manual Parameter Entry**: Manually enter model size, quantization type, and advanced parameters if the model cannot be fetched or for custom models.
- 🧮 **Advanced Model Settings**: Optionally specify context length, hidden size, number of layers, and batch size for more accurate calculations.
- 💾 **VRAM & Storage Calculator**: Calculates VRAM and storage requirements based on model size, quantization, and advanced settings.
- 🎮 **GPU Compatibility**: Suggests compatible single and multi-GPU (2x, 4x, 8x) solutions, only showing the smallest valid combination for each GPU, and excludes redundant or impossible combos.
- 🚫 **Incompatible GPU List**: Clearly lists GPUs that cannot run the model, after considering all valid single and multi-GPU options.
- 📊 **Visual Feedback**: Clear, modern UI with visual representation of requirements and compatibility.
- 🎨 **Modern UI**: Sleek, dark theme with professional aesthetics.
- ⚡ **Real-time Updates**: Instant calculations and feedback as you enter or change parameters.

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/TitaniumMonkey/LLM_Hardware_Calculator.git
    ```

2. Change Directories:
    ```bash
    cd LLM_Hardware_Calculator
    ```    

3. Install dependencies:
    ```bash
    npm install
    ```

4. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1. Visit the application in your browser.
2. **To fetch from Hugging Face:**  
   - Enter your Hugging Face API key (optional, but required for private or rate-limited models).
   - Enter a Hugging Face model link (e.g., `https://huggingface.co/meta-llama/Llama-2-7b`).
   - The calculator will fetch and display model size, quantization, and context length automatically.
3. **To enter manually:**  
   - Use the "Manual Parameters" section to specify model size, quantization type, and advanced settings.
4. View the calculated hardware requirements:
   - VRAM requirements
   - Storage requirements
   - Compatible single and multi-GPU solutions
   - Incompatible GPUs

## Technical Details

### Built With

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React Icons

### Key Components

- **Model Input**: Handles Hugging Face URL/API key input and model info fetching.
- **Manual Input**: Allows manual entry of all model and quantization parameters.
- **Requirements Display**: Shows calculated hardware requirements.
- **GPU Compatibility**: Lists compatible and incompatible GPUs, including multi-GPU solutions.
- **Calculation Engine**: Processes model information and determines requirements, including advanced options.

### Calculations

The calculator considers several factors:
- Model parameters (size in millions or billions)
- Quantization type (FP16, FP32, INT8, INT4, GPTQ, BF16, etc.)
- Advanced model settings (context length, hidden size, number of layers, batch size)
- Overhead for KV cache and gradients
- Storage requirements with safety margins

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Hugging Face for providing model information and API
- The open-source community for inspiration and resources
- Contributors and users who help improve the calculator

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
