import cv2
import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose

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

  cap.release()
  
  return {
    "exercise": "squat",
    "frames_processed": frame_count,
    "frames_with_pose": detected_frames,
    "pose_backend_available": pose is not None
  }


def analyze_bench(path):
  return {
    "exercise": "bench",
    "bar_path": "good"
  }

