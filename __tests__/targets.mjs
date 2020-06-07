import Targets from '../www/lib/targets.mjs';

describe('Targets class', () => {
  it('should have getters which reflect the HTML values', () => {
    document.body.innerHTML = `
      <input type="number" id="energy" value="5">
      <input type="number" id="protein" value="10">
      <input type="time" id="wake-up" value="10:00:00">
      <input type="time" id="sleep" value="00:30:00">
    `;

    const targets = new Targets('#energy', '#protein', '#wake-up', '#sleep');

    expect(targets.energy).toEqual(5);
    expect(targets.protein).toEqual(10);
    expect(targets.wakeUpTime).toEqual((new Date('1970-01-01T10:00:00Z')).valueOf());
    expect(targets.sleepTime).toEqual((new Date('1970-01-01T00:30:00Z')).valueOf());
  });

  it('should return the serialization of the HTML values from serialization()', () => {
    document.body.innerHTML = `
      <input type="number" id="energy" value="5">
      <input type="number" id="protein" value="10">
      <input type="time" id="wake-up" value="10:00:00">
      <input type="time" id="sleep" value="00:30:00">
    `;

    const targets = new Targets('#energy', '#protein', '#wake-up', '#sleep');

    expect(targets.serialization()).toEqual({
      energy: 5,
      protein: 10,
      wakeUpTime: (new Date('1970-01-01T10:00:00Z')).valueOf(),
      sleepTime: (new Date('1970-01-01T00:30:00Z')).valueOf()
    });
  });

  it('should set the DOM elements values from restoreFromSerialization()', () => {
    document.body.innerHTML = `
      <input type="number" id="energy" value="5">
      <input type="number" id="protein" value="10">
      <input type="time" id="wake-up" value="10:00:00">
      <input type="time" id="sleep" value="00:30:00">
    `;

    const newEnergy = 15;
    const newProtein = 100;
    const newWakeUpTime = (new Date('1970-01-01T11:00:00Z')).valueOf();
    const newSleepTime = (new Date('1970-01-01T23:00:00Z')).valueOf();
    const newSerialization = {
      energy: newEnergy,
      protein: newProtein,
      wakeUpTime: newWakeUpTime,
      sleepTime: newSleepTime
    };

    let changes = 0;
    const targets = new Targets('#energy', '#protein', '#wake-up', '#sleep');
    targets.addEventListener('change', () => {
      ++changes;
    });

    targets.restoreFromSerialization(newSerialization);

    expect(targets.energy).toEqual(newEnergy);
    expect(targets.protein).toEqual(newProtein);
    expect(targets.wakeUpTime).toEqual(newWakeUpTime);
    expect(targets.sleepTime).toEqual(newSleepTime);
    expect(targets.serialization()).toEqual(newSerialization);
    expect(changes).toEqual(1);

    expect(document.body.querySelector('#energy').valueAsNumber).toEqual(newEnergy);
    expect(document.body.querySelector('#protein').valueAsNumber).toEqual(newProtein);
    expect(document.body.querySelector('#wake-up').valueAsNumber).toEqual(newWakeUpTime);
    expect(document.body.querySelector('#sleep').valueAsNumber).toEqual(newSleepTime);
  });

  it('should fire a change event if any input events happen', () => {
    document.body.innerHTML = `
      <input type="number" id="energy" value="5">
      <input type="number" id="protein" value="10">
      <input type="time" id="wake-up" value="10:00:00">
      <input type="time" id="sleep" value="00:30:00">
    `;

    let changes = 0;
    const targets = new Targets('#energy', '#protein', '#wake-up', '#sleep');
    targets.addEventListener('change', () => {
      ++changes;
    });

    document.querySelector('#energy').dispatchEvent(new Event('input'));
    expect(changes).toEqual(1);

    document.querySelector('#protein').dispatchEvent(new Event('input'));
    expect(changes).toEqual(2);

    document.querySelector('#wake-up').dispatchEvent(new Event('input'));
    expect(changes).toEqual(3);

    document.querySelector('#sleep').dispatchEvent(new Event('input'));
    expect(changes).toEqual(4);
  });
});
