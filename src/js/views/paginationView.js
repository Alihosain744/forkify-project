import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClickBtnPagination(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goto = +btn.dataset.goto;
      handler(goto);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;

    const numPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );

    // 1) page 1 and there are another pages
    if (curPage === 1 && numPage > 1) {
      return `
    <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    <button class='numResults'> Total Pages = ${numPage} </button>
    `;
    }
    // 2) page 1 and there are no other pages
    if (curPage === 1 && numPage === 1) return '';
    // 3) last pages
    if (curPage === numPage && numPage > 1) {
      return `
    <button data-goto=${curPage - 1} class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${curPage - 1}</span>
    </button>
    <button class='numResults'> Total Pages = ${numPage} </button>
    `;
    }
    // 4) other pages
    if (curPage < numPage) {
      return `
      <button data-goto=${
        curPage - 1
      } class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${curPage - 1}</span>
      </button>

     <button class='numResults'> Total Pages = ${numPage} </button>
    <button data-goto=${curPage + 1} class="btn--inline pagination__btn--next">
      <span>Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>

      `;
    }
  }
}

export default new PaginationView();
