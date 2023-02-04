import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _pervBtn(page, icons) {
    return `
      <button data-goto="${page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}/img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page ${page - 1}</span>
      </button>
    `;
  }

  _nextBtn(page, icons) {
    return `
      <button data-goto="${page + 1}" class="btn--inline pagination__btn--next">
        <svg class="search__icon">
          <use href="${icons}/img/icons.svg#icon-arrow-left"></use>
        </svg>
        <span>Page ${page + 1}</span>
      </button>
    `;
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._nextBtn(curPage);
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._pervBtn(curPage);
    }
    // page > 1, and page < last page(other pages)
    if (curPage > 1 && curPage < numPages) {
      return `
      ${this._pervBtn(curPage)}
      ${this._nextBtn(curPage)}
      `;
    }
    // Only page 1
    return '';
  }
}

export default new PaginationView();

/*****************************************************************************************
 * // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return `
        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // Last page
    if (curPage === numPages && numPages > 1) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}/img/icons.svg#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
      `;
    }
    // page > 1, and page < last page(other pages)
    if (curPage > 1 && curPage < numPages) {
      return `
        <button data-goto="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}/img/icons.svg#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>

        <button data-goto="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}/img/icons.svg#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }
    // Only page 1
    return '';
 * 
 * *********************************************************************/
