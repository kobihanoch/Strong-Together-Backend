/**
 * Compute how many milliseconds from "now" we should wait
 * before sending the reminder.
 *
 * estimatedTimeUTC - timestamptz from DB (string)
 * offsetMinutes - how many minutes BEFORE the estimated time we should notify
 */
export function computeDelayFromUTC(nowDate, estimatedTimeUTC, offsetMinutes) {
  // parse DB timestamptz to JS Date
  const target = new Date(estimatedTimeUTC);

  // build today's date in UTC with the target's hour and minute
  const year = nowDate.getUTCFullYear();
  const month = nowDate.getUTCMonth();
  const day = nowDate.getUTCDate();

  const targetToday = new Date(
    Date.UTC(
      year,
      month,
      day,
      target.getUTCHours(),
      target.getUTCMinutes(),
      0,
      0
    )
  );

  // apply the user offset -> remind BEFORE training time
  const remindAt = new Date(targetToday.getTime() - offsetMinutes * 60 * 1000);

  // if reminder time already passed -> return null (we can also schedule for tomorrow if needed)
  if (remindAt.getTime() <= nowDate.getTime()) {
    return null;
  }

  // return delay in ms
  return remindAt.getTime() - nowDate.getTime();
}
