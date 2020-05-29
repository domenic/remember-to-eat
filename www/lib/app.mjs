import Targets from './targets.mjs';
import { progress, boundsOfToday } from './time.mjs';
import * as dataStore from './data-store.mjs';

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;

const energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
const proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');
const targets = new Targets('#target-energy', '#target-protein', '#wake-up-time', '#sleep-time');

main();

async function main() {
  await dataStore.initialize();
  await loadTargets();
  await setTotalsFromDataStoreAndTargets();

  for (const button of document.querySelectorAll('food-button')) {
    button.addEventListener('click', () => {
      energyMeter.current += button.energy;
      proteinMeter.current += button.protein;
      dataStore.addLogEntry({ name: button.name, energy: button.energy, protein: button.protein });
    });
  }

  targets.addEventListener('change', () => {
    syncMeters();
    dataStore.saveTargets(targets.serialization());
    setTotalsFromDataStoreAndTargets();
  });

  syncMeters();
  setInterval(syncMeters, ONE_MINUTE);

  // This will reset the totals when we cross over the "midpoint" between sleep and wake up times. Because this should
  // be happening while the user is asleep, it's not important to be precise. Being precise would be annoying since
  // we'd have to update the timer every time the wake up/sleep times change.
  setInterval(setTotalsFromDataStoreAndTargets, ONE_HOUR);
}

async function loadTargets() {
  const targetsSerialization = await dataStore.getTargets();
  if (targetsSerialization) {
    targets.restoreFromSerialization(targetsSerialization);
  }
}

async function setTotalsFromDataStoreAndTargets() {
  const totals = await dataStore.getTotals(...boundsOfToday(targets.wakeUpTime, targets.sleepTime));
  energyMeter.current = totals.energy;
  proteinMeter.current = totals.protein;
}

function syncMeters() {
  const timeProgress = progress(targets.wakeUpTime, targets.sleepTime);
  syncMeter(energyMeter, targets.energy, timeProgress);
  syncMeter(proteinMeter, targets.protein, timeProgress);
}

function syncMeter(meterEl, target, timeProgress) {
  meterEl.nowTarget = timeProgress ? Math.round(target * timeProgress) : null;
  meterEl.dayTarget = target;
}
