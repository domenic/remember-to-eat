## Persistence

- Persist targets
- Persist a day's worth of entries
  - Allow undoing or resetting
  - Show a log of what has been logged so far
- Reset with button? Reset automatically at midpoint between sleep and wakeup time?

## Code

- Refactor. `view-model.mjs` is pretty hairy.
  - Preact + HTM?
  - Some of the computations seem very "reactive"; maybe MobX?
- Write tests. The time logic is a good candidate.

## Features

- Custom entry (kcal/protein text fields)
- Remember last custom entry? Seems like a good MVP.
- Actual customization of buttons, with images, etc.

## Styling

- Fix the pea protein image size issue. Container div might work (to avoid editing the images).
- Style the buttons better. Challenge is how to make something clearly a button with a forced-white background.
- Dark mode!? (Forced white backgrounds are a problem, again.)
- Mobile friendly.
- Add a title or header or something.
