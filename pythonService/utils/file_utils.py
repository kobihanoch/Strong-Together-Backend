from pathlib import Path
import shutil

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(exist_ok=True)

def save_uploaded_video(video):
  file_path = UPLOAD_DIR / video.filename

  with file_path.open("wb") as buffer:
    shutil.copyfileobj(video.file, buffer)

  return file_path