import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose

def get_dominant_side(landmarks):
  left_knee = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value]
  right_knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value]
  if left_knee.visibility > right_knee.visibility:
    return "LEFT"
  if right_knee.visibility > left_knee.visibility:
    return "RIGHT"
  # If visibility is similar, choose the side closer to camera using depth
  if left_knee.z < right_knee.z:
    return "LEFT"
  return "RIGHT"

def get_dominant_side_landmarks(dominant_side, landmarks):
  if dominant_side == "LEFT":
    hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
  else:
    hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
    knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
    ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]
  return [hip, knee, ankle]

def get_current_state(knee_angle, stage, rep_count, down_threshold, up_threshold):
  if knee_angle < down_threshold and stage == "UP":
    stage = "DOWN"
  if knee_angle > up_threshold and stage == "DOWN":
    stage = "UP"
    rep_count += 1
  return [stage, rep_count]