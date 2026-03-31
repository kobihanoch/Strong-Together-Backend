import cv2
import mediapipe as mp
import mediapipe.python.solutions.pose as mp_pose
import os
import math
from utils.calculation_utils import *
from utils.exercise_analyzer_utils.squat_utils import *
from utils.exercise_analyzer_utils.shared_utils import *

def analyze_exercise_video(path, exercise, job_id=None, user_id=None, request_id=None):
  if exercise == "squat":
    res = analyze_squat(path)
  elif exercise == "bench":
    res = analyze_bench(path)
  else:
    res = {"error": "exercise not supported"}

  return res


def analyze_squat(path):
	cap = cv2.VideoCapture(str(path))
	pose = mp_pose.Pose()

	frame_count = 0
	detected_frames = 0

	# Default thresholds for SIDE_VIEW
	DOWN_THRESHOLD = 120
	UP_THRESHOLD = 145
	MAX_PERSON_JUMP = 0.12
	VOTE_FRAMES = 5
	SMOOTHING_ALPHA = 0.35
	MIN_PHASE_FRAMES = 2
	MIN_REP_RANGE = 25
	MIN_HIP_DROP = 0.08
	TOP_RECOVERY_TOLERANCE = 0.10
	ANGLE_TOLERANCE = 8

	dominant_side = None
	tracked_center = None
	camera_angle = None
	camera_votes = []
	side_votes = []
	smoothed_world_landmarks = None
	current_rep = []
	all_reps = []
	state_data = {
		"stage": "UP",
		"rep_count": 0,
		"smoothed_angle": 180.0,
		"highest_angle": 180.0,
		"lowest_angle": 180.0,
		"down_threshold": DOWN_THRESHOLD,
		"up_threshold": UP_THRESHOLD,
		"smoothing_alpha": SMOOTHING_ALPHA,
		"min_phase_frames": MIN_PHASE_FRAMES,
		"min_rep_range": MIN_REP_RANGE,
		"min_hip_drop": MIN_HIP_DROP,
		"top_recovery_tolerance": TOP_RECOVERY_TOLERANCE,
		"angle_tolerance": ANGLE_TOLERANCE,
		"top_hip_height": None,
		"deepest_hip_drop": 0.0,
		"down_frames": 0,
		"up_frames": 0,
	}

	while cap.isOpened():
		ret, frame = cap.read()
		if not ret:
			break
		
		frame_count += 1

		results = pose.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
		if results and results.pose_world_landmarks:
			detected_frames += 1
			raw_world_landmarks = results.pose_world_landmarks.landmark
			smoothed_world_landmarks = smooth_landmarks(raw_world_landmarks, smoothed_world_landmarks, 0.35)
			world_landmarks = smoothed_world_landmarks
			image_landmarks = results.pose_landmarks

			# Track hip center to detect sudden frame jumps
			actual_center, tracked_center = update_tracked_hip_center(world_landmarks, tracked_center, 0.1)
			if distance(actual_center, tracked_center) > MAX_PERSON_JUMP:
				continue

			if camera_angle is None:
				camera_profile = get_camera_view_profile(world_landmarks)
				if camera_profile["label"] != "UNCERTAIN" and camera_profile["confidence"] >= 0.35:
					camera_votes.append(camera_profile["label"])
				if len(camera_votes) >= VOTE_FRAMES:
					camera_angle = max(set(camera_votes), key=camera_votes.count)
					if camera_angle == "FRONT_VIEW":
						return {"error": "Front view is not supported for squat."}
					if camera_angle == "ANGLED_VIEW":
						state_data["down_threshold"] = 118
						state_data["up_threshold"] = 148
						state_data["min_rep_range"] = 22
						state_data["min_hip_drop"] = 0.06
						state_data["top_recovery_tolerance"] = 0.12
					continue
				else:
					continue

			if dominant_side is None:
				side_profile = get_squat_dominant_side_profile(world_landmarks)
				if side_profile["confidence"] >= 0.15:
					side_votes.append(side_profile["side"])
				if len(side_votes) >= VOTE_FRAMES:
					dominant_side = max(set(side_votes), key=side_votes.count)
				else:
					continue

			# Extract joint data
			hip, knee, ankle, shoulder, heel, foot = get_squat_dominant_side_landmarks(dominant_side, world_landmarks)
			knee_angle = calculate_angle(hip, knee, ankle)
			
			current_rep.append({
				"knee_angle": knee_angle, "hip": hip, "knee": knee, 
				"ankle": ankle, "shoulder": shoulder, "heel": heel, "foot": foot
			})

			state_data = get_current_squat_state(
				knee_angle,
				hip,
				shoulder,
				state_data,
				current_rep,
				all_reps,
			)

			torso_length = max(distance(hip, shoulder), 1e-6)
			top_hip_height = state_data.get("top_hip_height")
			hip_drop = 0.0
			if top_hip_height is not None:
				hip_drop = abs(hip["y"] - top_hip_height) / torso_length

			debug_info = {
				"frame": frame_count,
				"camera_angle": camera_angle or "PENDING",
				"dominant_side": dominant_side or "PENDING",
				"stage": state_data["stage"],
				"rep_count": state_data["rep_count"],
				"raw_knee_angle": knee_angle,
				"smoothed_angle": state_data["smoothed_angle"],
				"lowest_angle": state_data["lowest_angle"],
				"highest_angle": state_data["highest_angle"],
				"down_frames": state_data["down_frames"],
				"up_frames": state_data["up_frames"],
				"down_threshold": state_data["down_threshold"],
				"up_threshold": state_data["up_threshold"],
				"deepest_hip_drop": state_data["deepest_hip_drop"],
				"hip_drop": hip_drop,
				"min_hip_drop": state_data["min_hip_drop"],
				"min_rep_range": state_data["min_rep_range"],
			}

			if not show_window_with_landmarks(frame, image_landmarks, debug_info):
				break

	cap.release()
	# Final analysis for each detected rep
	return [analyze_squat_rep(rep, camera_angle) for rep in all_reps]


def analyze_bench(path):
  return {
    "exercise": "bench",
    "bar_path": "good"
  }

def _format_debug_value(value):
  if isinstance(value, float):
    if math.isnan(value) or math.isinf(value):
      return "n/a"
    return f"{value:.1f}"
  return str(value)

def _draw_debug_overlay(frame, debug_info):
  overlay_lines = [
    f"Frame: {_format_debug_value(debug_info.get('frame'))}",
    f"Camera: {_format_debug_value(debug_info.get('camera_angle'))}",
    f"Side: {_format_debug_value(debug_info.get('dominant_side'))}",
    f"Stage: {_format_debug_value(debug_info.get('stage'))}",
    f"Reps: {_format_debug_value(debug_info.get('rep_count'))}",
    f"Knee angle raw/smooth: {_format_debug_value(debug_info.get('raw_knee_angle'))} / {_format_debug_value(debug_info.get('smoothed_angle'))}",
    f"Angle range low/high: {_format_debug_value(debug_info.get('lowest_angle'))} / {_format_debug_value(debug_info.get('highest_angle'))}",
    f"Down frames: {_format_debug_value(debug_info.get('down_frames'))}  threshold: {_format_debug_value(debug_info.get('down_threshold'))}",
    f"Up frames: {_format_debug_value(debug_info.get('up_frames'))}  threshold: {_format_debug_value(debug_info.get('up_threshold'))}",
    f"Hip drop curr/deepest: {_format_debug_value(debug_info.get('hip_drop'))} / {_format_debug_value(debug_info.get('deepest_hip_drop'))}",
    f"Rules min drop/range: {_format_debug_value(debug_info.get('min_hip_drop'))} / {_format_debug_value(debug_info.get('min_rep_range'))}",
  ]

  line_height = 28
  top = 30
  left = 20
  box_height = 12 + (line_height * len(overlay_lines))
  cv2.rectangle(frame, (10, 10), (760, box_height), (0, 0, 0), -1)
  cv2.rectangle(frame, (10, 10), (760, box_height), (70, 70, 70), 1)

  for index, line in enumerate(overlay_lines):
    y = top + (index * line_height)
    cv2.putText(
      frame,
      line,
      (left, y),
      cv2.FONT_HERSHEY_SIMPLEX,
      0.65,
      (0, 255, 0),
      2,
      cv2.LINE_AA,
    )

def show_window_with_landmarks(frame, image_landmarks, debug_info=None):
  # In server environments we stay headless by default and only enable the
  # debug window when it is explicitly requested.
  if os.getenv("ENABLE_DEBUG_WINDOW", "0") != "1":
    return True
  mp.solutions.drawing_utils.draw_landmarks(frame, image_landmarks, mp_pose.POSE_CONNECTIONS)
  if debug_info:
    _draw_debug_overlay(frame, debug_info)
  small_frame = cv2.resize(frame, (950, 800))
  cv2.imshow("Pose Debug", small_frame)
  if cv2.waitKey(1) & 0xFF == ord("q"):
    return False
  return True


