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
- Share styles between `food-button` and `custom-food-button`.
  - Probably should not have interactive children of a `<button>` in custom-food-button...

## Features

- Remember last custom entry? Seems like a good MVP.
- Multiple custom food entries.
- Removing the custom food image (resetting to the letter).
- Help setting targets (e.g. from RDA, from "bro science" 1 mg/lb rule, from age/height/weight)
  - Pairs well with the idea of moving targets to another tab
- Meal history page (with, e.g., day totals). Probably today should be expanded, others initially-collapsed.

## Styling

- Dark mode!? (Forced white backgrounds are a problem, again.)
- Mobile friendly (in particular making the food buttons show up elsewhere so that the app fits in a single screen).
  - Maybe move targets to a tab or something. On desktop too?

## Productionization

- Add a feature detection interstitial, perhaps with details in the about page.
