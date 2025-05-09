# LLM Hardware Calculator

A modern web application that helps users calculate hardware requirements for running Large Language Models (LLMs) with an added feature that pulls the Hugging Face Token Card(if availible) from a hugging face URL to prefill the parameters. This tool provides accurate VRAM and storage requirements based on model parameters and quantization type.


## Features

- 🔍 **Model Analysis**: Input any Hugging Face model link to analyze hardware requirements
- 💾 **VRAM Calculator**: Accurate VRAM requirements based on model size and quantization
- 💽 **Storage Estimation**: Calculate required disk space for model deployment
- 🎮 **GPU Compatibility**: Check compatibility with common GPU models
- 📊 **Visual Feedback**: Clear visual representation of resource requirements
- 🎯 **Real-time Updates**: Instant calculations and feedback
- 🎨 **Modern UI**: Sleek, dark theme with professional aesthetics

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

1. Visit the application in your browser
2. Enter a Hugging Face model link (e.g., https://huggingface.co/meta-llama/Llama-2-7b)
3. View the calculated hardware requirements:
   - VRAM requirements
   - Storage requirements
   - Compatible GPUs
   - Recommended hardware

## Technical Details

### Built With

- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React Icons

### Key Components

- **Model Input**: Handles user input and validation
- **Requirements Display**: Shows calculated hardware requirements
- **GPU Compatibility**: Lists compatible and incompatible GPUs
- **Calculation Engine**: Processes model information and determines requirements

### Calculations

The calculator considers several factors:
- Model parameters (size in billions)
- Quantization type (FP16, INT8, GPTQ, etc.)
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

- Hugging Face for providing model information
- The open-source community for inspiration and resources
- Contributors and users who help improve the calculator

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
