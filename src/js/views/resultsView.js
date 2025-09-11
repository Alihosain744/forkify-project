import View from './view';
import previewView from './previewView';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query, please try again';

  _generateMarkup() {
    // here we set the second arg of the render method to false in order to return string
    // otherwise it will return markup that would cause problem

    return this._data
      .map(searchResult => previewView.render(searchResult, false))
      .join('');
  }

  // _generateMarkupPreview(result) {
  //   const id = window.location.hash.slice(1);

  //   return `
  //   <li class="preview">
  //       <a class="preview__link ${
  //         result.id === id ? 'preview__link--active' : ''
  //       }" href="#${result.id}">
  //           <figure class="preview__fig">
  //               <img src="${result.image}" alt="${result.title}" />
  //           </figure>
  //           <div class="preview__data">
  //               <h4 class="preview__title">${result.title}</h4>
  //               <p class="preview__publisher">${result.publisher}</p>
  //           </div>
  //       </a>
  //    </li>
  //   `;
  // }
}

export default new ResultsView();
