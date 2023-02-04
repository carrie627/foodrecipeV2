// import 'core-js/stable';
import 'core-js/es/array';

import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    // 1: Loading Recipe
    await model.loadRecipe(id);

    // 2: Rendering Recipe
    recipeView.render(model.state.recipe);

    // 3) update bookmarks
    bookmarkView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    //1) Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load Search query
    await model.loadSearchResults(query);

    //3) render search query in console
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination view
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //1) render search query in console
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render pagination view
  paginationView.render(model.state.search);
};

const controlServings = function (updateTo) {
  // Update the recipe servings in state
  model.updateServings(updateTo);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // update recipe view
  recipeView.update(model.state.recipe);

  // Render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarkRender = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    //render Spinner
    addRecipeView.renderSpinner();

    // upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    //change ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
      addRecipeView.clearMsg();
    }, MODAL_CLOSE_SEC * 1000);

    // Render Recipe and bookmarks
    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the application');
};

// Event Handler/Subscriber
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarkRender);
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServings(controlServings);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();
