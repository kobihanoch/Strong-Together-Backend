from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.get("/")
def gate():
  return {"message": "Welcome to Python service!", "status": "ok"}

# Health check for service
@app.get("/health")
def health():
    return {"status": "ok"}