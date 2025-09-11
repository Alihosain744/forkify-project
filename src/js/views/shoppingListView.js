import View from './view';

class shoppingListView extends View {
  _parentElement = document.querySelector('.shopping-list');
  _shoppingListWindow = document.querySelector('.shoppingList-window');
  _shoppingItem = document.querySelector('.shopping-list__items');
  _shoppingListOverlay = document.querySelector('.overlay-shopping-List');
  _btnCloseShoppingListModal = document.querySelector(
    '.btn--close-shopping-list-modal'
  );

  constructor() {
    super();
    this._addHandlerBtnCloseModal();
  }

  _showModal() {
    this._shoppingListWindow.classList.remove('hidden');
  }
  _hideModal() {
    this._shoppingListWindow.classList.add('hidden');
  }

  _addHandlerBtnCloseModal() {
    this._btnCloseShoppingListModal.addEventListener('click', e => {
      this._hideModal();
    });
  }

  clear() {
    this._shoppingItem.innerHTML = '';
  }
  render(data) {
    this._data = data;

    const markup = this._generateMarkup();
    this.clear();
    this._shoppingItem.insertAdjacentHTML('afterbegin', markup);

    this._showModal(); // automatically show modal when rendered
  }

  _generateMarkup() {
    return this._data
      .map(
        ing => `
          <li class='item'>
           <label class='row'>
            
            <span class="desc">${ing.description}</span>
            <span class="qty">${ing.quantity}</span>
            ${
              ing.unit
                ? `<span class="unit">${ing.unit}</span>`
                : `<span class='unit'>unit not specified</span>`
            }
            
           </label>
          </li>
        `
      )
      .join('');
  }
}

export default new shoppingListView();
