import sharedSheet from './support/shared-food-button-styles.mjs';

const sheet = new CSSStyleSheet();
sheet.replaceSync(`
#image {
  font-size: 8rem;
}

button:disabled #image {
  color: gray;
}

input {
  font: inherit;
  background: inherit;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  outline: none;
}

input:focus {
  border-bottom-color: black;
}

input[type="number"] {
  width: 6ch;
}
`);

const imageTypes = new Set(["image/gif", "image/jpeg", "image/png", "image/svg+xml"]);

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
        <div id="image">?</div>
        <input id="name" placeholder="Enter a name">
        <ul id="stats">
          <li><label><input type="number" min="0" placeholder="?"> kcal</li>
          <li><label><input type="number" min="0" placeholder="?"> g</label></li>
        </ul>
      </button>
    `.trim();
    shadowRoot.adoptedStyleSheets = [sharedSheet, sheet];

    this.#button = shadowRoot.querySelector('button');
    this.#img = shadowRoot.querySelector('#image');
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

    this.#button.addEventListener('click', e => {
      if (e.target.localName === 'input' || e.target.localName === 'label') {
        e.stopImmediatePropagation();
      }
    }, { capture: true });

    this.#makeDropTarget();
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

  #makeDropTarget() {
    this.addEventListener('dragenter', e => {
      if (getImageFromDataTransfer(e.dataTransfer)) {
        e.preventDefault();
      }
    });

    this.addEventListener('dragover', e => {
      e.dataTransfer.dropEffect = getImageFromDataTransfer(e.dataTransfer) ? 'copy' : 'none';
      e.preventDefault();
    });

    this.addEventListener('drop', e => {
      const item = getImageFromDataTransfer(e.dataTransfer);
      if (item) {
        const file = item.getAsFile();
        this.#updateImage(file);
        e.preventDefault();
      }
    });
  }

  #updateImage(file) {
    const url = URL.createObjectURL(file);

    const img = document.createElement('img');
    img.alt = "";
    img.src = url;
    img.id = this.#img.id;
    img.addEventListener('load', () => URL.revokeObjectURL(url));

    this.#img.replaceWith(img);
    this.#img = img;
  }
}

function getImageFromDataTransfer(dataTransfer) {
  for (const item of dataTransfer.items) {
    if (imageTypes.has(item.type)) {
      return item;
    }
  }
  return null;
}

// Register and remove no-longer-necessary public properties
customElements.define('custom-food-button', CustomFoodButtonElement);
