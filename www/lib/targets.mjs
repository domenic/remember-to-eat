export default class Targets extends EventTarget {
  #targetEnergy;
  #targetProtein;
  #wakeUpTime;
  #sleepTime;

  constructor(targetEnergySelector, targetProteinSelector, wakeUpTimeSelector, sleepTimeSelector) {
    super();

    this.#targetEnergy = document.querySelector(targetEnergySelector);
    this.#targetProtein = document.querySelector(targetProteinSelector);
    this.#wakeUpTime = document.querySelector(wakeUpTimeSelector);
    this.#sleepTime = document.querySelector(sleepTimeSelector);

    this.#targetEnergy.addEventListener('input', () => this.#changed());
    this.#targetProtein.addEventListener('input', () => this.#changed());
    this.#wakeUpTime.addEventListener('input', () => this.#changed());
    this.#sleepTime.addEventListener('input', () => this.#changed());
  }

  serialization() {
    return {
      energy: this.energy,
      protein: this.protein,
      wakeUpTime: this.wakeUpTime,
      sleepTime: this.sleepTime
    };
  }

  restoreFromSerialization(serialization) {
    this.#targetEnergy.valueAsNumber = serialization.energy;
    this.#targetProtein.valueAsNumber = serialization.protein;
    this.#wakeUpTime.valueAsNumber = serialization.wakeUpTime;
    this.#sleepTime.valueAsNumber = serialization.sleepTime;
    this.#changed();
  }

  get energy() {
    return this.#targetEnergy.valueAsNumber;
  }
  get protein() {
    return this.#targetProtein.valueAsNumber;
  }
  get wakeUpTime() {
    return this.#wakeUpTime.valueAsNumber;
  }
  get sleepTime() {
    return this.#sleepTime.valueAsNumber;
  }

  #changed() {
    this.dispatchEvent(new Event('change'));
  }
}
