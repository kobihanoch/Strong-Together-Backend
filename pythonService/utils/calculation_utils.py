import numpy as np
import math

def _point_to_xyz(point):
    if isinstance(point, dict):
        return np.array(
            [
                point["x"],
                point["y"],
                point.get("z", 0.0),
            ],
            dtype=float,
        )
    values = list(point)
    if len(values) == 2:
        values.append(0.0)
    return np.array(values, dtype=float)

def calculate_angle(a, b, c):
    a = _point_to_xyz(a)
    b = _point_to_xyz(b)
    c = _point_to_xyz(c)

    ba = a - b
    bc = c - b

    denominator = np.linalg.norm(ba) * np.linalg.norm(bc)
    if denominator == 0:
        return 0.0

    cosine_angle = np.dot(ba, bc) / denominator
    cosine_angle = np.clip(cosine_angle, -1.0, 1.0)

    angle = np.arccos(cosine_angle)

    return np.degrees(angle)


def distance(a, b):
    a = _point_to_xyz(a)
    b = _point_to_xyz(b)
    diff = a - b
    return math.sqrt(np.dot(diff, diff))
