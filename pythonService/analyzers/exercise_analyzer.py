import cv2
import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose
from utils.calculation_utils import calculate_angle

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
  UP_THRESHOLD = 150 # Min depth to count as UP

  knee_angles = []

  while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
      break
    frame_count += 1

    # convert color for mediapipe
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    results = pose.process(rgb_frame)

    if results and results.pose_landmarks:
      detected_frames += 1

      # Open video with landmarks for debugging
      mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
      small_frame = cv2.resize(frame, (640, 480))
      cv2.imshow("Pose Debug", small_frame)
      if cv2.waitKey(1) & 0xFF == ord("q"):
        break

      # Take landmarks
      landmarks = results.pose_landmarks.landmark
      hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
      knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
      ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

      # Calculate knee angle
      knee_angle = calculate_angle(hip, knee, ankle)
      knee_angles.append(knee_angle)

      # Determine state for rep counting
      if knee_angle < DOWN_THRESHOLD and stage == "UP":
        stage = "DOWN"
      if knee_angle > UP_THRESHOLD and stage == "DOWN":
        stage = "UP"
        rep_count += 1

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

