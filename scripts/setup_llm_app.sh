#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Install system dependencies
apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Upgrade pip
pip install --no-cache-dir --upgrade pip

# Install Python dependencies directly
pip install --no-cache-dir streamlit huggingface_hub python-dotenv
