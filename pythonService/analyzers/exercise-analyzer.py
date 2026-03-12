def analyze_exercise_video(path, exercise):
  if exercise == "squat":
    return analyze_squat(path)

  if exercise == "bench":
    return analyze_bench(path)

  return {"error": "exercise not supported"}


def analyze_squat(path):
  return {
    "exercise": "squat",
    "depth": "good",
    "knees": "stable"
  }


def analyze_bench(path):
  return {
    "exercise": "bench",
    "bar_path": "good"
  }