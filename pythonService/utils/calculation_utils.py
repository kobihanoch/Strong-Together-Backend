import numpy as np
import math

def _point_to_xy(point):
    if isinstance(point, dict):
        return np.array([point["x"], point["y"]], dtype=float)
    return np.array(point, dtype=float)

def calculate_angle(a, b, c):
    a = _point_to_xy(a)
    b = _point_to_xy(b)
    c = _point_to_xy(c)

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
    a = _point_to_xy(a)
    b = _point_to_xy(b)

    dx = a[0] - b[0]
    dy = a[1] - b[1]

    return math.sqrt(dx*dx + dy*dy)
