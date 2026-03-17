import json
import logging
from config.redis_client import redis_client

logger = logging.getLogger(__name__)
VIDEO_ANALYSIS_RESULTS_CHANNEL = "video-analysis:results"

def publish_video_analysis_result(payload: dict):
    receivers = redis_client.publish(VIDEO_ANALYSIS_RESULTS_CHANNEL, json.dumps(payload))
    logger.info(f"[Publisher]: Published message to {VIDEO_ANALYSIS_RESULTS_CHANNEL}. Subscribers={receivers}")
