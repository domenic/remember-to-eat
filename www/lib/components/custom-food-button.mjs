const sheet = new CSSStyleSheet();
sheet.replaceSync(`
:host {
  display: inline-block;
}

button {
  --padding: 16px;
  --width: 300px;
  width: var(--width);
  padding: var(--padding);
  background: white;
  text-align: inherit;
  font: inherit;
  color: inherit;
  border: none;
  border-radius: 4px;
  box-shadow: 0 1px 1px 0 rgb(66 66 66 / 0.08),
              0 1px 3px 1px rgb(66 66 66 / 0.16);
}

button:not(:disabled) {
  cursor: pointer;
}

button:not(:disabled):hover {
  background: #fbfbfb;
}

#placeholder-image {
  --gradient-distance: 50px;
  display: block;
  display: grid;
  place-items: center;
  font-size: 8rem;
  width: var(--width);
  height: 200px;
  object-fit: contain;
  margin: calc(-1 * var(--padding)) calc(-1 * var(--padding)) 0 calc(-1 * var(--padding));
  background: linear-gradient(to right,
                              #eee,
                              white var(--gradient-distance),
                              white calc(var(--width) - var(--gradient-distance)),
                              #eee);
}

button:disabled #placeholder-image {
  color: gray;
}

input {
  font: inherit;
  background: inherit;
  border: none;
  border-bottom: 1px solid #9e9e9e;
}

input[type="number"] {
  width: 5.2ch;
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

class CustomFoodButtonElement extends HTMLElement {
  #button;
  #name;
  #img;
  #energy;
  #protein;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'closed' });
    shadowRoot.innerHTML = `
      <button>
        <span id="placeholder-image">?</span>
        <input id="name" placeholder="Enter a name">
        <ul id="stats">
          <li><input type="number" min="0" placeholder="?"> <span class="unit">kcal</span></li>
          <li><input type="number" min="0" placeholder="?"> <span class="unit">g</span></li>
        </ul>
      </button>
    `.trim();
    shadowRoot.adoptedStyleSheets = [sheet];

    this.#button = shadowRoot.querySelector('button');
    this.#img = shadowRoot.querySelector('#placeholder-image');
    this.#name = shadowRoot.querySelector('#name');
    [this.#energy, this.#protein] = shadowRoot.querySelectorAll('input[type="number"]');

    this.#name.addEventListener('input', () => {
      this.#img.textContent = this.#name.value ? this.#name.value[0] : "?";
    });

    this.#name.addEventListener('input', () => this.#syncDisabled());
    this.#energy.addEventListener('input', () => this.#syncDisabled());
    this.#protein.addEventListener('input', () => this.#syncDisabled());
    this.#syncDisabled();

    this.addEventListener('click', e => {
      if (this.#button.disabled) {
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    });
  }

  get name() {
    return this.#name.value;
  }

  get energy() {
    return this.#energy.valueAsNumber;
  }

  get protein() {
    return this.#protein.valueAsNumber;
  }

  #syncDisabled() {
    const isValid = this.name && this.energy && this.protein;
    this.#button.disabled = !isValid;
  }
}

// Register and remove no-longer-necessary public properties
customElements.define('custom-food-button', CustomFoodButtonElement);
