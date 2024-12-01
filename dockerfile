# Use the official Python slim image
FROM python:3.9-slim

# Prevent Python from writing pyc files to disc and enable stdout/stderr flushing
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy the setup script and app.py to the working directory
COPY scripts/setup_llm_app.sh ./
COPY app/app.py ./

# Make the setup script executable and run it to install dependencies
RUN chmod +x setup_llm_app.sh && ./setup_llm_app.sh || echo "Setup failed, continuing without dependencies"

# Expose port 8501 for Streamlit
EXPOSE 8501

# Set the command to run the Streamlit app with CORS and XSRF protections disabled
CMD ["streamlit", "run", "app.py", "--server.port=8501", "--server.address=0.0.0.0", "--server.enableCORS=false", "--server.enableXsrfProtection=false"]

