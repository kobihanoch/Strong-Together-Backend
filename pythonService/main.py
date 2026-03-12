from fastapi import FastAPI, UploadFile, File

app = FastAPI()

# Register routes
app.include_router(router)

# Gate endpoints
@app.get("/")
def gate():
  return {"message": "Welcome to Python service!", "status": "ok"}

# Health check for service
@app.get("/health")
def health():
    return {"status": "ok"}
