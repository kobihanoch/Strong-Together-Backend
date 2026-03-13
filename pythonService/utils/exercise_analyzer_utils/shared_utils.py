import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose

def get_hip_center(landmarks):
  left_hip = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value]
  right_hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value]

  center_x = (left_hip.x + right_hip.x) / 2
  center_y = (left_hip.y + right_hip.y) / 2

  return center_x, center_y