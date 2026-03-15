from fastapi import FastAPI
from routes.video_routes import router

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
