import sharedSheet from './support/shared-food-button-styles.mjs';

class FoodButtonElement extends HTMLElement {
  #img;
  #name;
  #energy;
  #protein;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = `
      <button>
        <img id="image" alt="">
        <p id="name"></p>
        <ul id="stats">
          <li><span class="number"></span> <span class="unit">kcal</span></li>
          <li><span class="number"></span> <span class="unit">g</span></li>
        </ul>
      </button>
    `.trim();
    shadowRoot.adoptedStyleSheets = [sharedSheet];

    this.#img = shadowRoot.querySelector('#image');
    this.#name = shadowRoot.querySelector('#name');
    [this.#energy, this.#protein] = shadowRoot.querySelectorAll('.number');
  }

  // Custom element glue

  static observedAttributes = ['imagesrc', 'imagewidth', 'imageheight', 'name', 'energy', 'protein'];

  attributeChangedCallback(name, oldValue, newValue, namespace) {
    if (namespace !== null) {
      return;
    }

    switch (name) {
      case 'imagesrc': {
        this.#img.src = newValue;
        break;
      }
      case 'imagewidth': {
        this.#img.width = newValue;
        break;
      }
      case 'imageheight': {
        this.#img.height = newValue;
        break;
      }
      case 'name': {
        this.#name.textContent = newValue;
        break;
      }
      case 'energy': {
        this.#energy.textContent = newValue;
        break;
      }
      case 'protein': {
        this.#protein.textContent = newValue;
        break;
      }
    }
  }

  // Reflection getters/setters

  get imageSrc() {
    return new URL(this.getAttributeNS(null, 'imagesrc'), document.baseURI).href;
  }
  set imageSrc(value) {
    this.setAttributeNS(null, 'imagesrc', value);
  }

  get imageWidth() {
    const value = Math.trunc(Number(this.getAttributeNS(null, 'imagewidth')));
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set imageWidth(value) {
    value = value < 0 || Number.isNaN(value) ? 0 : Math.trunc(value);
    this.setAttributeNS(null, 'imagewidth', value);
  }

  get imageHeight() {
    const value = Math.trunc(Number(this.getAttributeNS(null, 'imageheight')));
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set imageHeight(value) {
    value = value < 0 || Number.isNaN(value) ? 0 : Math.trunc(value);
    this.setAttributeNS(null, 'imageheight', value);
  }

  get name() {
    return this.getAttributeNS(null, 'name');
  }
  set name(value) {
    return this.setAttributeNS(null, 'name', value);
  }

  get energy() {
    const value = Number(this.getAttributeNS(null, 'energy'));
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set energy(value) {
    value = value < 0 || Number.isNaN(value) ? 0 : value;
    this.setAttributeNS(null, 'energy', value);
  }

  get protein() {
    const value = Number(this.getAttributeNS(null, 'protein'));
    return value < 0 || Number.isNaN(value) ? 0 : value;
  }
  set protein(value) {
    value = value < 0 || Number.isNaN(value) ? 0 : value;
    this.setAttributeNS(null, 'protein', value);
  }
}

// Register and remove no-longer-necessary public properties
customElements.define('food-button', FoodButtonElement);
delete FoodButtonElement.observedAttributes;
delete FoodButtonElement.prototype.attributeChangedCallback;
