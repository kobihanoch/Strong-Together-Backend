import uuid

# Validates UUID and throws an exception if UUID is not valid format
def validate_uuid(candidate_id):
  try:
    uuid.UUID(candidate_id)
  except ValueError as error:
    raise RuntimeError(f"Invalid UUID in uploaded video key: {candidate_id}") from error