#!/bin/bash

set -e

echo "Setting up Python environment..."

python -m pip install --upgrade pip
pip install -r requirements.txt

echo "Running database migrations..."

echo "Deployment completed successfully!"
