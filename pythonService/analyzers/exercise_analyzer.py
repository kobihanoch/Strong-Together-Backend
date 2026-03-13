import cv2
import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose
from utils.calculation_utils import *
from utils.exercise_analyzer_utils.squat_utils import *
from utils.exercise_analyzer_utils.shared_utils import *

pose = mp_pose.Pose()

def analyze_exercise_video(path, exercise):
  if exercise == "squat":
    return analyze_squat(path)

  if exercise == "bench":
    return analyze_bench(path)

  return {"error": "exercise not supported"}


def analyze_squat(path):
  cap = cv2.VideoCapture(str(path))
  pose = mp_pose.Pose() if mp_pose else None

  frame_count = 0
  detected_frames = 0

  rep_count = 0
  stage = "UP"

  DOWN_THRESHOLD = 100 # Min depth to count as DOWN
  UP_THRESHOLD = 130 # Min depth to count as UP
  MAX_PERSON_JUMP = 0.25 # Max jump for "Focus lost"

  knee_angles = []
  dominant_side = None
  tracked_center = None

  while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
      break
    frame_count += 1
    if frame_count % 3 != 0: # Proccess 1/3 frames
      continue
    # Convert color for mediapipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(rgb_frame)
    if results and results.pose_landmarks:
      detected_frames += 1
      landmarks = results.pose_landmarks.landmark
      # Take hip center and calculate tracked center to check if focus lost
      center = get_hip_center(landmarks)
      if tracked_center is None:
        tracked_center = center
      # Learn new center based on first center
      alpha = 0.1
      tracked_center = (alpha * center[0] + (1 - alpha) * tracked_center[0], alpha * center[1] + (1 - alpha) * tracked_center[1])
      dist = distance(center, tracked_center)
      if dist > MAX_PERSON_JUMP:
        continue
      # Take dominant side
      dominant_side = get_dominant_side(landmarks)
      # Take landmarks
      hip,knee,ankle = get_dominant_side_landmarks(dominant_side, landmarks)
      # Calculate knee angle
      knee_angle = calculate_angle(hip, knee, ankle)
      knee_angles.append(knee_angle)
      # Determine state for rep counting
      stage,rep_count = get_current_state(knee_angle, stage, rep_count, DOWN_THRESHOLD, UP_THRESHOLD)
      # Open video with landmarks for debugging
      if (show_window_with_landmarks(frame, results) == False):
        break


  cap.release()
  
  return {
    "exercise": "squat",
    "frames_processed": frame_count,
    "frames_with_pose": detected_frames,
    "reps_counted": rep_count
  }


def analyze_bench(path):
  return {
    "exercise": "bench",
    "bar_path": "good"
  }

def show_window_with_landmarks(frame, results):
  mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
  small_frame = cv2.resize(frame, (950, 800))
  cv2.imshow("Pose Debug", small_frame)
  if cv2.waitKey(1) & 0xFF == ord("q"):
    return False
  return True

