#!/bin/sh
set -eu

npx tsc --noEmit

term_handler() {
  kill -TERM "$API_PID" 2>/dev/null || true
  kill -TERM "$WORKER_PID" 2>/dev/null || true
  wait
  exit 0
}
trap term_handler INT TERM

npm run start:server &
API_PID=$!

npm run start:workers &
WORKER_PID=$!

wait -n
exit $?
