const ONE_DAY = 24 * 60 * 60 * 1000;

export function progress(wakeUpTimeValueAsNumber, lastMealTimeValueAsNumber) {
  const offsets = getTimeOffsets(wakeUpTimeValueAsNumber, lastMealTimeValueAsNumber);
  if (!offsets) {
    return null;
  }

  const nowOffset = getNowOffset(offsets.wakeUp);

  return Math.min(1, (nowOffset - offsets.wakeUp) / (offsets.lastMeal - offsets.wakeUp));
}

// Returns a 24-hour period centered around "today" from one lastMeal/wakeup midpoint to the next.
export function boundsOfToday(wakeUpTimeValueAsNumber, lastMealTimeValueAsNumber) {
  const offsets = getTimeOffsets(wakeUpTimeValueAsNumber, lastMealTimeValueAsNumber);
  if (!offsets) {
    return null;
  }

  const msBetweenLastMealAndWakeUp = positiveMod(offsets.wakeUp - offsets.lastMeal, ONE_DAY);
  const midpointOffset = positiveMod(offsets.lastMeal + msBetweenLastMealAndWakeUp / 2, ONE_DAY);

  const midnightDate = new Date();
  midnightDate.setHours(0, 0, 0, 0);
  const midpoint = new Date(midnightDate.valueOf() + midpointOffset);

  if (Date.now() < midpoint) {
    const previousMidpoint = new Date(midpoint.valueOf() - ONE_DAY);
    return [previousMidpoint, midpoint];
  }

  const nextMidpoint = new Date(midpoint.valueOf() + ONE_DAY);
  return [midpoint, nextMidpoint];
}

// Returns the number of milliseconds past midnight for the wake-up time and lastMeal time.
function getTimeOffsets(wakeUpTimeValueAsNumber, lastMealTimeValueAsNumber) {
  // Inputs are not in a valid state
  if (wakeUpTimeValueAsNumber === null || lastMealTimeValueAsNumber === null) {
    return null;
  }

  const adjustedLastMealTimeValueAsNumber = lastMealTimeValueAsNumber < wakeUpTimeValueAsNumber ?
    lastMealTimeValueAsNumber + ONE_DAY :
    lastMealTimeValueAsNumber;

  // Right now wakeUpDate and lastMealDate are numbers representing milliseconds since midnight UTC
  // on 1970-01-01, since valueAsDate uses 1970-01-01T:00:00:00Z as its base. We want to translate
  // them to be milliseconds-since-midnight (potentially greater than 24 hours if the lastMeal time
  // is less than the wake-up time, e.g. wake up at 09:00 lastMeal at 00:30).

  const epoch = (new Date(0)).valueOf();
  return { wakeUp: wakeUpTimeValueAsNumber - epoch, lastMeal: adjustedLastMealTimeValueAsNumber - epoch };
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

function positiveMod(x, y) {
  return ((x % y) + y) % y;
}
