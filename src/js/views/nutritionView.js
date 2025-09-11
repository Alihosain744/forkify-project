import View from './view';

class shoppingListView extends View {
  _parentElement = document.querySelector('.nutrition-data');
  _nutritionDataWindow = document.querySelector('.nutrition-data-window');
  _nutritionTable = document.querySelector('.nutrition-table');
  _nutritionDataOverlay = document.querySelector('.overlay-nutrition-data');
  _btnCloseNutritionDataModal = document.querySelector(
    '.btn--close-nutrition-data-modal'
  );

  constructor() {
    super();
    this._addHandlerBtnCloseModal();
  }

  _showModal() {
    this._nutritionDataWindow.classList.remove('hidden');
  }
  _hideModal() {
    this._nutritionDataWindow.classList.add('hidden');
  }

  _addHandlerBtnCloseModal() {
    this._btnCloseNutritionDataModal.addEventListener('click', e => {
      this._hideModal();
    });
  }

  clear() {
    const rows = Array.from(this._nutritionTable.querySelectorAll('tr'));
    if (rows.length === 0) return; // nothing to do

    // keep the first row, remove the rest
    rows.slice(1).forEach(row => row.remove());
  }
  render(data) {
    this._data = data;

    // first clear, then generate Markup.
    this.clear();
    const markup = this._generateMarkup();

    this._nutritionTable.insertAdjacentHTML('beforeend', markup);

    this._showModal(); // automatically show modal when rendered
  }

  _generateMarkup() {
    // 1️⃣ Calculate total calories
    const totalCalories = this._data.reduce((sum, ingNutrition) => {
      const calObj = ingNutrition.nutrition.nutrients.find(
        n => n.name === 'Calories'
      );
      return sum + (calObj ? calObj.amount : 0);
    }, 0);

    // 2️⃣ Generate rows for each ingredient
    const ingredientRows = this._data
      .map(ingNutrition => {
        const calObj = ingNutrition.nutrition.nutrients.find(
          n => n.name === 'Calories'
        );

        return `
          <tr>
            <td>${ingNutrition.name}</td>
            <td>${ingNutrition.amount} ${ingNutrition.unit}</td>
            <td>
              ${ingNutrition.nutrition.nutrients
                .map(n => `${n.name}: ${n.amount} ${n.unit}`)
                .join('<br>')}
            </td>
            <td>${calObj ? calObj.amount : 0}</td>
            <td>${calObj ? calObj.unit : ''}</td>
          </tr>
        `;
      })
      .join('');

    // 3️⃣ Add total calories row at the end
    const totalRow = `
      <tr class="total-row">
        <td colspan="3" ><strong>Total Calories:</strong></td>
        <td colspan="2">${totalCalories.toFixed(2)} kcal</td>
      </tr>
    `;

    // 4️⃣ Return combined markup
    return ingredientRows + totalRow;
  }

  //   _generateMarkup() {
  //     return this._data
  //       .map(
  //         ingNutrition => `
  //         <tr>
  //           <td>${ingNutrition.name}</td>
  //           <td>${ingNutrition.amount} ${ingNutrition.unit} </td>
  //           <td>
  //           ${ingNutrition.nutrition.nutrients
  //             .map(n => `${n.name}: ${n.amount} ${n.unit}`)
  //             .join('</br>')}
  //           </td>
  //           <td>
  //           ${
  //             ingNutrition.nutrition.nutrients.find(n => n.name === 'Calories')
  //               .amount
  //           }

  //           </td>
  //           <td>${
  //             ingNutrition.nutrition.nutrients.find(n => n.name === 'Calories')
  //               .unit
  //           }</td>
  //         </tr>
  //         `
  //       )
  //       .join('');
  //   }
  // }
}

export default new shoppingListView();
