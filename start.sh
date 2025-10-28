#!/bin/sh
set -eu

term_handler() {
  kill -TERM "$API_PID" 2>/dev/null || true
  kill -TERM "$WORKER_PID" 2>/dev/null || true
  wait
  exit 0
}
trap term_handler INT TERM

node src/index.js &
API_PID=$!

node src/workers/globalWorker.js &
WORKER_PID=$!

wait -n
exit $?
