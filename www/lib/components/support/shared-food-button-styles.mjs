const sheet = new CSSStyleSheet();
sheet.replaceSync(`
:host {
  display: inline-block;
}

*,
*::before,
*::after {
  box-sizing: border-box;
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

#image {
  --gradient-distance: 50px;
  display: grid;
  place-items: center;
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

#name {
  width: 100%;
  font-weight: 500;
  font-size: 1.25rem;
  line-height: 2rem;
  margin: 0;
  height: 32px;
}

#stats {
  list-style-type: none;
  margin: 0;
  padding: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  height: 23px;
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

export default sheet;
