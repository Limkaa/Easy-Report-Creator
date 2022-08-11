export const templates_storage_key = 'templates';
export const templates_state = {
    templates: [],
    template_chosen: null,
};

export class Template {
    constructor({ id, title, text }) {
        this.id = id ?? 'id' + Math.random().toString(16).slice(2);
        this.title = title ?? 'No template name';
        this.text = text ?? '';
    }

    getSelectOptionHtml() {
        return `<option value="${this.id}">${this.title}</option>`;
    }
}

export class Templates {
    _objects = [];

    constructor({ local_storage_title = 'templates', default_templates = [] }) {
        this._local_storage_title = local_storage_title;
        this._getLocalStorage(default_templates);
    }

    // Set data to local storage
    _setLocalStorage() {
        localStorage.setItem(this._local_storage_title, JSON.stringify(this._objects));
    }

    // Get data from local storage
    _getLocalStorage(default_templates) {
        let data = JSON.parse(localStorage.getItem(this._local_storage_title)) ?? default_templates;
        data.forEach((template) => this._objects.push(new Template(template)));
    }

    // Delete data from local storage
    resetLocalStorage() {
        localStorage.removeItem(this._local_storage_title);
    }

    // Get all templates list as property
    get objects() {
        return this._objects;
    }

    // Get template by id
    getTemplateById(id) {
        let index = this._objects.findIndex((template) => template.id == id);
        let object = this._objects[index];
        return { object, index };
    }

    // Add new template and save data
    addTemplate(template) {
        this._objects.push(template);
        this._setLocalStorage();
        return this;
    }

    updateTemplate(id, title, text) {
        let { index } = this.getTemplateById(id);
        this._objects[index] = { id, title, text };
        this._setLocalStorage();
        return this;
    }

    // Delete template and save data
    deleteTemplate(id) {
        let { index } = this.getTemplateById(id);
        this._objects.splice(index, 1);
        this._setLocalStorage();
        return this;
    }
}
