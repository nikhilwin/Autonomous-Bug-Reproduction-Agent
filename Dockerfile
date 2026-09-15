# Use official Playwright Python image with pre-installed Chromium and dependencies
FROM mcr.microsoft.com/playwright/python:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Install Node.js 18.x for building frontend and running demo target app
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browser binaries
RUN python -m playwright install chromium

# Copy full application code
COPY . .

# Install frontend dependencies and build static assets
RUN cd frontend && npm install && npm run build

# Install demo target app dependencies
RUN cd demo_apps/student_shop && npm install

# Expose Railway PORT
EXPOSE 8000

# Start script: Launch StudentShop target app + FastAPI backend
CMD ["sh", "-c", "cd demo_apps/student_shop && node server.js & python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"]
