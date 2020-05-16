const ONE_DAY = 24 * 60 * 60 * 1000;

export default (wakeUpTimeValueAsDate, sleepTimeValueAsDate) => {
  const offsets = getTimeOffsets(wakeUpTimeValueAsDate, sleepTimeValueAsDate);
  if (!offsets) {
    return null;
  }

  const nowOffset = getNowOffset(offsets.wakeUp);

  return Math.min(1, (nowOffset - offsets.wakeUp) / (offsets.sleep - offsets.wakeUp));
};

// Returns the number of milliseconds past midnight for the wake-up time and sleep time.
function getTimeOffsets(wakeUpTimeValueAsDate, sleepTimeValueAsDate) {
  const wakeUpDate = wakeUpTimeValueAsDate?.valueOf();
  const rawSleepDate = sleepTimeValueAsDate?.valueOf();

  // Inputs are not in a valid state
  if (!wakeUpDate || !rawSleepDate) {
    return null;
  }

  const sleepDate = rawSleepDate < wakeUpDate ? rawSleepDate + ONE_DAY : rawSleepDate;

  // Right now wakeUpDate and sleepDate are numbers representing milliseconds since midnight UTC
  // on 1970-01-01, since valueAsDate uses 1970-01-01T:00:00:00Z as its base. We want to translate
  // them to be milliseconds-since-midnight (potentially greater than 24 hours if the sleep time
  // is less than the wake-up time, e.g. wake up at 09:00 sleep at 00:30).

  const epoch = (new Date(0)).valueOf();
  return { wakeUp: wakeUpDate - epoch, sleep: sleepDate - epoch };
}

// Returns the number of milliseconds past midnight for the current time, assuming that if the
// current time is before the wakeup time, then we are still working on the previous day. (So e.g.
// if it is currently 04:00 and wakeUpOffset represents 09:00, this will return 28 hours, not 4.)
function getNowOffset(wakeUpOffset) {
  const nowDate = Date.now();

  const midnightDate = new Date();
  midnightDate.setHours(0, 0, 0, 0);

  const rawNowOffset = nowDate - midnightDate.valueOf();

  return rawNowOffset < wakeUpOffset ? rawNowOffset + ONE_DAY : rawNowOffset;
}
