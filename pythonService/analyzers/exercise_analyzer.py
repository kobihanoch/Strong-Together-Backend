import cv2
import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose
import os
from utils.calculation_utils import *
from utils.exercise_analyzer_utils.squat_utils import *
from utils.exercise_analyzer_utils.shared_utils import *

def analyze_exercise_video(path, exercise):
  if exercise == "squat":
    return analyze_squat(path)

  if exercise == "bench":
    return analyze_bench(path)

  return {"error": "exercise not supported"}


def analyze_squat(path):
	cap = cv2.VideoCapture(str(path))
	pose = mp_pose.Pose()

	frame_count = 0
	detected_frames = 0
	rep_count = 0
	stage = "UP"

	# Default thresholds for SIDE_VIEW
	DOWN_THRESHOLD = 100
	UP_THRESHOLD = 135
	MAX_PERSON_JUMP = 0.25
	VOTE_FRAMES = 5

	dominant_side = None
	tracked_center = None
	camera_angle = None
	camera_votes = []
	side_votes = []
	current_rep = []
	all_reps = []

	while cap.isOpened():
		ret, frame = cap.read()
		if not ret:
			break
		
		frame_count += 1
		if frame_count % 3 != 0: 
			continue

		results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
		if results and results.pose_landmarks:
			detected_frames += 1
			landmarks = results.pose_landmarks.landmark

			# Track hip center to detect sudden frame jumps
			actual_center, tracked_center = update_tracked_hip_center(landmarks, tracked_center, 0.1)
			if distance(actual_center, tracked_center) > MAX_PERSON_JUMP:
				continue

			if camera_angle is None:
				camera_view = get_camera_view(landmarks)
				if camera_view != "UNCERTAIN":
					camera_votes.append(camera_view)
				if len(camera_votes) >= VOTE_FRAMES:
					camera_angle = max(set(camera_votes), key=camera_votes.count)
					if camera_angle != "SIDE_VIEW":
						return {"error": "Only side view is supported for squat."}
					continue
				else:
					continue

			if dominant_side is None:
				side_votes.append(get_squat_dominant_side(landmarks))
				if len(side_votes) >= VOTE_FRAMES:
					dominant_side = max(set(side_votes), key=side_votes.count)
				else:
					continue

			# Extract joint data
			hip, knee, ankle, shoulder, heel, foot = get_squat_dominant_side_landmarks(dominant_side, landmarks)
			knee_angle = calculate_angle(hip, knee, ankle)
			
			current_rep.append({
				"knee_angle": knee_angle, "hip": hip, "knee": knee, 
				"ankle": ankle, "shoulder": shoulder, "heel": heel, "foot": foot
			})

			stage, rep_count = get_current_squat_state(
				knee_angle, stage, rep_count, DOWN_THRESHOLD, UP_THRESHOLD, current_rep, all_reps
			)

			if not show_window_with_landmarks(frame, results):
				break

	cap.release()
	# Final analysis for each detected rep
	return [analyze_squat_rep(rep, camera_angle) for rep in all_reps]


def analyze_bench(path):
  return {
    "exercise": "bench",
    "bar_path": "good"
  }

def show_window_with_landmarks(frame, results):
  if os.getenv("DISABLE_DEBUG_WINDOW", "0") == "1":
    return True
  mp.solutions.drawing_utils.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
  small_frame = cv2.resize(frame, (950, 800))
  cv2.imshow("Pose Debug", small_frame)
  if cv2.waitKey(1) & 0xFF == ord("q"):
    return False
  return True

