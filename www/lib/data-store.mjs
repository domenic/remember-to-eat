import { openDB } from 'https://unpkg.com/idb?module';

let logsDB;
let targetsDB;

export async function initialize() {
  [logsDB, targetsDB] = await Promise.all([openLogsDB(), openTargetsDB()]);
}

export function getTodaysLog() {
  const today = dateStringFromDayOffset(0);
  return logsDB.getAll(today);
}

export function logEntryForToday(entry) {
  const today = dateStringFromDayOffset(0);
  return logsDB.add(today, entry);
}

export function saveTargets(serialization) {
  return targetsDB.put('targets', serialization, 'targets');
}

export function getTargets() {
  return targetsDB.get('targets', 'targets');
}

function openLogsDB() {
  const today = dateStringFromDayOffset(0);
  return openDB('logs-by-day', today, {
    upgrade(newDB) {
      const daysToKeep = new Set([dateStringFromDayOffset(-1), today, dateStringFromDayOffset(1)]);
      for (const store of newDB.objectStoreNames) {
        if (!daysToKeep.has(store)) {
          newDB.deleteObjectStore(store);
        }
      }
      if (!newDB.objectStoreNames.contains(today)) {
        newDB.createObjectStore(today, { autoIncrement: true });
      }
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

function dateStringFromDayOffset(offset) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return String(date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate());
}
