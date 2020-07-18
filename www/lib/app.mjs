import Targets from './targets.mjs';
import { progress, boundsOfToday } from './time.mjs';
import { LogsStore, TargetsStore } from './data-store.mjs';

const ONE_MINUTE = 60 * 1000;
const ONE_HOUR = 60 * ONE_MINUTE;

const logsStore = new LogsStore('logs');
const targetsStore = new TargetsStore('targets');

const energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
const proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');
const targets = new Targets('#target-energy', '#target-protein', '#wake-up-time', '#last-meal-time');

main();

async function main() {
  disableDropping();

  await loadTargets();
  await setTotalsFromDataStoreAndTargets();

  document.body.classList.add('loaded');

  for (const button of document.querySelectorAll('food-button, custom-food-button')) {
    button.addEventListener('click', () => {
      energyMeter.current += button.energy;
      proteinMeter.current += button.protein;
      logsStore.addEntry({ name: button.name, energy: button.energy, protein: button.protein });
    });
  }

  targets.addEventListener('change', () => {
    syncMeters();
    targetsStore.put(targets.serialization());
    setTotalsFromDataStoreAndTargets();
  });

  syncMeters();
  setInterval(syncMeters, ONE_MINUTE);

  // This will reset the totals when we cross over the "midpoint" between last meal and wake up times. Because this
  // should be happening while the user is asleep, it's not important to be precise. Being precise would be annoying
  // since we'd have to update the timer every time the wake up/last meal times change.
  setInterval(setTotalsFromDataStoreAndTargets, ONE_HOUR);
}

async function loadTargets() {
  const targetsSerialization = await targetsStore.get();
  if (targetsSerialization) {
    targets.restoreFromSerialization(targetsSerialization);
  }
}

async function setTotalsFromDataStoreAndTargets() {
  const totals = await logsStore.getTotals(...boundsOfToday(targets.wakeUpTime, targets.lastMealTime));
  energyMeter.current = totals.energy;
  proteinMeter.current = totals.protein;
}

function syncMeters() {
  const timeProgress = progress(targets.wakeUpTime, targets.lastMealTime);
  syncMeter(energyMeter, targets.energy, timeProgress);
  syncMeter(proteinMeter, targets.protein, timeProgress);
}

function syncMeter(meterEl, target, timeProgress) {
  meterEl.nowTarget = timeProgress ? Math.round(target * timeProgress) : null;
  meterEl.dayTarget = target;
}

// Disables dropping, except on the <custom-food-button>. This avoids near-misses causing the confusing experience of
// opening the dropped file in the browser.
function disableDropping() {
  window.addEventListener('dragenter', e => e.preventDefault());
  window.addEventListener('dragover', e => {
    if (e.target.localName !== 'custom-food-button') {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'none';
    }
  });
}
