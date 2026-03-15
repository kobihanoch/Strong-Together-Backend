import json
from config.redis_client import redis_client

VIDEO_ANALYSIS_RESULTS_CHANNEL = "video-analysis:results"

def publish_video_analysis_result(payload: dict):
    redis_client.publish(VIDEO_ANALYSIS_RESULTS_CHANNEL, json.dumps(payload))
