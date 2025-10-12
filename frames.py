import os
from datetime import timedelta
import numpy as np
import cv2
def format_timedelta(td):
    result = str(td)
    try:
        result, ms = result.split(".")
    except ValueError:
        return (result + ".00").replace(":", "-")
    ms = int(ms)
    ms = round(ms / 1e4)
    return f"{result}.{ms:02}".replace(":", "-")
def get_saving_frames_durations(cap, saving_fps):
    s = []
    clip_duration = cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS)
    for i in np.arange(0, clip_duration, 1 / saving_fps):
        s.append(i)
    return s
def extract_frames(video_file, saving_fps):
    cap = cv2.VideoCapture(video_file)

    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    os.makedirs("frames", exist_ok=True)
    saving_frames_durations = get_saving_frames_durations(cap, saving_fps)
    count = 0

    while True:
        is_read, frame = cap.read()
        if not is_read:
            break

        frame_duration = count / cap.get(cv2.CAP_PROP_FPS)

        try:
            closest_duration = saving_frames_durations[0]
        except IndexError:
            break

        if frame_duration >= closest_duration:
            frame_duration_formatted = format_timedelta(timedelta(seconds=frame_duration))
            cv2.imwrite(os.path.join("frames", f"frame_{frame_duration_formatted}.jpg"), frame)
            saving_frames_durations.pop(0)

        count += 1

    cap.release()
    print("Frames extracted and saved in 'frames' directory.")
video_file = r"C:\Users\harsh\OneDrive\Pictures\VN20230521_151909.mp4"  #add video path here
saving_fps = 1  # Save 1 frame per second
extract_frames(video_file, saving_fps)