import getTimeProgress from './time-progress.mjs';

const ONE_MINUTE = 60 * 1000;

export default class ViewModel {
  #targetEnergy = document.querySelector('#target-energy');
  #targetProtein = document.querySelector('#target-protein');
  #wakeUpTime = document.querySelector('#wake-up-time');
  #sleepTime = document.querySelector('#sleep-time');
  #energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
  #proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');

  constructor() {
    this.#syncBothMeters();

    this.#targetEnergy.addEventListener('input', () => this.#syncEnergyMeter());
    this.#targetProtein.addEventListener('input', () => this.#syncProteinMeter());
    this.#wakeUpTime.addEventListener('input', () => this.#syncBothMeters());
    this.#sleepTime.addEventListener('input', () => this.#syncBothMeters());

    setInterval(() => this.#syncBothMeters(), ONE_MINUTE);
  }

  get targetEnergy() {
    return this.#targetEnergy.valueAsNumber;
  }

  get targetProtein() {
    return this.#targetProtein.valueAsNumber;
  }

  #syncEnergyMeter(timeProgress = this.#getTimeProgress()) {
    this.#energyMeter.dayTarget = this.targetEnergy;

    if (!timeProgress) {
      this.#energyMeter.nowTarget = null;
    } else {
      this.#energyMeter.nowTarget = Math.round(this.targetEnergy * timeProgress);
    }
  }

  #syncProteinMeter(timeProgress = this.#getTimeProgress()) {
    this.#proteinMeter.dayTarget = this.targetProtein;

    if (!timeProgress) {
      this.#proteinMeter.nowTarget = null;
    } else {
      this.#proteinMeter.nowTarget = Math.round(this.targetProtein * timeProgress);
    }
  }

  #syncBothMeters() {
    const timeProgress = this.#getTimeProgress();
    this.#syncProteinMeter(timeProgress);
    this.#syncEnergyMeter(timeProgress);
  }

  #getTimeProgress() {
    return getTimeProgress(this.#wakeUpTime.valueAsDate, this.#sleepTime.valueAsDate);
  }
}
