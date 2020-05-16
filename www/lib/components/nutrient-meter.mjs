const sheet = new CSSStyleSheet();
sheet.replaceSync(`
#nutrient {
  display: grid;
  text-align: center;
  position: relative;
  padding: 60px 40px;
}

#number {
  font-size: 2.92rem;
  display: inline-block;
  text-align: right;
}

#unit {
  font-size: smaller;
  color: gray;
}

meter {
  --size: 180px;
  --background-color: #ebeff0;
  --optimal-background-color: #ddd;
  --color: #3ccc71;

  position: absolute;
  top: 0;
  left: calc(50% - var(--size) / 2);
  z-index: -1;
  appearance: none;
  width: var(--size);
  height: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(
    var(--optimal-background-color) calc(var(--optimum-percent) * 1%),
    0,
    var(--background-color)
  );
  border-radius: 50%;
}

meter.full {
  --color: var(--full-color);
}

meter::before {
  content: "";
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 94%;
  width: 94%;
  border-radius: 50%;
}

meter::after {
  content: "";
  position: absolute;
  top: 0;
  left: calc(50% - var(--size) / 2);
  z-index: -1;
  width: var(--size);
  height: var(--size);
  display: flex;
  align-items: center;
  justify-content: center;
  background: conic-gradient(var(--color) calc(var(--percent) * 1%), 0, transparent);
  border-radius: 50%;
}
`);

class NutrientMeterElement extends HTMLElement {
  #name;
  #number;
  #unit;
  #meter;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = `
      <p id="nutrient">
        <span id="name"></span>
        <span>
          <span id="number">0</span>
          <span id="unit"></span>
        </span>
        <meter></meter>
      </p>
    `.trim();
    shadowRoot.adoptedStyleSheets = [sheet];

    this.#name = shadowRoot.querySelector('#name');
    this.#number = shadowRoot.querySelector('#number');
    this.#unit = shadowRoot.querySelector('#unit');
    this.#meter = shadowRoot.querySelector('meter');
  }

  // Logic

  #syncMeter() {
    const { current, dayTarget, nowTarget } = this;

    this.#meter.value = current;
    this.#meter.max = dayTarget;

    if (nowTarget === null) {
      this.#meter.removeAttribute('optimum');
    } else {
      this.#meter.optimum = nowTarget;
    }

    this.#meter.classList.toggle('full', current >= dayTarget);

    this.#setMeterCSSPropertyIffNonNaN('--percent', current / dayTarget * 100);
    this.#setMeterCSSPropertyIffNonNaN('--optimum-percent', nowTarget / dayTarget * 100);
  }

  #setMeterCSSPropertyIffNonNaN(cssProperty, value) {
    if (!Number.isNaN(value)) {
      this.#meter.style.setProperty(cssProperty, value);
    } else {
      this.#meter.style.removeProperty(cssProperty);
    }
  }

  // Custom element glue

  static observedAttributes = ['name', 'unit', 'daytarget', 'nowtarget', 'current'];

  attributeChangedCallback(name, oldValue, newValue, namespace) {
    if (namespace !== null) {
      return;
    }

    switch (name) {
      case 'name': {
        this.#name.textContent = newValue;
        break;
      }
      case 'unit': {
        this.#unit.textContent = newValue;
        break;
      }
      case 'daytarget':
      case 'nowtarget': {
        this.#syncMeter();
        break;
      }
      case 'current': {
        this.#number.textContent = newValue;
        this.#syncMeter();
        break;
      }
    }
  }

  // Reflection getters/setters

  get name() {
    return this.getAttributeNS(null, 'name');
  }
  set name(value) {
    return this.setAttributeNS(null, 'name', value);
  }

  get unit() {
    return this.getAttributeNS(null, 'unit');
  }
  set unit(value) {
    return this.setAttributeNS(null, 'unit', value);
  }

  get dayTarget() {
    const value = Number(this.getAttributeNS(null, 'daytarget'));
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set dayTarget(value) {
    value = value < 0 || Number.isNaN(value) ? 0 : value;
    this.setAttributeNS(null, 'daytarget', value);
  }

  get nowTarget() {
    const attrValue = this.getAttributeNS(null, 'nowtarget');
    if (attrValue === null) {
      return null;
    }

    const value = Number(attrValue);
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set nowTarget(value) {
    if (value === null) {
      this.removeAttributeNS(null, 'nowtarget');
      return;
    }

    value = value < 0 || Number.isNaN(value) ? 0 : value;
    this.setAttributeNS(null, 'nowtarget', value);
  }

  get current() {
    const value = Number(this.getAttributeNS(null, 'current'));
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set current(value) {
    value = value < 0 || Number.isNaN(value) ? 0 : value;
    this.setAttributeNS(null, 'current', value);
  }
}

// Register and remove no-longer-necessary public properties
customElements.define('nutrient-meter', NutrientMeterElement);
delete NutrientMeterElement.observedAttributes;
delete NutrientMeterElement.prototype.attributeChangedCallback;
