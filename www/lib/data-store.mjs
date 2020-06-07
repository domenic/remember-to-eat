import { openDB, deleteDB } from 'https://unpkg.com/idb?module';

export class TargetsStore {
  static #objectStore = 'targets';
  static #key = 'targets';
  #dbName;
  #db;

  constructor(dbName) {
    this.#dbName = dbName;
  }

  async put(data) {
    await this.#ensureDBOpened();
    return this.#db.put(TargetsStore.#objectStore, data, TargetsStore.#key);
  }

  async get() {
    await this.#ensureDBOpened();
    return this.#db.get(TargetsStore.#objectStore, TargetsStore.#key);
  }

  async clear() {
    await this.#db.close();
    return deleteDB(this.#dbName);
  }

  async #ensureDBOpened() {
    if (this.#db) {
      return;
    }

    this.#db = await openDB(this.#dbName, 1, {
      upgrade(db) {
        db.createObjectStore(TargetsStore.#objectStore);
      }
    });
  }
}

export class LogsStore {
  static #objectStore = 'logs';
  static #key = 'instant';
  #dbName;
  #db;

  constructor(dbName) {
    this.#dbName = dbName;
  }

  async getTotals(startDate, endDate) {
    await this.#ensureDBOpened();

    const entries = await this.#db.getAll(LogsStore.#objectStore, IDBKeyRange.bound(startDate, endDate));

    let totalEnergy = 0;
    let totalProtein = 0;
    for (const { energy, protein } of entries) {
      totalEnergy += energy;
      totalProtein += protein;
    }

    return { energy: totalEnergy, protein: totalProtein };
  }

  async addEntry(entry) {
    await this.#ensureDBOpened();

    const now = new Date();
    const tzOffset = now.getTimezoneOffset();
    return this.#db.add(LogsStore.#objectStore, { ...entry, [LogsStore.#key]: now, tzOffset });
  }

  async clear() {
    await this.#db.close();
    return deleteDB(this.#dbName);
  }

  async #ensureDBOpened() {
    if (this.#db) {
      return;
    }

    this.#db = await openDB(this.#dbName, 1, {
      upgrade(db) {
        db.createObjectStore(LogsStore.#objectStore, { keyPath: LogsStore.#key });
      }
    });
  }
}
