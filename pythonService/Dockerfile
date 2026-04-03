FROM python:3.11.9-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir \
    python-dotenv \
    sentry-sdk \
    redis \
    boto3 \
    mediapipe==0.10.9 \
    opencv-python-headless \
    numpy

COPY pythonService /app

CMD ["python", "main.py"]
