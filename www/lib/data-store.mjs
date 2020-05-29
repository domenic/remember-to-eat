import { openDB } from 'https://unpkg.com/idb?module';

let logsDB;
let targetsDB;

export async function initialize() {
  [logsDB, targetsDB] = await Promise.all([openLogsDB(), openTargetsDB()]);
}

export async function getTotals(startDate, endDate) {
  const entries = await logsDB.getAll('logs', IDBKeyRange.bound(startDate, endDate));

  let totalEnergy = 0;
  let totalProtein = 0;
  for (const { energy, protein } of entries) {
    totalEnergy += energy;
    totalProtein += protein;
  }

  return { energy: totalEnergy, protein: totalProtein };
}

export function addLogEntry(entry) {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset();
  return logsDB.add('logs', { ...entry, instant: now, tzOffset });
}

export function saveTargets(serialization) {
  return targetsDB.put('targets', serialization, 'targets');
}

export function getTargets() {
  return targetsDB.get('targets', 'targets');
}

function openLogsDB() {
  return openDB('logs', 1, {
    upgrade(newDB) {
      newDB.createObjectStore('logs', { keyPath: 'instant' });
    }
  });
}

function openTargetsDB() {
  return openDB('targets', 1, {
    upgrade(newDB) {
      newDB.createObjectStore('targets');
    }
  });
}
