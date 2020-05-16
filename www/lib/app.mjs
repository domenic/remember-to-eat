import ViewModel from './view-model.mjs';

const vm = new ViewModel();

for (const button of document.querySelectorAll('food-button')) {
  button.addEventListener('click', () => {
    vm.currentEnergy += button.energy;
    vm.currentProtein += button.protein;
  });
}
