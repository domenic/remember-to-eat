const ONE_MINUTE = 60 * 1000;
const ONE_DAY = 24 * 60 * ONE_MINUTE;

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
