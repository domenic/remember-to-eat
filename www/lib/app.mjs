import Targets from './targets.mjs';
import computeTimeProgress from './time-progress.mjs';
import storage from './kv-storage.mjs';

const ONE_MINUTE = 60 * 1000;

const energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
const proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');
const targets = new Targets('#target-energy', '#target-protein', '#wake-up-time', '#sleep-time');

main();

async function main() {
  for (const button of document.querySelectorAll('food-button')) {
    button.addEventListener('click', () => {
      energyMeter.current += button.energy;
      proteinMeter.current += button.protein;
    });
  }

  targets.addEventListener('change', () => {
    syncMeters();
    save();
  });

  await restore();

  syncMeters();
  setInterval(syncMeters, ONE_MINUTE);
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

async function save() {
  await storage.set('targets', targets.serialization());
}

async function restore() {
  const serialization = await storage.get('targets');
  if (serialization) {
    targets.restoreFromSerialization(serialization);
  }
}
