# Build stage
FROM python:3.11-slim-bullseye AS build-env

# Install system dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev gcc && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv

# Activate virtual environment
ENV PATH="/opt/venv/bin:$PATH"

# Set workdir
WORKDIR /app

# Copy key files
COPY tasks.py requirements.txt ./

RUN pip install --no-cache-dir -r requirements.txt

# Run stage
FROM python:3.11-slim-bullseye

# Retain libpq5 as it is required by psycopg2
RUN apt-get update && \
    apt-get install -y libpq5 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy virtual environment from build stage
COPY --from=build-env /opt/venv /opt/venv

# Set environment variables to use the venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app

# Define environment variable if needed (optional)
# ENV NAME World

ARG DATABASE_URL
ARG REDIS_URL

# Run your script when the container launches
CMD ["celery", "--app=tasks", "worker", "-l", "INFO"]
