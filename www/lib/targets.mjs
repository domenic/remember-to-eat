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
    this.#wakeUpTime.valueAsDate = new Date(serialization.wakeUpTime);
    this.#sleepTime.valueAsDate = new Date(serialization.sleepTime);
  }

  get energy() {
    return this.#targetEnergy.valueAsNumber;
  }
  get protein() {
    return this.#targetProtein.valueAsNumber;
  }
  get wakeUpTime() {
    return Number(this.#wakeUpTime.valueAsDate);
  }
  get sleepTime() {
    return Number(this.#sleepTime.valueAsDate);
  }

  #changed() {
    this.dispatchEvent(new Event('change'));
  }
}
