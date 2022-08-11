import { default_comment_templates } from './data.js';

export const state = {
    students: [],
    templates: [],
    template_chosen: null,
};

const storageItem = function (key, default_value) {
    return {
        key,
        default_value,
    };
};

const students = storageItem('students', []);
const templates = storageItem('templates', default_comment_templates);

const getStorageItem = function ({ key, default_value }) {
    return JSON.parse(localStorage.getItem(key)) ?? default_value;
};

const setStorageItem = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
};

export const persistStorage = function () {
    setStorageItem(students.key, state.students);
    setStorageItem(templates.key, state.templates);
};

const clearStorage = function () {
    localStorage.clear(students.key);
    localStorage.clear(templates.key);
};

const init = function () {
    state.students = getStorageItem(students);
    state.templates = getStorageItem(templates);
};

// Uncomment if necessary, clears whole localStorage
// clearStorage()

init();
