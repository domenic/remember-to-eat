const ONE_MINUTE = 60 * 1000;
const ONE_DAY = 24 * 60 * ONE_MINUTE;

export default class ViewModel {
  #currentEnergy = document.querySelector('#current-energy');
  #currentProtein = document.querySelector('#current-protein');
  #targetEnergy = document.querySelector('#target-energy');
  #targetProtein = document.querySelector('#target-protein');
  #energyMeter = document.querySelector('#energy-meter');
  #proteinMeter = document.querySelector('#protein-meter');
  #wakeUpTime = document.querySelector('#wake-up-time');
  #sleepTime = document.querySelector('#sleep-time');

  constructor() {
    this.#syncBothMeters();

    this.#targetEnergy.addEventListener('input', () => this.#syncEnergyMeter());
    this.#targetProtein.addEventListener('input', () => this.#syncProteinMeter());
    this.#wakeUpTime.addEventListener('input', () => this.#syncBothMeters());
    this.#sleepTime.addEventListener('input', () => this.#syncBothMeters());

    setInterval(() => this.#syncBothMeters(), ONE_MINUTE);
  }

  get currentEnergy() {
    return Number(this.#currentEnergy.textContent);
  }
  set currentEnergy(v) {
    this.#currentEnergy.textContent = v;
    this.#syncEnergyMeter();
  }

  get currentProtein() {
    return Number(this.#currentProtein.textContent);
  }
  set currentProtein(v) {
    this.#currentProtein.textContent = v;
    this.#syncProteinMeter();
  }

  get targetEnergy() {
    return this.#targetEnergy.valueAsNumber;
  }

  get targetProtein() {
    return this.#targetProtein.valueAsNumber;
  }

  #syncEnergyMeter(timeProgress = this.#getTimeProgress()) {
    this.#energyMeter.max = this.targetEnergy;
    this.#energyMeter.value = this.currentEnergy;

    const percent = this.currentEnergy / this.targetEnergy * 100;
    this.#energyMeter.style.setProperty('--percent', percent.toFixed(2));
    this.#energyMeter.classList.toggle('full', percent >= 100);

    if (!timeProgress) {
      this.#energyMeter.removeAttribute('optimum');
      this.#energyMeter.style.removeProperty('--optimum-percent');
    } else {
      this.#energyMeter.optimum = Math.round(this.targetEnergy * timeProgress);
      this.#energyMeter.style.setProperty('--optimum-percent', (timeProgress * 100).toFixed(2));
    }
  }

  #syncProteinMeter(timeProgress = this.#getTimeProgress()) {
    this.#proteinMeter.max = this.targetProtein;
    this.#proteinMeter.value = this.currentProtein;

    const percent = this.currentProtein / this.targetProtein * 100;
    this.#proteinMeter.style.setProperty('--percent', percent.toFixed(2));
    this.#proteinMeter.classList.toggle('full', percent >= 100);

    if (!timeProgress) {
      this.#proteinMeter.removeAttribute('optimum');
      this.#proteinMeter.style.removeProperty('--optimum-percent');
    } else {
      this.#proteinMeter.optimum = Math.round(this.targetProtein * timeProgress);
      this.#proteinMeter.style.setProperty('--optimum-percent', (timeProgress * 100).toFixed(2));
    }
  }

  #syncBothMeters() {
    const timeProgress = this.#getTimeProgress();
    this.#syncProteinMeter(timeProgress);
    this.#syncEnergyMeter(timeProgress);
  }

  #getTimeProgress() {
    const offsets = this.#getTimeOffsets();
    if (!offsets) {
      return null;
    }

    const nowOffset = this.#getNowOffset(offsets.wakeUp);

    return Math.min(1, (nowOffset - offsets.wakeUp) / (offsets.sleep - offsets.wakeUp));
  }

  // Returns the number of milliseconds past midnight for the wake-up time and sleep time.
  #getTimeOffsets() {
    const wakeUpDate = this.#wakeUpTime.valueAsDate?.valueOf();
    const rawSleepDate = this.#sleepTime.valueAsDate?.valueOf();

    // Inputs are not in a valid state
    if (!wakeUpDate || !rawSleepDate) {
      return null;
    }

    const sleepDate = rawSleepDate < wakeUpDate ? rawSleepDate + ONE_DAY : rawSleepDate;

    // Right now wakeUpDate and sleepDate are numbers representing milliseconds since midnight UTC
    // on 1970-01-01, since valueAsDate uses 1970-01-01T:00:00:00Z as its base. We want to translate
    // them to be milliseconds-since-midnight (potentially greater than 24 hours if the sleep time
    // is less than the wake-up time, e.g. wake up at 09:00 sleep at 00:30).

    const epoch = (new Date(0)).valueOf();
    return { wakeUp: wakeUpDate - epoch, sleep: sleepDate - epoch };
  }

  // Returns the number of milliseconds past midnight for the current time, assuming that if the
  // current time is before the wakeup time, then we are still working on the previous day. (So e.g.
  // if it is currently 04:00 and wakeUpOffset represents 09:00, this will return 28 hours, not 4.)
  #getNowOffset(wakeUpOffset) {
    const nowDate = Date.now();

    const midnightDate = new Date();
    midnightDate.setHours(0, 0, 0, 0);

    const rawNowOffset = nowDate - midnightDate.valueOf();

    return rawNowOffset < wakeUpOffset ? rawNowOffset + ONE_DAY : rawNowOffset;
  }
}
