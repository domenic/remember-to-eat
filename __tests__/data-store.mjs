import { TargetsStore, LogsStore } from '../www/lib/data-store.mjs';
import fakeTimers from 'https://cdn.pika.dev/@sinonjs/fake-timers@^6.0.1';

describe('TargetsStore', () => {
  let store;
  beforeAll(() => {
    store = new TargetsStore('targets-test');
  });
  afterAll(async () => {
    await store.clear();
  });

  it('should store and retrieve', async () => {
    await store.put({ some: 'data', other: 123 });
    const retrieved = await store.get();

    expect(retrieved).toEqual({ some: 'data', other: 123 });
  });
});

describe('LogsStore', () => {
  let clock;
  let store;

  beforeAll(() => {
    clock = fakeTimers.install();
    store = new LogsStore('targets-test');
  });
  afterAll(async () => {
    clock.uninstall();
    await store.clear();
  });

  it('should compute the totals from the stored log entries', async () => {
    clock.setSystemTime(new Date('2020-06-07T17:20Z'));
    await store.addEntry({ energy: 5, protein: 7 });

    clock.setSystemTime(new Date('2020-06-07T17:30Z'));
    await store.addEntry({ energy: 6, protein: 8 });

    const totalsOfRangeWithBoth = await store.getTotals(new Date('2020-06-07T17:20Z'), new Date('2020-06-07T17:30Z'));
    expect(totalsOfRangeWithBoth.energy).toEqual(11);
    expect(totalsOfRangeWithBoth.protein).toEqual(15);

    const totalsOfRangeWithFirst = await store.getTotals(new Date('2020-06-07T17:21Z'), new Date('2020-06-07T17:30Z'));
    expect(totalsOfRangeWithFirst.energy).toEqual(6);
    expect(totalsOfRangeWithFirst.protein).toEqual(8);

    const totalsOfRangeWithNone = await store.getTotals(new Date('2020-06-08T17:21Z'), new Date('2020-06-08T17:30Z'));
    expect(totalsOfRangeWithNone.energy).toEqual(0);
    expect(totalsOfRangeWithNone.protein).toEqual(0);
  });
});
