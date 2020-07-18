export default class Targets extends EventTarget {
  #targetEnergy;
  #targetProtein;
  #wakeUpTime;
  #lastMealTime;

  constructor(targetEnergySelector, targetProteinSelector, wakeUpTimeSelector, lastMealTimeSelector) {
    super();

    this.#targetEnergy = document.querySelector(targetEnergySelector);
    this.#targetProtein = document.querySelector(targetProteinSelector);
    this.#wakeUpTime = document.querySelector(wakeUpTimeSelector);
    this.#lastMealTime = document.querySelector(lastMealTimeSelector);

    this.#targetEnergy.addEventListener('input', () => this.#changed());
    this.#targetProtein.addEventListener('input', () => this.#changed());
    this.#wakeUpTime.addEventListener('input', () => this.#changed());
    this.#lastMealTime.addEventListener('input', () => this.#changed());
  }

  serialization() {
    return {
      energy: this.energy,
      protein: this.protein,
      wakeUpTime: this.wakeUpTime,
      lastMealTime: this.lastMealTime
    };
  }

  restoreFromSerialization(serialization) {
    this.#targetEnergy.valueAsNumber = serialization.energy;
    this.#targetProtein.valueAsNumber = serialization.protein;
    this.#wakeUpTime.valueAsNumber = serialization.wakeUpTime;
    this.#lastMealTime.valueAsNumber = serialization.lastMealTime;
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
  get lastMealTime() {
    return this.#lastMealTime.valueAsNumber;
  }

  #changed() {
    this.dispatchEvent(new Event('change'));
  }
}
