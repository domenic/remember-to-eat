import ViewModel from './view-model.mjs';

const vm = new ViewModel();

for (const button of document.querySelectorAll('#food button')) {
  button.addEventListener('click', () => {
    const energy = Number(button.querySelector('[data-nutrient="energy"]').textContent);
    const protein = Number(button.querySelector('[data-nutrient="protein"]').textContent);

    vm.currentEnergy += energy;
    vm.currentProtein += protein;
  });
}
