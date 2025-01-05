# Use an official Python runtime as the base image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm

# Copy the application code into the container
COPY . .

# Build the React app
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Move back to the main directory
WORKDIR /app

# Expose the port the app runs on
EXPOSE 5000

# Define the command to run the application
CMD ["python", "app/app.py"]

