import View from './view';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was uploaded successfully ;)';
  _window = document.querySelector('.add-recipe-window');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');
  _formElements = this._parentElement.innerHTML;

  constructor() {
    super();

    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _handlerBtnOpen() {
    this._parentElement.innerHTML = this._formElements;
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._handlerBtnOpen.bind(this));
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    this._overlay.addEventListener('click', this._toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();

        /*
        FormData contructor accepts form element as it is argument and return a weired object that we need to 
        convert that into array using spread operator
        this constructor returns the form elements along with related values
        */
        const dataArray = [...new FormData(e.target)];

        const ingredients = dataArray
          .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
          .map(ing => {
            // const ingsArr = ing[1].replaceAll(' ', '').split(',');

            const ingsArr = ing[1].split(',').map(el => el.trim());
            if (ingsArr.length !== 3)
              throw new Error(
                'Invalid ingredients format, Please use correct format'
              );

            const [quantity, unit, description] = ingsArr;

            return { quantity: quantity ? +quantity : null, unit, description };
          });

        // (?: ....) is just like parethesis, but it doesn't store the match for further use, this is called non
        // capturing group

        // . any character, but if we wish to add a real dot then we escape it with \.

        const number = /^[0-9]{1,4}(?:\.[0-9]{1,3})?$/;
        const onlyLetter = /^[A-Za-z]{3,}$/;

        let hasError = false;

        ingredients.forEach((ing, i) => {
          if (ing.quantity === null) {
            this.renderError(`Ingredient ${i + 1}: Quantity is required.`);
            hasError = true;
            return;
          }
          if (!number.test(ing.quantity.toString())) {
            this.renderError(
              `Ingredient ${
                i + 1
              }: Quantity must be 1–3 digits (optionally with decimals).`
            );
            hasError = true;
            return;
          }

          if (ing.description.trim() === '') {
            this.renderError(`Ingredient ${i + 1}: Description is required.`);
            hasError = true;
            return;
          }
          if (!onlyLetter.test(ing.description)) {
            this.renderError(
              `Ingredient ${
                i + 1
              }: Description must be letters only (min 3 characters).`
            );
            hasError = true;
            return;
          }
        });

        // Only submit if no errors
        if (hasError) return;

        handler(Object.fromEntries(dataArray));

        /*
      Object.fromEntries convert an array to object 
      */
        // handler(Object.fromEntries(dataArray));
      }.bind(this)
    );
  }
}

export default new AddRecipeView();
