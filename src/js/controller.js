import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

import * as model from './model.js';

import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import sortDropdownView from './views/sortDropdownView.js';
import shoppingListView from './views/shoppingListView.js';
import { async } from 'regenerator-runtime';
import nutritionView from './views/nutritionView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

// https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886

// this is subscriber: the code that wants to react
const controlRecipes = async function () {
  try {
    //0- update resultsView to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //1- loading recipe
    recipeView.renderSpinner();

    /*
    this will take id from url
    */

    const id = window.location.hash.slice(1);

    if (!id) window.location.hash = '5ed6604591c37cdc054bc886';

    // update bookmarks to highlight the selected one
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    //2- rendering recipe

    recipeView.render(model.state.recipe);
    updateCalendarUI();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1- get query
    const query = searchView.getQuery();
    if (!query) return;

    // 2- load search result
    await model.loadSearchResults(query);
    const results = model.state.search.results;

    // 3- render search results

    // resultsView.render(model.state.search.results);

    if (results.length > 1) {
      resultsView.render(model.getSearchResultPage());
      sortDropdownView.render();
    } else {
      sortDropdownView.clear();
    }

    //4- render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPaginationBtns = function (goto) {
  // render new results in the search results view
  resultsView.render(model.getSearchResultPage(goto));

  // render pagination buttons in the pagination view
  paginationView.render(model.state.search);
};

const controlServings = function (newServing) {
  // 1) update servings in the state
  model.updateServings(newServing);
  //2) update recipeView
  // recipeView.render(model.state.recipe);

  // 2) update recipeView

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // add the current recipe as bookmarked whenever the user clicks on the bookmark button
  // if the current recipe is not bookmarked then add bookmark to that else delete bookmark for that
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);

  // update the recipeView to only change the bookmark icon
  recipeView.update(model.state.recipe);

  // render bookmarkview
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  // render bookmarkview
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);

  try {
    // render spinner

    addRecipeView.renderSpinner();

    // upload recipe data
    await model.uploadRecipe(newRecipe);

    // success message
    addRecipeView.renderSuccessMessage();

    // render bookmark
    bookmarksView.render(model.state.bookmarks);

    // change the URL ID to the ID of newly uploaded recipe
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // render uploaded recipe to the recipe View
    recipeView.render(model.state.recipe);
    updateCalendarUI();
    // hide the form

    setTimeout(() => {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const controlSort = async function (criteria, order) {
  try {
    if (criteria !== 'unsorted') {
      // fetch missing details only if we need sorting
      await model.enrichResults();
    }

    // pass both args (order might be null for unsorted)
    model.sortResults(criteria, order);

    resultsView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlAddToShoppingList = function () {
  // 1) Add ingredients to state
  model.addIngredientsToShoppingList(model.state.recipe.ingredients);

  // 2) Render shopping list modal with data

  shoppingListView.render(model.state.shoppingList);
};

const controlAssignRecipe = function (day) {
  if (!day) return;

  /*
   Save to model, the currently loaded recipe title is stored in the model which is model.state.recipeAssign
   ment, based on the chosen dropdown menu value that comes from the select element.

   */

  model.state.recipeAssignment[day] = model.state.recipe.title;

  // Update UI
  updateCalendarUI();
};

const updateCalendarUI = function () {
  Object.entries(model.state.recipeAssignment).forEach(([day, recipe]) => {
    // targetP refers to the p element inside of calender menu bar
    const targetP = document.querySelector(`#${day} p`);
    if (!targetP) return;
    targetP.innerText = recipe ? recipe : '-';
  });
};

const controlRecipeNutrition = async function () {
  const nutritionData = await model.getRecipeNutrition(
    model.state.recipe.ingredients,
    model.state.recipe.servings
  );
  nutritionView.render(nutritionData);
};

const init = function () {
  // when the page load it render the bookmarks
  bookmarksView.addHandlerRender(controlBookmark);
  // passing the subscirber controlRecipes for the publisher addHandlerRender
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClickBtnPagination(controlPaginationBtns);
  sortDropdownView.addHandlerSort(controlSort);

  addRecipeView.addHandlerUpload(controlAddRecipe);

  recipeView.addHandlerAddToShoppingList(controlAddToShoppingList);
  recipeView.addHandlerAssignRecipe(controlAssignRecipe);
  recipeView.addHandlerShowNutrition(controlRecipeNutrition);
  console.log('Welcome ');
};
init();
