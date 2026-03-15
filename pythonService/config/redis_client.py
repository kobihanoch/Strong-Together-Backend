import json
import redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_USERNAME = os.getenv("REDIS_USERNAME")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")


redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    username=REDIS_USERNAME,
    password=REDIS_PASSWORD,
    decode_responses=True,
)

payload = {
    "jobId": "123",
    "userId": "abc",
    "status": "completed",
    "result": {
        "score": 91,
        "reps": 10
    },
    "error": None
}

redis_client.publish("video-analysis:results", json.dumps(payload))
