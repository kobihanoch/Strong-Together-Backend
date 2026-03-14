import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose
from utils.calculation_utils import *
import math
from statistics import median

def _side_score(landmarks, side_prefix):
  idx = mp_pose.PoseLandmark
  if side_prefix == "LEFT":
    side_points = [
      landmarks[idx.LEFT_HIP.value],
      landmarks[idx.LEFT_KNEE.value],
      landmarks[idx.LEFT_ANKLE.value],
      landmarks[idx.LEFT_SHOULDER.value],
    ]
    other_points = [
      landmarks[idx.RIGHT_HIP.value],
      landmarks[idx.RIGHT_KNEE.value],
      landmarks[idx.RIGHT_ANKLE.value],
      landmarks[idx.RIGHT_SHOULDER.value],
    ]
  else:
    side_points = [
      landmarks[idx.RIGHT_HIP.value],
      landmarks[idx.RIGHT_KNEE.value],
      landmarks[idx.RIGHT_ANKLE.value],
      landmarks[idx.RIGHT_SHOULDER.value],
    ]
    other_points = [
      landmarks[idx.LEFT_HIP.value],
      landmarks[idx.LEFT_KNEE.value],
      landmarks[idx.LEFT_ANKLE.value],
      landmarks[idx.LEFT_SHOULDER.value],
    ]

  visibility_score = sum(p.visibility for p in side_points) - sum(p.visibility for p in other_points)
  depth_score = sum(-p.z for p in side_points) - sum(-p.z for p in other_points)
  return (visibility_score * 0.7) + (depth_score * 0.3)

def get_squat_dominant_side(landmarks):
  left_score = _side_score(landmarks, "LEFT")
  right_score = _side_score(landmarks, "RIGHT")
  if left_score > right_score + 0.02:
    return "LEFT"
  if right_score > left_score + 0.02:
    return "RIGHT"
  left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
  right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
  if left_knee.z < right_knee.z:
    return "LEFT"
  return "RIGHT"

def get_squat_dominant_side_landmarks(dominant_side, landmarks):
  def extract(lm_idx):
    return {"x": landmarks[lm_idx].x, "y": landmarks[lm_idx].y, "v": landmarks[lm_idx].visibility}

  if dominant_side == "LEFT":
    indices = [mp_pose.PoseLandmark.LEFT_HIP, mp_pose.PoseLandmark.LEFT_KNEE, mp_pose.PoseLandmark.LEFT_ANKLE, 
    mp_pose.PoseLandmark.LEFT_SHOULDER, mp_pose.PoseLandmark.LEFT_HEEL, mp_pose.PoseLandmark.LEFT_FOOT_INDEX]
  else:
    indices = [mp_pose.PoseLandmark.RIGHT_HIP, mp_pose.PoseLandmark.RIGHT_KNEE, mp_pose.PoseLandmark.RIGHT_ANKLE, 
    mp_pose.PoseLandmark.RIGHT_SHOULDER, mp_pose.PoseLandmark.RIGHT_HEEL, mp_pose.PoseLandmark.RIGHT_FOOT_INDEX]
  return [extract(idx.value) for idx in indices]

def get_current_squat_state(knee_angle, stage, rep_count, down_threshold, up_threshold, current_rep, all_reps):
  if knee_angle < down_threshold and stage == "UP":
    stage = "DOWN"
  if knee_angle > up_threshold and stage == "DOWN":
    stage = "UP"
    rep_count += 1
    all_reps.append(list(current_rep))
    current_rep.clear()
  return [stage, rep_count]

def analyze_squat_rep(rep_frames, camera_angle):
  MIN_VISIBILITY = 0.75
  ALPHA = 0.3
  MIN_REP_FRAMES = 8
  MIN_VALID_FRAMES = 6

  if not rep_frames or len(rep_frames) < MIN_REP_FRAMES:
    return {"error": "Rep duration too short for reliable analysis"}

  valid_frames = [
    f for f in rep_frames
    if (
      f["knee"]["v"] > MIN_VISIBILITY and
      f["hip"]["v"] > MIN_VISIBILITY and
      f["shoulder"]["v"] > MIN_VISIBILITY
    )
  ]

  if len(valid_frames) < MIN_VALID_FRAMES:
    return {"error": "Low visibility during critical phases of the lift"}

  frame_weights = [
    (f["knee"]["v"] + f["hip"]["v"] + f["shoulder"]["v"]) / 3
    for f in valid_frames
  ]

  smoothed_angles = []
  last_angle = valid_frames[0]["knee_angle"]
  for i, f in enumerate(valid_frames):
    alpha = ALPHA * (0.75 + (frame_weights[i] * 0.5))
    current_angle = (alpha * f["knee_angle"]) + ((1 - alpha) * last_angle)
    smoothed_angles.append(current_angle)
    last_angle = current_angle

  sorted_smoothed = sorted(smoothed_angles)
  bottom_sample = sorted_smoothed[:max(3, int(len(sorted_smoothed) * 0.2))]
  true_bottom_angle = median(bottom_sample)
  display_depth = 180 - true_bottom_angle
  depth_band = median(smoothed_angles) - true_bottom_angle

  if true_bottom_angle < 80:
    status = "Deep (ATG)"
  elif true_bottom_angle < 100:
    status = "Good (Parallel)"
  elif true_bottom_angle < 120:
    status = "Partial"
  else:
    status = "Shallow"

  deep_indices = [i for i, angle in enumerate(smoothed_angles) if angle <= (true_bottom_angle + 5)]

  def calc_back_lean(s, h):
    return math.degrees(math.atan2(abs(s["x"] - h["x"]), abs(s["y"] - h["y"])))

  lean_values = [calc_back_lean(valid_frames[i]["shoulder"], valid_frames[i]["hip"]) for i in deep_indices[:10]]
  avg_back_angle = median(lean_values) if lean_values else 0

  visibility_conf = sum(frame_weights) / len(frame_weights)
  phase_conf = min(1.0, len(bottom_sample) / 4)
  range_conf = min(1.0, max(0.0, depth_band / 25))
  rep_conf = (visibility_conf * 0.55) + (phase_conf * 0.2) + (range_conf * 0.25)

  return {
    "depth": {
      "value": round(display_depth, 1),
      "status": status,
      "confidence": round(rep_conf, 2)
    },
    "back_lean": {
      "value": round(avg_back_angle, 1),
      "excessive": avg_back_angle > 45,
      "confidence": round(rep_conf, 2)
    },
    "audit": {
      "frames_analyzed": len(rep_frames),
      "valid_frames": len(valid_frames),
      "camera_angle": camera_angle,
      "raw_bottom_angle": round(true_bottom_angle, 1),
      "sampling_rate": "filtered"
    }
  }
