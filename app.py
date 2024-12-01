import streamlit as st
from collections import defaultdict
import requests
import os
from dotenv import load_dotenv
import math  # Import math for rounding

# Load environment variables from .env file
load_dotenv()
HUGGING_FACE_TOKEN = os.getenv("HUGGING_FACE_TOKEN")

# Function to estimate GPU memory requirement
def calculate_vram_requirement(model_size_billion, quant_type, context_length, batch_size, num_layers, hidden_size, mode, efficient_attention=False):
    bytes_per_unit = {
        'FP32 (32-bit floating point)': 4,
        'FP16 (16-bit floating point)': 2,
        'FP8 (8-bit floating point)': 1,
        'INT4 (4-bit integer)': 0.5,
    }.get(quant_type, 4)  # Default to FP32 if unknown

    total_parameters = model_size_billion * 1e9
    params_memory_gb = (total_parameters * bytes_per_unit) / 1e9

    head_dim = 64
    num_heads = hidden_size // head_dim

    qkv_memory = 3 * batch_size * context_length * hidden_size * bytes_per_unit / 1e9  # GB
    output_memory = batch_size * context_length * hidden_size * bytes_per_unit / 1e9  # GB

    if efficient_attention:
        attn_scores_memory = 0
    else:
        attn_scores_memory = batch_size * num_heads * (context_length ** 2) * bytes_per_unit / 1e9  # GB

    activation_memory_per_layer = qkv_memory + attn_scores_memory + output_memory  # GB

    if mode == 'Training':
        total_activation_memory = activation_memory_per_layer * num_layers
        total_vram_gb = (params_memory_gb * 2) + total_activation_memory
    else:
        total_activation_memory = activation_memory_per_layer
        total_vram_gb = params_memory_gb + total_activation_memory

    return total_vram_gb

# Function to calculate storage requirements
def calculate_storage_requirement(model_size_billion, quant_type, context_length):
    storage_per_billion_params = {
        'FP32 (32-bit floating point)': 8.0,  # Including overhead and extra space
        'FP16 (16-bit floating point)': 4.0,
        'FP8 (8-bit floating point)': 2.0,
        'INT4 (4-bit integer)': 1.0,
    }.get(quant_type, 8.0)  # Default to FP32 storage if unknown

    model_storage_gb = model_size_billion * storage_per_billion_params  # Corrected line

    operational_overhead_per_token = 0.001  # GB per token
    operational_storage_gb = context_length * operational_overhead_per_token

    additional_storage_gb = 100  # Fixed overhead

    total_storage_gb = model_storage_gb + operational_storage_gb + additional_storage_gb

    return total_storage_gb

# Function to suggest GPU configurations
def suggest_gpu(total_memory_gb):
    gpus = [
        {'name': 'NVIDIA H100', 'memory': 80, 'max_gpus': 8},
        {'name': 'NVIDIA A100', 'memory': 80, 'max_gpus': 8},
        {'name': 'NVIDIA A6000', 'memory': 48, 'max_gpus': 10},
        {'name': 'NVIDIA A40', 'memory': 48, 'max_gpus': 10},
        {'name': 'NVIDIA L40', 'memory': 48, 'max_gpus': 8},
        {'name': 'NVIDIA L40S', 'memory': 48, 'max_gpus': 8},
        {'name': 'NVIDIA RTX 6000 Ada', 'memory': 48, 'max_gpus': 8},
        {'name': 'NVIDIA RTX 4090', 'memory': 24, 'max_gpus': 8},
        {'name': 'NVIDIA RTX 3090', 'memory': 24, 'max_gpus': 8},
        {'name': 'NVIDIA RTX A5000', 'memory': 24, 'max_gpus': 8},
        {'name': 'NVIDIA L4', 'memory': 24, 'max_gpus': 8},
        {'name': 'NVIDIA RTX 4000', 'memory': 16, 'max_gpus': 8},
        {'name': 'NVIDIA A4000', 'memory': 16, 'max_gpus': 8},
    ]

    grouped_gpus = defaultdict(list)
    for gpu in gpus:
        grouped_gpus[gpu['memory']].append(gpu)

    possible_setups = []
    for mem_size in sorted(grouped_gpus.keys(), reverse=True):
        gpu_list = grouped_gpus[mem_size]
        max_gpus = max(gpu['max_gpus'] for gpu in gpu_list)
        for num_gpus in range(1, max_gpus + 1):
            total_gpu_memory = mem_size * num_gpus
            if total_gpu_memory >= total_memory_gb:
                compatible_gpus = [gpu['name'] for gpu in gpu_list if num_gpus <= gpu['max_gpus']]
                if compatible_gpus:
                    config = f"{num_gpus} x {mem_size}GB GPUs"
                    gpu_names = ', '.join(compatible_gpus)
                    setup = {
                        'config': config,
                        'gpu_names': gpu_names
                    }
                    possible_setups.append(setup)
                break  # Found the minimal number of GPUs needed for this memory size
    return possible_setups

# Function to extract model metadata via API
def fetch_model_metadata_via_api(model_id):
    # Removed error handling and logging as per user's request
    # Ensure correct formatting of model_id for API URL
    if model_id.startswith("http"):
        model_id = '/'.join(model_id.split('/')[-2:])

    # Construct the API URL
    url = f"https://huggingface.co/api/models/{model_id}"
    headers = {"Authorization": f"Bearer {HUGGING_FACE_TOKEN}"}
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    model_data = response.json()

    # Extract parameter size from safetensors if available
    params_size_billion = None
    quant_type = "UNKNOWN"

    # Extract parameter size
    if "safetensors" in model_data:
        parameters = model_data["safetensors"].get("parameters", {})
        if parameters:
            param_key = list(parameters.keys())[0]  # Use the first available precision key
            params_size = parameters[param_key]
            params_size_billion = math.ceil(params_size / 1e9)  # Convert to billions and round up to integer
    # Extract quantization type from safetensors parameters if quant_type is still UNKNOWN
    if quant_type == "UNKNOWN" and "safetensors" in model_data:
        parameters = model_data["safetensors"].get("parameters", {})
        if parameters:
            quant_type_key = list(parameters.keys())[0].upper()
            quant_type_mapping = {
                'FP32': 'FP32 (32-bit floating point)',
                'FP16': 'FP16 (16-bit floating point)',
                'BF16': 'FP16 (16-bit floating point)',  # Mapping BF16 to FP16 for consistency
                'FP8': 'FP8 (8-bit floating point)',
                'INT4': 'INT4 (4-bit integer)',
            }
            quant_type = quant_type_mapping.get(quant_type_key, 'UNKNOWN')

    # If still UNKNOWN, attempt to extract from config
    if quant_type == "UNKNOWN" and "config" in model_data and isinstance(model_data["config"], dict):
        config = model_data["config"]
        if 'dtype' in config:
            quant_type = config['dtype']
        elif 'torch_dtype' in config:
            quant_type = config['torch_dtype']
        elif 'precision' in config:
            quant_type = config['precision']
        elif 'precision_config' in config and isinstance(config['precision_config'], dict):
            quant_type = config['precision_config'].get('dtype', 'UNKNOWN')

        # Convert to a standardized format
        if isinstance(quant_type, str):
            quant_type_lower = quant_type.lower()
            if quant_type_lower in ['float32', 'torch.float32', 'fp32']:
                quant_type = 'FP32 (32-bit floating point)'
            elif quant_type_lower in ['float16', 'torch.float16', 'bfloat16', 'torch.bfloat16', 'bf16']:
                quant_type = 'FP16 (16-bit floating point)'
            elif quant_type_lower in ['fp8', 'float8']:
                quant_type = 'FP8 (8-bit floating point)'
            elif quant_type_lower in ['int4', 'int4']:
                quant_type = 'INT4 (4-bit integer)'
            else:
                quant_type = 'UNKNOWN'
        else:
            quant_type = 'UNKNOWN'

    return params_size_billion, quant_type

def main():
    # Initialize session state for fetched parameters and model size selection
    if 'params_size' not in st.session_state:
        st.session_state.params_size = None
    if 'quant_type' not in st.session_state:
        st.session_state.quant_type = "UNKNOWN"
    if 'model_size_selection' not in st.session_state:
        st.session_state.model_size_selection = '8B'  # Default selection
    if 'custom_model_size' not in st.session_state:
        st.session_state.custom_model_size = None

    # Inject custom CSS to increase font size and style the button
    st.markdown(
        """
        <style>
        /* Increase the base font size */
        html, body, [class*="css"]  {
            font-size: 1.2rem;  /* Increase font size by 20% */
        }
        /* Style the Calculate Requirements button to be blue */
        .stButton > button {
            background-color: #1E90FF !important;  /* DodgerBlue */
            color: white !important;
        }
        .stButton > button:hover {
            background-color: #1C86EE !important;
            color: white !important;
        }
        .stButton > button:active {
            background-color: #1874CD !important;
            color: white !important;
        }
        /* Optional: Further styling can be added here if needed */
        </style>
        """,
        unsafe_allow_html=True
    )

    st.title("LLM Hardware Requirements Calculator")

    # Model Sizes
    model_sizes = {
        '8B': 8,
        '13B': 13,
        '30B': 30,
        '70B': 70,
        '123B': 123,
        '175B': 175,
        '350B': 350,
        '405B': 405,
        'Custom': 'Custom',
    }

    # Mode Selection
    mode = st.selectbox("Select Mode", ['Inference', 'Training'])

    # Hugging Face Model Metadata Input
    huggingface_url = st.text_input(
        "Enter Hugging Face Model URL or Identifier",
        value="",
        help="Enter the URL or identifier of a model on Hugging Face (e.g., 'sentence-transformers/all-mpnet-base-v2' or 'https://huggingface.co/sentence-transformers/all-mpnet-base-v2')."
    )

    # Fetch model metadata if URL is provided
    if huggingface_url:
        model_id = '/'.join(huggingface_url.split('/')[-2:]) if huggingface_url.startswith("http") else huggingface_url
        try:
            params_size, quant_type = fetch_model_metadata_via_api(model_id)
            if params_size and quant_type != "UNKNOWN":
                st.session_state.params_size = params_size
                st.session_state.quant_type = quant_type
                st.session_state.model_size_selection = 'Custom'  # Automatically select 'Custom'
                st.session_state.custom_model_size = params_size  # Set custom size
                st.success(f"Fetched Model Parameters Size: {params_size}B")
                st.success(f"Quantization Type: {quant_type}")
            elif params_size and quant_type == "UNKNOWN":
                st.session_state.params_size = params_size
                st.session_state.quant_type = quant_type
                st.session_state.model_size_selection = 'Custom'  # Automatically select 'Custom'
                st.session_state.custom_model_size = params_size  # Set custom size
                st.success(f"Fetched Model Parameters Size: {params_size}B")
                st.warning("Quantization Type could not be determined automatically. Please select it manually below.")
            else:
                st.warning("Unable to fetch model metadata. Default quantization options will be shown.")
                st.session_state.params_size = None
                st.session_state.quant_type = "UNKNOWN"
        except Exception as e:
            st.error(f"Error fetching model metadata: {e}")
            st.session_state.params_size = None
            st.session_state.quant_type = "UNKNOWN"

    # Determine quantization types based on quant_type
    quantization_types = [
        'FP32 (32-bit floating point)',
        'FP16 (16-bit floating point)',
        'FP8 (8-bit floating point)',
        'INT4 (4-bit integer)',
    ]

    if st.session_state.quant_type != "UNKNOWN":
        if st.session_state.quant_type == 'FP16 (16-bit floating point)':
            quantization_types = ['FP16 (16-bit floating point)']
        elif st.session_state.quant_type == 'FP32 (32-bit floating point)':
            quantization_types = ['FP32 (32-bit floating point)', 'FP16 (16-bit floating point)']
        elif st.session_state.quant_type == 'FP8 (8-bit floating point)':
            quantization_types = ['FP8 (8-bit floating point)']
        elif st.session_state.quant_type == 'INT4 (4-bit integer)':
            quantization_types = ['INT4 (4-bit integer)']
        # Add more conditions if necessary based on possible quantization types

    # Select Model Size with dynamic default selection
    options = list(model_sizes.keys())

    model_size_option = st.selectbox(
        "Select Model Size",
        options,
        key='model_size_selection'
    )

    # Handle 'Custom' Model Size with a single input box
    if model_size_option == 'Custom':
        # Display the number input without the 'B' suffix
        col1, col2 = st.columns([3, 1])
        with col1:
            # Number input for custom model size (integers only)
            model_size_billion = st.number_input(
                "Enter Model Size (in billions of parameters)",
                min_value=1,
                step=1,
                value=st.session_state.custom_model_size if st.session_state.custom_model_size else 123,
                format="%d",
                key='custom_model_size_input'
            )
            # Update the session state with the rounded integer
            st.session_state.custom_model_size = model_size_billion
        with col2:
            st.write("")  # Placeholder to align with selectbox
    else:
        model_size_billion = model_sizes[model_size_option]

    # **Manual Quantization Type Selection as a Fallback**
    if st.session_state.quant_type == "UNKNOWN" and huggingface_url:
        manual_quant_type = st.selectbox(
            "Select Quantization Type",
            ['FP32 (32-bit floating point)', 'FP16 (16-bit floating point)', 'FP8 (8-bit floating point)', 'INT4 (4-bit integer)'],
            key='manual_quant_type_select'
        )
        quant_type = manual_quant_type
    else:
        # Quantization Type Selection based on automatic extraction
        quant_type = st.selectbox("Select Quantization Type", quantization_types)

    # Advanced Options
    with st.expander("Advanced Options"):
        context_length = st.number_input(
            "Enter Context Length (number of tokens)",
            min_value=1,
            value=2048,
            step=1
        )
        num_layers = st.number_input(
            "Enter Number of Layers",
            min_value=1,
            value=24,  # Default value for a medium-sized model
            step=1
        )
        hidden_size = st.number_input(
            "Enter Hidden Size",
            min_value=1,
            value=4096,  # Default value for a medium-sized model
            step=1
        )
        batch_size = st.number_input(
            "Enter Batch Size",
            min_value=1,
            value=1,
            step=1
        )
        efficient_attention = st.checkbox(
            "Use Efficient Attention Mechanism (Recommended for long context lengths)",
            value=True
        )

    # Layout for Calculate Button at the Bottom
    calculate_button = st.button("Calculate Requirements")

    # Calculate Requirements Button Functionality
    if calculate_button:
        # Title: Estimated Hardware Requirements
        st.markdown("<h2>Estimated Hardware Requirements</h2>", unsafe_allow_html=True)

        try:
            total_vram_gb = calculate_vram_requirement(
                model_size_billion=model_size_billion,
                quant_type=quant_type,
                context_length=context_length,
                batch_size=batch_size,
                num_layers=num_layers,
                hidden_size=hidden_size,
                mode=mode,
                efficient_attention=efficient_attention
            )
            total_storage_gb = calculate_storage_requirement(model_size_billion, quant_type, context_length)
            possible_setups = suggest_gpu(total_vram_gb)

            # Display Quantization Type
            st.markdown(f"### Quantization Type: {quant_type}")

            # Display Total GPU Memory Required
            st.markdown(
                f"""
                <p><strong>Total GPU Memory Required:</strong> <span style='font-size:1.3em;'>{total_vram_gb:.2f} GB</span></p>
                """,
                unsafe_allow_html=True
            )

            # Display Recommended Storage Space
            st.markdown(
                f"""
                <p><strong>Recommended Storage Space:</strong> <span style='font-size:1.3em;'>{total_storage_gb:.2f} GB</span></p>
                """,
                unsafe_allow_html=True
            )

            # Display Possible GPU Configurations
            if possible_setups:
                st.write("**Possible GPU Configurations:**")
                for setup in possible_setups:
                    st.write(f"- **{setup['config']}** ({setup['gpu_names']})")
            else:
                st.write("**Suggested GPU Configuration:** No current configuration available for this model size at this quantization level.")
            st.write("---")
        except Exception as e:
            st.error(f"An error occurred during calculation: {e}")

if __name__ == "__main__":
    main()
