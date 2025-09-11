import icons from 'url:../../img/icons.svg';

// View is parent class for different sort of views
export default class View {
  _data;

  // update method change a part of dom not all, instead of re rendering all dom it re render
  // only the changed part

  /*
  in another word, the update method generates a new markUp from existing markup that is living in memmory
  and  then compare the new generated markup with the existing one, if there is changes between new generated
  markup and existing markup, then it will update the existing markup with new markup changes.
  
  */
  update(data) {
    this._data = data;
    const newMarkUp = this._generateMarkup();
    /*this converts the newMarkup string into dom object that is living in the memeory*/
    const newDom = document.createRange().createContextualFragment(newMarkUp);
    /* Array.from converts an array like structure into an array like nodeList */
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newElem, i) => {
      const curElem = curElements[i];
      /*isEqualNode returns true if two nodes have the same textContent, same type, same attributea and values 
      and order and same child nodes.
      nodeValue attribute of a node returns the textContent of a Text node and null if the node is an element

      here the condition tells if the newElem textContent is not equal to the curElem textContent and 
      newElem first child text content is not empty then select that.
      */

      // update changed Text
      if (
        !newElem.isEqualNode(curElem) &&
        newElem.firstChild?.nodeValue.trim() !== ''
      ) {
        /*curElem is the element which is present in the page right now*/
        curElem.textContent = newElem.textContent;
      }

      // update changed attributes
      // set the new elements attributes to cureElem attributes
      if (!newElem.isEqualNode(curElem)) {
        Array.from(newElem.attributes).forEach(attr => {
          /*
          for exampe data-update-to = 7
          if newElem attribute is different than curElem attribute, then set the newElem attr 
          to curElem attr.
          */
          curElem.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markUp = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>`;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderError(message = this._errorMessage) {
    const markUp = `
             <div class="error">
                <div>
                  <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                  </svg>
                </div>
                <p>${message}</p>
              </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSuccessMessage(message = this._successMessage) {
    const markUp = `
        <div class="message">
          <div>
            <svg>
              <use href="${icons}#icon-smile"></use>
            </svg>
          </div>
         <p>${message}</p>
      </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markUp = this._generateMarkup();

    // if render is false then return the markUp which is string that we need it further
    // otherwise generate the markUp and insert that in the DOM, not a string
    if (!render) return markUp;
    // clean recipeContainer before adding any new element
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markUp);
  }
}
