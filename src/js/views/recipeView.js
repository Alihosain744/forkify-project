// importing icons in parcel 2 add a url: then path
/* this is the path of our icons file before bundling that in turn it gives us the path
of icons file after bundling with parcel*/
import icons from 'url:../../img/icons.svg';
// console.log(icons);
import View from './view';

import Fraction from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'we could not found recipe, please try another one';
  _successMessage = '';

  _generateMarkup() {
    return `
    <h1 class='calender-heading'>Weekly Meal Planning Calender</h1>
    <div class='calender'>
      <div class="calender-day" id="Monday"><h3>Monday</h3><p>-</p></div>
      <div class="calender-day" id="Tuesday"><h3>Tuesday</h3><p>-</p></div>
      <div class="calender-day" id="Wednesday"><h3>Wednesday</h3><p>-</p></div>
      <div class="calender-day" id="Thursday"><h3>Thursday</h3><p>-</p></div>
      <div class="calender-day" id="Friday"><h3>Friday</h3><p>-</p></div>
      <div class="calender-day" id="Saturday"><h3>Saturday</h3><p>-</p></div>
      <div class="calender-day" id="Sunday"><h3>Sunday</h3><p>-</p></div>
    </div>

    <figure class="recipe__fig">
    <img src="${this._data.image}" class='recipe__img' alt="${
      this._data.title
    }" />
    <h1 class="recipe__title">
    
      <span>${this._data.title}</span>
    </h1> 
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this._data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
  </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this._data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--update-servings" data-update-to=${
          this._data.servings - 1
        } >
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--update-servings" data-update-to=${
          this._data.servings + 1
        } >
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
     <svg>
       <use href="${icons}#icon-user"></use>
     </svg>
    </div>
    
    
    <button class='add-to-shoppingList'>
      <svg>
        <use href="${icons}#icon-plus-circle"></use>  
      </svg>
      <span>ADD TO SHOPPING LIST</span>
    </button>
    

    <button class="btn--round btn--bookmark">
      <svg class="">
        <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
      </svg>
    </button>
  </div>

<div class=assignment-wrapper >
  <div class='recipe-assignment'>
    <h1>Assign Recipe</h1>
    <select class='day'>
      <option value=''>ASSIGN TO DAY</option>
      <option value='Monday'>Monday</option>
      <option value='Tuesday'>Tuesday</option>
      <option value='Wednesday'>Wednesday</option>
      <option value='Thursday'>Thursday</option>
      <option value='Friday'>Friday</option>
      <option value='Saturday'>Saturday</option>
      <option value='Sunday'>Sunday</option>
    </select>
    </div>

    <div class='nutrition-data-btn'>
      <button class="show-nutrition-data">
        <svg >
          <use href="${icons}#icon-info"></use>  
        </svg>
        <span>show recipe nutrition data</span> 
      </button>
    </div>
</div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">

    ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      

      
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this._data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this._data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="src/img/icons.svg#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  }

  addHandlerShowNutrition(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.show-nutrition-data');
      if (!btn) return;
      handler();
    });
  }

  addHandlerAssignRecipe(handler) {
    this._parentElement.addEventListener('change', e => {
      const selectEl = e.target.closest('select.day'); // make sure it’s a <select> with class "day"
      if (!selectEl) return;
      const day = selectEl.value;
      if (!day) return;
      handler(day);
    });
  }

  addHandlerAddToShoppingList(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.add-to-shoppingList');

      if (!btn) return;
      handler(); // delegate to controller
    });
  }

  addHandlerRender(handler) {
    // publisher is the code that knows when to react.
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addHandlerUpdateServing(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      const updateTo = +btn.dataset.updateTo;
      if (updateTo > 0) handler(updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;

      handler();
    });
  }

  _generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                ing.quantity ? Fraction(ing.quantity) : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
              </div>
        </li>`;
  }
}

export default new RecipeView();
// implementing bookmark part 1 minute 14
