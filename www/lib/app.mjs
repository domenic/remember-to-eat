import Targets from './targets.mjs';
import computeTimeProgress from './time-progress.mjs';
import * as dataStore from './data-store.mjs';

const ONE_MINUTE = 60 * 1000;

const energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
const proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');
const targets = new Targets('#target-energy', '#target-protein', '#wake-up-time', '#sleep-time');

main();

async function main() {
  await dataStore.initialize();
  await loadData();

  for (const button of document.querySelectorAll('food-button')) {
    button.addEventListener('click', () => {
      energyMeter.current += button.energy;
      proteinMeter.current += button.protein;
      dataStore.logEntryForToday({ name: button.name, energy: button.energy, protein: button.protein });
    });
  }

  targets.addEventListener('change', () => {
    syncMeters();
    dataStore.saveTargets(targets.serialization());
  });

  syncMeters();
  setInterval(syncMeters, ONE_MINUTE);
}

async function loadData() {
  const [todaysEntries, targetsSerialization] = await Promise.all([dataStore.getTodaysLog(), dataStore.getTargets()]);

  for (const entry of todaysEntries) {
    energyMeter.current += entry.energy;
    proteinMeter.current += entry.protein;
  }
  if (targetsSerialization) {
    targets.restoreFromSerialization(targetsSerialization);
  }
}

function syncMeters() {
  const timeProgress = computeTimeProgress(targets.wakeUpTime, targets.sleepTime);
  syncMeter(energyMeter, targets.energy, timeProgress);
  syncMeter(proteinMeter, targets.protein, timeProgress);
}

function syncMeter(meterEl, target, timeProgress) {
  meterEl.nowTarget = timeProgress ? Math.round(target * timeProgress) : null;
  meterEl.dayTarget = target;
}
