const sheet = new CSSStyleSheet();
sheet.replaceSync(`
button {
  --padding: 16px;
  --width: 400px;
  width: var(--width);
  padding: var(--padding);
  background: white;
  text-align: inherit;
  font: inherit;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgb(66 66 66 / 0.08),
              0 1px 3px 1px rgb(66 66 66 / 0.16);
}

button:hover {
  background: #fbfbfb;
}

img {
  --gradient-distance: 50px;
  width: var(--width);
  height: 300px;
  object-fit: contain;
  margin: calc(-1 * var(--padding)) calc(-1 * var(--padding)) 0 calc(-1 * var(--padding));
  background: linear-gradient(to right,
                              #eee,
                              white var(--gradient-distance),
                              white calc(var(--width) - var(--gradient-distance)),
                              #eee);
}

#name {
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 2rem;
  margin: 0;
}

#stats {
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 400;
  opacity: 0.6;
}

#stats > li {
  display: inline;
  margin: 0;
  padding: 0;
}

#stats > li:not(:last-of-type)::after {
  content: " / ";
}
`);

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
        <img alt="">
        <p id="name"></p>
        <ul id="stats">
          <li><span class="number"></span> <span class="unit">kcal</span></li>
          <li><span class="number"></span> <span class="unit">g</span></li>
        </ul>
      </button>
    `.trim();
    shadowRoot.adoptedStyleSheets = [sheet];

    this.#img = shadowRoot.querySelector('img');
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
