import { VIEW_MESSAGE_SHOW_DURATION } from '../config.js';

export default class View {
    _data;

    // * Render the view
    render(data, render = true) {
        if (!data) return this.renderError();

        this._data = data;
        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clear();
        this._parentElement.append(markup);
    }

    // * Update only change parts of the markup
    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = $($.parseHTML(newMarkup));
        const newElements = newDOM.toArray();
        const curElements = this._parentElement.toArray();

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // Updates changed TEXT
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                curEl.textContent = newEl.textContent;
            }

            // Updates changed ATTRIBUES
            if (!newEl.isEqualNode(curEl) && newEl.attributes)
                Array.from(newEl.attributes).forEach((attr) => curEl.setAttribute(attr.name, attr.value));
        });
    }

    // * Fully clear parent markup
    _clear() {
        this._parentElement.empty();
    }

    // * Render error if something goes wrong
    renderMessage(type = 'secondary', message = this._errorMessage, clear_view = true, fadeout = false) {
        const markup = $($.parseHTML(`<div class="alert alert-${type}" role="alert">${message}</div>`));
        if (clear_view) this._clear();
        this._parentElement.prepend(markup);
        if (fadeout) {
            markup.delay(VIEW_MESSAGE_SHOW_DURATION).fadeOut();
            setTimeout(() => markup.remove(), VIEW_MESSAGE_SHOW_DURATION + 1000);
        }
    }
}
