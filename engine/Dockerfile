FROM python:3.11-slim
WORKDIR /app
COPY mock_engine.py .
RUN pip install fastapi uvicorn
# Install g++ so the mock engine can compile C++ code
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*
EXPOSE 8080
CMD ["python", "mock_engine.py"]
