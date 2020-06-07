import { TargetsStore } from '../www/lib/data-store.mjs';

describe('TargetsStore', () => {
  it('should store and retrieve', async () => {
    const store = new TargetsStore('targets');

    await store.put({ some: 'data', other: 123 });
    const retrieved = await store.get();

    expect(retrieved).toEqual({ some: 'data', other: 123 });
  });
});
