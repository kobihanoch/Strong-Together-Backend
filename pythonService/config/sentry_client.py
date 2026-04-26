import os

import sentry_sdk
from sentry_sdk.integrations.logging import LoggingIntegration


def init_sentry() -> bool:
    dsn = os.getenv("SENTRY_DSN")
    if not dsn:
        return False

    traces_sample_rate = float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0"))
    profiles_sample_rate = float(os.getenv("SENTRY_PROFILES_SAMPLE_RATE", "0"))

    sentry_sdk.init(
        dsn=dsn,
        environment=os.getenv("SENTRY_ENVIRONMENT", os.getenv("NODE_ENV", "development")),
        release=os.getenv("SENTRY_RELEASE"),
        traces_sample_rate=traces_sample_rate,
        profiles_sample_rate=profiles_sample_rate,
        send_default_pii=False,
        integrations=[LoggingIntegration(level=None, event_level=None)],
    )
    return True


def set_sentry_context(*, request_id=None, user_id=None, job_id=None, exercise=None, sentry_trace=None, baggage=None):
    if request_id:
        sentry_sdk.set_tag("requestId", request_id)
    if job_id:
        sentry_sdk.set_tag("jobId", job_id)
    if exercise:
        sentry_sdk.set_tag("exercise", exercise)
    if user_id:
        sentry_sdk.set_user({"id": str(user_id)})
    if sentry_trace:
        sentry_sdk.set_extra("sentryTrace", sentry_trace)
    if baggage:
        sentry_sdk.set_extra("baggage", baggage)


def capture_exception(error: Exception, **context):
    with sentry_sdk.push_scope() as scope:
        request_id = context.get("request_id")
        user_id = context.get("user_id")
        job_id = context.get("job_id")
        exercise = context.get("exercise")
        sentry_trace = context.get("sentry_trace")
        baggage = context.get("baggage")

        if request_id:
            scope.set_tag("requestId", request_id)
            scope.set_extra("requestId", request_id)
        if user_id:
            scope.set_user({"id": str(user_id)})
            scope.set_tag("userId", str(user_id))
        if job_id:
            scope.set_tag("jobId", str(job_id))
            scope.set_extra("jobId", job_id)
        if exercise:
            scope.set_tag("exercise", str(exercise))
            scope.set_extra("exercise", exercise)
        if sentry_trace:
            scope.set_extra("sentryTrace", sentry_trace)
        if baggage:
            scope.set_extra("baggage", baggage)

        return sentry_sdk.capture_exception(error)

def apply_sentry_headers(sentry_trace, baggage):
  trace_headers = {}
  if sentry_trace:
    trace_headers["sentry-trace"] = sentry_trace
  if baggage:
    trace_headers["baggage"] = baggage
  return trace_headers

def set_span_data(span, job_id, user_id, exercise, file_key, event_name, request_id=None, sentry_trace=None, baggage=None):
  span.set_data("queue.name", "analysisSqsQueue")
  span.set_data("queue.job_id", str(job_id))
  span.set_data("user.id", str(user_id))
  span.set_data("video.exercise", str(exercise))
  span.set_data("storage.file_key", str(file_key))
  span.set_data("storage.event_name", str(event_name))
  span.set_data("http.request_id", str(request_id) if request_id else "unknown")
  if sentry_trace:
    span.set_data("sentry.trace", str(sentry_trace))
  if baggage:
    span.set_data("sentry.baggage", str(baggage))