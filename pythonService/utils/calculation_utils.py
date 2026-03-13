import numpy as np
import math

def calculate_angle(a, b, c):
    a = np.array(a)
    b = np.array(b)
    c = np.array(c)

    ba = a - b
    bc = c - b

    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))

    angle = np.arccos(cosine_angle)

    return np.degrees(angle)


def distance(a, b):

    dx = a[0] - b[0]
    dy = a[1] - b[1]

    return math.sqrt(dx*dx + dy*dy)