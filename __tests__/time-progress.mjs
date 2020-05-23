import { jest } from '@jest/globals';
import computeTimeProgress from '../www/lib/time-progress.mjs';

jest.useFakeTimers('modern');

describe('sleep before midnight', () => {
  runTest({
    description: 'now before wakeUp',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T23:00Z',
    now: '2020-05-22T07:00',
    expected: 1
  });

  runTest({
    description: 'now = wakeUp',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T23:00Z',
    now: '2020-05-22T09:00',
    expected: 0
  });

  runTest({
    description: 'now between wakeUp and sleep',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T23:00Z',
    now: '2020-05-22T11:00',
    expected: 2 / 14
  });

  runTest({
    description: 'now = sleep',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T23:00Z',
    now: '2020-05-22T23:00',
    expected: 1
  });

  runTest({
    description: 'now after sleep',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T23:00Z',
    now: '2020-05-22T23:30',
    expected: 1
  });
});

describe('sleep after midnight', () => {
  runTest({
    description: 'now before wakeup',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T01:00Z',
    now: '2020-05-22T07:00',
    expected: 1
  });

  runTest({
    description: 'now = wakeUp',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T01:00Z',
    now: '2020-05-22T09:00',
    expected: 0
  });

  runTest({
    description: 'now between wakeUp and sleep',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T01:00Z',
    now: '2020-05-22T11:00',
    expected: 2 / 16
  });

  runTest({
    description: 'now = sleep',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T01:00Z',
    now: '2020-05-22T01:00',
    expected: 1
  });

  runTest({
    description: 'now after sleep',
    wakeUp: '1970-01-01T09:00Z',
    sleep: '1970-01-01T01:00Z',
    now: '2020-05-22T01:30',
    expected: 1
  });
});

function runTest({ description, wakeUp, sleep, now, expected }) {
  test(description, () => {
    const wakeUpDate = new Date(wakeUp);
    const sleepDate = new Date(sleep);
    jest.setSystemTime(new Date(now));

    expect(computeTimeProgress(wakeUpDate, sleepDate)).toBe(expected);
  });
}
