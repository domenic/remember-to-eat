import computeTimeProgress from './time-progress.mjs';

const ONE_MINUTE = 60 * 1000;

const energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
const proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');
const targetEnergy = document.querySelector('#target-energy');
const targetProtein = document.querySelector('#target-protein');
const wakeUpTime = document.querySelector('#wake-up-time');
const sleepTime = document.querySelector('#sleep-time');

for (const button of document.querySelectorAll('food-button')) {
  button.addEventListener('click', () => {
    energyMeter.current += button.energy;
    proteinMeter.current += button.protein;
  });
}

targetEnergy.addEventListener('input', syncMeters);
targetProtein.addEventListener('input', syncMeters);
wakeUpTime.addEventListener('input', syncMeters);
sleepTime.addEventListener('input', syncMeters);

syncMeters();
setInterval(syncMeters, ONE_MINUTE);

function syncMeters() {
  const timeProgress = getTimeProgress();
  syncMeter(energyMeter, targetEnergy, timeProgress);
  syncMeter(proteinMeter, targetProtein, timeProgress);
}

function syncMeter(meterEl, targetEl, timeProgress) {
  meterEl.nowTarget = timeProgress ? Math.round(targetEl.valueAsNumber * timeProgress) : null;
  meterEl.dayTarget = targetEl.valueAsNumber;
}

function getTimeProgress() {
  return computeTimeProgress(wakeUpTime.valueAsDate, sleepTime.valueAsDate);
}
