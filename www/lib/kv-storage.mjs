const DEFAULT_STORAGE_AREA_NAME = 'default';
const DEFAULT_IDB_STORE_NAME = 'store';

export class StorageArea {
  #databaseName;
  #databasePromise;
  #backingStoreObject;

  constructor(name) {
    this.#databaseName = `kv-storage:${name}`;
  }

  async set(key, value) {
    return this.#performDatabaseOperation('readwrite', (transaction, store) => {
      if (value === undefined) {
        store.delete(key);
      } else {
        store.put(value, key);
      }

      return promiseForTransaction(transaction);
    });
  }

  async get(key) {
    return this.#performDatabaseOperation('readonly', (transaction, store) => {
      return promiseForRequest(store.get(key));
    });
  }

  async delete(key) {
    return this.#performDatabaseOperation('readwrite', (transaction, store) => {
      store.delete(key);
      return promiseForTransaction(transaction);
    });
  }

  async clear() {
    if (!this.#databasePromise) {
      // Don't try to delete, and clear the promise, while we're opening the database; wait for that first.
      try {
        await this.#databasePromise;
      } catch (e) {
        // If the database failed to initialize, then that's fine, we'll still try to delete it.
      }

      this.#databasePromise = undefined;
    }

    return promiseForRequest(self.indexedDB.deleteDatabase(this.#databaseName));
  }

  get backingStore() {
    if (!this.#backingStoreObject) {
      this.#backingStoreObject = Object.freeze({
        database: this.#databaseName,
        store: DEFAULT_IDB_STORE_NAME,
        version: 1,
      });
    }

    return this.#backingStoreObject;
  }

  async #performDatabaseOperation(mode, steps) {
    if (this.#databasePromise === undefined) {
      this.#initializeDatabasePromise();
    }

    const database = await this.#databasePromise;
    const transaction = database.transaction(DEFAULT_IDB_STORE_NAME, mode);
    const store = transaction.objectStore(DEFAULT_IDB_STORE_NAME);

    return steps(transaction, store);
  }

  #initializeDatabasePromise() {
    this.#databasePromise = new Promise((resolve, reject) => {
      const request = self.indexedDB.open(this.#databaseName, 1);

      request.onsuccess = () => {
        const database = request.result;

        if (!checkDatabaseSchema(database, this.#databaseName, reject)) {
          return;
        }

        database.onclose = () => this.#databasePromise = undefined;
        database.onversionchange = () => {
          database.close();
          this.#databasePromise = undefined;
        };
        resolve(database);
      };

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = () => {
        try {
          request.result.createObjectStore(DEFAULT_IDB_STORE_NAME);
        } catch (e) {
          reject(e);
        }
      };
    });
  }

}

export default new StorageArea(DEFAULT_STORAGE_AREA_NAME);

function checkDatabaseSchema(database, databaseName, reject) {
  if (database.objectStoreNames.length !== 1) {
    reject(new DOMException(
        `KV storage database "${databaseName}" corrupted: there are ` +
            `${database.objectStoreNames.length} object stores, instead of ` +
            `the expected 1.`,
        'InvalidStateError'));
    return false;
  }

  if (database.objectStoreNames[0] !== DEFAULT_IDB_STORE_NAME) {
    reject(new DOMException(
        `KV storage database "${databaseName}" corrupted: the object store ` +
            `is named "${database.objectStoreNames[0]}" instead of the ` +
            `expected "${DEFAULT_IDB_STORE_NAME}".`,
        'InvalidStateError'));
    return false;
  }

  const transaction = database.transaction(DEFAULT_IDB_STORE_NAME, 'readonly');
  const store = transaction.objectStore(DEFAULT_IDB_STORE_NAME);

  if (store.autoIncrement !== false || store.keyPath !== null || store.indexNames.length !== 0) {
    reject(new DOMException(
        `KV storage database "${databaseName}" corrupted: the ` +
            `"${DEFAULT_IDB_STORE_NAME}" object store has a non-default ` +
            `schema.`,
        'InvalidStateError'));
    return false;
  }

  return true;
}

function promiseForRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function promiseForTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}
