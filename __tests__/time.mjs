import { jest } from '@jest/globals';
import { progress, boundsOfToday } from '../www/lib/time.mjs';

jest.useFakeTimers('modern');

describe('progress()', () => {
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
      const wakeUpValueAsNumber = (new Date(wakeUp)).valueOf();
      const sleepValueAsNumber = (new Date(sleep)).valueOf();
      jest.setSystemTime(new Date(now));

      expect(progress(wakeUpValueAsNumber, sleepValueAsNumber)).toBe(expected);
    });
  }
});

describe('boundsOfToday()', () => {
  describe('sleep before midnight', () => {
    runTest({
      description: 'now before first midpoint',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T23:00Z',
      now: '2020-05-22T03:00',
      expected: ['2020-05-21T04:00', '2020-05-22T04:00']
    });

    runTest({
      description: 'now before wakeUp',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T23:00Z',
      now: '2020-05-22T07:00',
      expected: ['2020-05-22T04:00', '2020-05-23T04:00']
    });

    runTest({
      description: 'now = wakeUp',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T23:00Z',
      now: '2020-05-22T09:00',
      expected: ['2020-05-22T04:00', '2020-05-23T04:00']
    });

    runTest({
      description: 'now between wakeUp and sleep',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T23:00Z',
      now: '2020-05-22T11:00',
      expected: ['2020-05-22T04:00', '2020-05-23T04:00']
    });

    runTest({
      description: 'now = sleep',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T23:00Z',
      now: '2020-05-22T23:00',
      expected: ['2020-05-22T04:00', '2020-05-23T04:00']
    });

    runTest({
      description: 'now after sleep',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T23:00Z',
      now: '2020-05-22T23:30',
      expected: ['2020-05-22T04:00', '2020-05-23T04:00']
    });
  });

  describe('sleep after midnight', () => {
    runTest({
      description: 'now before first midpoint',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T01:00Z',
      now: '2020-05-22T03:00',
      expected: ['2020-05-21T05:00', '2020-05-22T05:00']
    });

    runTest({
      description: 'now before wakeup',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T01:00Z',
      now: '2020-05-22T07:00',
      expected: ['2020-05-22T05:00', '2020-05-23T05:00']
    });

    runTest({
      description: 'now = wakeUp',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T01:00Z',
      now: '2020-05-22T09:00',
      expected: ['2020-05-22T05:00', '2020-05-23T05:00']
    });

    runTest({
      description: 'now between wakeUp and sleep',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T01:00Z',
      now: '2020-05-22T11:00',
      expected: ['2020-05-22T05:00', '2020-05-23T05:00']
    });

    runTest({
      description: 'now = sleep',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T01:00Z',
      now: '2020-05-23T01:00',
      expected: ['2020-05-22T05:00', '2020-05-23T05:00']
    });

    runTest({
      description: 'now after sleep',
      wakeUp: '1970-01-01T09:00Z',
      sleep: '1970-01-01T01:00Z',
      now: '2020-05-23T01:30',
      expected: ['2020-05-22T05:00', '2020-05-23T05:00']
    });
  });


  function runTest({ description, wakeUp, sleep, now, expected }) {
    test(description, () => {
      const wakeUpValueAsNumber = (new Date(wakeUp)).valueOf();
      const sleepValueAsNumber = (new Date(sleep)).valueOf();
      jest.setSystemTime(new Date(now));

      const expectedAsDates = expected.map(e => new Date(e));
      expect(boundsOfToday(wakeUpValueAsNumber, sleepValueAsNumber)).toEqual(expectedAsDates);
    });
  }
});
