import { async } from 'regenerator-runtime';
import {
  API_URL,
  RESULT_PER_PAGE,
  API_KEY,
  SPOONACULAR_API_KEY,
} from './config';
// import { getJSON, sendJSON } from './helper';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  shoppingList: [],
  search: {
    query: '',
    results: [],
    page: 1,
    resultPerPage: RESULT_PER_PAGE,
    originalResults: [],
  },
  recipeAssignment: {
    Monday: null,
    Tuesday: null,
    Wednesday: null,
    Thursday: null,
    Friday: null,
    Saturday: null,
    Sunday: null,
  },
  bookmarks: [],
};

// reformat recipeObject data
const createRecipeObject = function (data) {
  let { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    /**
     * this is the trick which we can add properties to objects conditionally
     * if recipe.key is exist then return ...{key:recipe.key}, it is as if we add
     * another property called key: recipe.key to the rest of the whole properties
     *  */
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    /* when loading a recipe, if there is one recipe in the bookmarks array that is equal to the recipe that is currently loaded
    then set the current recipe bookmarked property to true, otherwise set the current recipe bookmarked
    property as false
    */
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });

    state.search.originalResults = [...state.search.results]; // keep original copy of the search result

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// this method will add cookingTime and numIngredients properties for the search result
// that will further use for sorting
export const enrichResults = async function () {
  // For each recipe in search results
  await Promise.all(
    state.search.results.map(async result => {
      // If it doesn’t already have cookingTime, fetch details
      if (!result.cookingTime) {
        const data = await AJAX(`${API_URL}/${result.id}?key=${API_KEY}`);
        const recipe = data.data.recipe;

        // Add the missing properties
        result.cookingTime = recipe.cooking_time;
        result.numIngredients = recipe.ingredients.length;
      }
    })
  );
};
// this method will used to sort the search result based on special criteria and order
export const sortResults = function (criteria, order) {
  if (criteria === 'unsorted') {
    // restore original order
    state.search.results = [...state.search.originalResults];
    return;
  }

  const factor = order === 'asc' ? 1 : -1;

  state.search.results.sort((a, b) => {
    if (criteria === 'ingredients') {
      return (a.numIngredients - b.numIngredients) * factor;
    }
    if (criteria === 'time') {
      return (a.cookingTime - b.cookingTime) * factor;
    }
    return 0;
  });
};

//
/*
this method returns then search results based on page number, for page 1 it returns the first ten 
search results, for page 2 it returns the second ten search result 
*/
export const getSearchResultPage = function (page = state.search.page) {
  // current page
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; // for page 1 start is equal to 0
  const end = page * state.search.resultPerPage; // for page 1 end is equal to 10

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
    // newQT = oldQT * newServing / oldServings
  });

  state.recipe.servings = newServing;
};

const persistBookmark = function () {
  localStorage.setItem('bookmark', JSON.stringify(state.bookmarks));
};

/*
this is a common pattern in programming that when adding something we pass the entire data for 
the add function.
but for deleting something we only pass the id for the deletiion function.
*/

// turn the current recipe as bookmarked
export const addBookMark = function (recipe) {
  //1)  add bookmark
  state.bookmarks.push(recipe);

  //2) mark the current recipe as bookmarked
  /*
  if the the recipe id that is loaded currently is equal to the recipe id which we pass to be bookmarked
  then add a bookmarked = true property for that recipe
  */
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
};

// delete bookmark for the current recipe that is loaded

export const deleteBookMark = function (id) {
  /*
  fi the current recipe is already bookmarked then delete that from bookmarks array
  */
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  /*
  mark the current recipe as not bookmarked
  */
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
};

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
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

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const addIngredientsToShoppingList = function (ingredients) {
  state.shoppingList = [...ingredients];
};

export const getRecipeNutrition = async function (ingredients, servings = 1) {
  const ingredientLines = ingredients.map(
    ing => `${ing.quantity} ${ing.unit} ${ing.description}`
  );

  const bodyData = `ingredientList=${encodeURIComponent(
    ingredientLines.join('\n')
  )}&servings=${servings}&includeNutrition=true`;

  const data = await AJAX(
    `https://api.spoonacular.com/recipes/parseIngredients?apiKey=${SPOONACULAR_API_KEY}`,
    bodyData,
    true // form mode
  );
  return data;
};

const init = function () {
  const storage = localStorage.getItem('bookmark');

  // JSON.parse convert a string to an object
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();
