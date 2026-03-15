import logging
from fastapi import FastAPI
from routes.video_routes import router
from config.redis_client import check_redis_connection

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Register routes
app.include_router(router)

# Startup logs
@app.on_event("startup")
def startup_event():
  check_redis_connection()
  logging.info("[Publisher]: Analyze video publisher is ready")

# Gate endpoints
@app.get("/")
def gate():
  return {"message": "Welcome to Python service!", "status": "ok"}

# Health check for service
@app.get("/health")
def health():
    return {"status": "ok"}
