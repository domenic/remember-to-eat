# Remember to Eat Roadmap

## Persistence

- Allow undoing or resetting. Undo in a toast?
- Reset with button?
- Maybe this should all be done in the meal history page.

## Code

- Consider a real framework? E.g. Preact + HTM?
- Write more tests. Unclear what to do about web components and especially the reflection boilerplate.
  - Maybe make a mini-library (code generation library?) for reflected properties. Ehhh.
- Explore snowpack if you end up wanting any dependencies.
- Figure out a way to get linting actually working.

## Features

- Custom entry (name/kcal/protein text fields)
- Remember last custom entry? Seems like a good MVP.
- Actual customization of buttons, with images, etc.
- Help setting targets (e.g. from RDA, from "bro science" 1 mg/lb rule, from age/height/weight)
  - Pairs well with the idea of moving targets to another tab
- Meal history page (with, e.g., day totals). Probably today should be expanded, others initially-collapsed.

## Styling

- Dark mode!? (Forced white backgrounds are a problem, again.)
- Mobile friendly (in particular making the food buttons show up elsewhere so that the app fits in a single screen).
  - Maybe move targets to a tab or something. On desktop too?

## Productionization

- Generate PNG icons for Android. [pwa-asset-generator](https://www.npmjs.com/package/pwa-asset-generator) looks wel-maintained.
- Add a feature detection interstitial, perhaps with details in the about page.
