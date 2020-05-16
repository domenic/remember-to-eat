import ViewModel from './view-model.mjs';
// Ick; will clean this up soon.
new ViewModel();

const energyMeter = document.querySelector('nutrient-meter[name="Energy"]');
const proteinMeter = document.querySelector('nutrient-meter[name="Protein"]');

for (const button of document.querySelectorAll('food-button')) {
  button.addEventListener('click', () => {
    energyMeter.current += button.energy;
    proteinMeter.current += button.protein;
  });
}
