import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose
from types import SimpleNamespace

def _safe_visibility_avg(points):
  return sum(point.visibility for point in points) / len(points)

def _safe_abs_diff(a, b):
  return abs(a - b)

def _blend_value(current_value, previous_value, alpha):
  return (alpha * current_value) + ((1 - alpha) * previous_value)

def _blend_landmark(current_landmark, previous_landmark, alpha):
  return SimpleNamespace(
    x=_blend_value(current_landmark.x, previous_landmark.x, alpha),
    y=_blend_value(current_landmark.y, previous_landmark.y, alpha),
    z=_blend_value(current_landmark.z, previous_landmark.z, alpha),
    visibility=_blend_value(current_landmark.visibility, previous_landmark.visibility, alpha),
  )

def get_hip_center(landmarks):
  left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
  right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]

  center_x = (left_hip.x + right_hip.x) / 2
  center_y = (left_hip.y + right_hip.y) / 2
  center_z = (left_hip.z + right_hip.z) / 2

  return center_x, center_y, center_z

def update_tracked_hip_center(landmarks, tracked_center, alpha = 0.1):
  # Take hip center and calculate tracked center to check if focus lost
  actual_center = get_hip_center(landmarks)
  if tracked_center is None:
    tracked_center = actual_center
  # Learn new center based on first center
  tracked_center = (
    alpha * actual_center[0] + (1 - alpha) * tracked_center[0],
    alpha * actual_center[1] + (1 - alpha) * tracked_center[1],
    alpha * actual_center[2] + (1 - alpha) * tracked_center[2],
  )
  return [actual_center,tracked_center]

def smooth_landmarks(current_landmarks, previous_landmarks, alpha = 0.35):
  if previous_landmarks is None:
    return current_landmarks
  return [
    _blend_landmark(current_landmark, previous_landmark, alpha)
    for current_landmark, previous_landmark in zip(current_landmarks, previous_landmarks)
  ]

def get_camera_view_metrics(landmarks):
  nose = landmarks[mp_pose.PoseLandmark.NOSE.value]
  left_ear = landmarks[mp_pose.PoseLandmark.LEFT_EAR.value]
  right_ear = landmarks[mp_pose.PoseLandmark.RIGHT_EAR.value]
  left_shoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value]
  right_shoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value]
  left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
  right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]

  shoulder_z_diff = _safe_abs_diff(left_shoulder.z, right_shoulder.z)
  hip_z_diff = _safe_abs_diff(left_hip.z, right_hip.z)
  shoulder_x_span = _safe_abs_diff(left_shoulder.x, right_shoulder.x)
  hip_x_span = _safe_abs_diff(left_hip.x, right_hip.x)
  ear_x_span = _safe_abs_diff(left_ear.x, right_ear.x)
  ear_z_diff = _safe_abs_diff(left_ear.z, right_ear.z)

  torso_x_span = max((shoulder_x_span + hip_x_span) / 2, 1e-6)
  torso_z_diff = (shoulder_z_diff + hip_z_diff) / 2
  depth_to_width_ratio = torso_z_diff / torso_x_span
  shoulder_hip_depth_agreement = 1.0 - min(1.0, abs(shoulder_z_diff - hip_z_diff) / max(torso_z_diff, 1e-6))

  face_visibility = _safe_visibility_avg([nose, left_ear, right_ear])
  torso_visibility = _safe_visibility_avg([left_shoulder, right_shoulder, left_hip, right_hip])

  avg_visibility = (torso_visibility * 0.8) + (face_visibility * 0.2)

  # Side view usually means:
  # more left/right depth separation in the torso,
  # narrower torso width in X,
  # and often smaller visible face width across the ears.
  side_score = (
    (depth_to_width_ratio * 0.65) +
    (torso_z_diff * 0.25) -
    (ear_x_span * 0.08) +
    (ear_z_diff * 0.08)
  )

  angled_score = (
    (depth_to_width_ratio * 0.55) +
    (shoulder_hip_depth_agreement * 0.25) +
    (torso_z_diff * 0.20)
  )

  return {
    "side_score": side_score,
    "angled_score": angled_score,
    "avg_visibility": avg_visibility,
    "torso_x_span": torso_x_span,
    "torso_z_diff": torso_z_diff,
    "depth_to_width_ratio": depth_to_width_ratio,
    "shoulder_hip_depth_agreement": shoulder_hip_depth_agreement,
  }

def get_camera_view_profile(landmarks):
  metrics = get_camera_view_metrics(landmarks)
  if metrics["avg_visibility"] < 0.65:
    return {"label": "UNCERTAIN", "confidence": 0.0, "metrics": metrics}

  if metrics["side_score"] > 0.22:
    return {
      "label": "SIDE_VIEW",
      "confidence": min(1.0, metrics["side_score"] / 0.35),
      "metrics": metrics,
    }

  if metrics["angled_score"] > 0.18:
    return {
      "label": "ANGLED_VIEW",
      "confidence": min(1.0, metrics["angled_score"] / 0.35),
      "metrics": metrics,
    }

  if metrics["side_score"] < 0.08:
    return {
      "label": "FRONT_VIEW",
      "confidence": min(1.0, (0.08 - metrics["side_score"]) / 0.08),
      "metrics": metrics,
    }

  return {"label": "UNCERTAIN", "confidence": 0.0, "metrics": metrics}

def get_camera_view(landmarks):
  return get_camera_view_profile(landmarks)["label"]
