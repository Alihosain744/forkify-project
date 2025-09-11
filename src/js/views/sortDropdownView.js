import View from './view';

class SortDropdownView extends View {
  _parentElement = document.querySelector('.sort-container');

  render() {
    this._clear();
    const markup = `
    <div class="sort">
      <label for="sort">Sort By:</label>
      <select id="sort">
        <option value="unsorted">Remain Unsorted</option>
        <option value="time-asc">Cooking Time ↑</option>
        <option value="time-desc">Cooking Time ↓</option>
        <option value="ingredients-asc">Ingredients ↑</option>
        <option value="ingredients-desc">Ingredients ↓</option>
      </select>
    </div>
    `;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerSort(handler) {
    this._parentElement.addEventListener('change', function (e) {
      const select = e.target.closest('select');
      if (!select) return;

      const value = select.value; // e.g. "time-asc", "ingredients-desc", "unsorted"

      if (value === 'unsorted') {
        handler('unsorted', null); // send both args
      } else {
        const [criteria, order] = value.split('-');
        handler(criteria, order);
      }
    });
  }

  clear() {
    this._clear();
  }
}

export default new SortDropdownView();
