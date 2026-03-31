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

def get_squat_dominant_side_profile(landmarks):
  left_score = _side_score(landmarks, "LEFT")
  right_score = _side_score(landmarks, "RIGHT")
  score_gap = abs(left_score - right_score)
  if left_score > right_score:
    return {
      "side": "LEFT",
      "confidence": min(1.0, score_gap / 0.20),
      "left_score": left_score,
      "right_score": right_score,
    }
  return {
    "side": "RIGHT",
    "confidence": min(1.0, score_gap / 0.20),
    "left_score": left_score,
    "right_score": right_score,
  }

def get_squat_dominant_side(landmarks):
  profile = get_squat_dominant_side_profile(landmarks)
  if profile["confidence"] >= 0.10:
    return profile["side"]
  left_score = profile["left_score"]
  right_score = profile["right_score"]
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
    return {
      "x": landmarks[lm_idx].x,
      "y": landmarks[lm_idx].y,
      "z": landmarks[lm_idx].z,
      "v": landmarks[lm_idx].visibility,
    }

  if dominant_side == "LEFT":
    indices = [mp_pose.PoseLandmark.LEFT_HIP, mp_pose.PoseLandmark.LEFT_KNEE, mp_pose.PoseLandmark.LEFT_ANKLE, 
    mp_pose.PoseLandmark.LEFT_SHOULDER, mp_pose.PoseLandmark.LEFT_HEEL, mp_pose.PoseLandmark.LEFT_FOOT_INDEX]
  else:
    indices = [mp_pose.PoseLandmark.RIGHT_HIP, mp_pose.PoseLandmark.RIGHT_KNEE, mp_pose.PoseLandmark.RIGHT_ANKLE, 
    mp_pose.PoseLandmark.RIGHT_SHOULDER, mp_pose.PoseLandmark.RIGHT_HEEL, mp_pose.PoseLandmark.RIGHT_FOOT_INDEX]
  return [extract(idx.value) for idx in indices]

def get_current_squat_state(knee_angle, hip_point, shoulder_point, state_data, current_rep, all_reps):
  smoothing_alpha = state_data["smoothing_alpha"]
  smoothed_angle = (
    (smoothing_alpha * knee_angle) +
    ((1 - smoothing_alpha) * state_data["smoothed_angle"])
  )
  state_data["smoothed_angle"] = smoothed_angle

  torso_length = max(distance(hip_point, shoulder_point), 1e-6)
  current_hip_height = hip_point["y"]

  if state_data["top_hip_height"] is None:
    state_data["top_hip_height"] = current_hip_height

  if state_data["stage"] == "UP" and smoothed_angle >= state_data["up_threshold"]:
    state_data["top_hip_height"] = (
      (0.2 * current_hip_height) +
      (0.8 * state_data["top_hip_height"])
    )

  hip_drop = abs(current_hip_height - state_data["top_hip_height"]) / torso_length
  if hip_drop > state_data["deepest_hip_drop"]:
    state_data["deepest_hip_drop"] = hip_drop

  if smoothed_angle < state_data["lowest_angle"]:
    state_data["lowest_angle"] = smoothed_angle
  if smoothed_angle > state_data["highest_angle"]:
    state_data["highest_angle"] = smoothed_angle

  movement_range = state_data["highest_angle"] - state_data["lowest_angle"]
  reached_bottom_by_angle = smoothed_angle <= state_data["down_threshold"]
  reached_bottom_by_combined_signal = (
    smoothed_angle <= (state_data["down_threshold"] + state_data["angle_tolerance"]) and
    hip_drop >= state_data["min_hip_drop"]
  )

  if reached_bottom_by_angle or reached_bottom_by_combined_signal:
    state_data["down_frames"] += 1
  else:
    state_data["down_frames"] = 0

  recovered_to_top = (
    smoothed_angle >= state_data["up_threshold"] and
    hip_drop <= state_data["top_recovery_tolerance"]
  )
  recovered_by_angle_only = (
    smoothed_angle >= (state_data["up_threshold"] - state_data["angle_tolerance"]) and
    movement_range >= state_data["min_rep_range"]
  )

  if recovered_to_top or recovered_by_angle_only:
    state_data["up_frames"] += 1
  else:
    state_data["up_frames"] = 0

  if state_data["stage"] == "UP" and state_data["down_frames"] >= state_data["min_phase_frames"]:
    state_data["stage"] = "DOWN"
    state_data["up_frames"] = 0

  rep_has_clear_motion = (
    movement_range >= state_data["min_rep_range"] and
    (
      state_data["deepest_hip_drop"] >= state_data["min_hip_drop"] or
      state_data["lowest_angle"] <= (state_data["down_threshold"] + state_data["angle_tolerance"])
    )
  )

  if (
    state_data["stage"] == "DOWN" and
    state_data["up_frames"] >= state_data["min_phase_frames"] and
    rep_has_clear_motion
  ):
    state_data["stage"] = "UP"
    state_data["rep_count"] += 1
    all_reps.append(list(current_rep))
    current_rep.clear()
    state_data["down_frames"] = 0
    state_data["up_frames"] = 0
    state_data["highest_angle"] = smoothed_angle
    state_data["lowest_angle"] = smoothed_angle
    state_data["deepest_hip_drop"] = 0.0
    state_data["top_hip_height"] = current_hip_height

  return state_data

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
    horizontal_distance = math.sqrt(
      ((s["x"] - h["x"]) ** 2) +
      ((s["z"] - h["z"]) ** 2)
    )
    vertical_distance = abs(s["y"] - h["y"])
    return math.degrees(math.atan2(horizontal_distance, vertical_distance))

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
