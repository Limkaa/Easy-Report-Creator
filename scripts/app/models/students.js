import { state, persistStorage } from '../storage.js';

export const addStudent = function (name) {
    if (!name || typeof name !== 'string') return null;
    let student = {
        id: 'id' + Math.random().toString(16).slice(2),
        name: name ?? 'Name not specified',
        checked: false,
    };
    state.students.unshift(student);
    persistStorage();
    return student;
};

export const getStudent = function (id) {
    if (!id || typeof id !== 'string') return null;
    const index = state.students.findIndex((el) => el.id === id);
    const object = state.students[index];
    return { object, index };
};

export const deleteStudent = function (id) {
    if (!id || typeof id !== 'string') return null;
    const { object, index } = getStudent(id);
    state.students.splice(index, 1);
    persistStorage();
    return object;
};

export const toggleStudentCheck = function (id) {
    if (!id || typeof id !== 'string') return null;
    const { object, index } = getStudent(id);
    state.students[index] = { ...object, checked: !object.checked };
    persistStorage();
    return object;
};

export const uncheckAllStudents = function () {
    state.students.forEach((el) => (el.checked = false));
    persistStorage();
};

export const sortStudentsByChecked = function (checked_first = false) {
    return state.students.sort((x, y) => (checked_first ?? false ? y.checked - x.checked : x.checked - y.checked));
};

export const filterStudents = function (checked = true) {
    return state.students.filter((el) => el.checked === checked ?? true);
};

export const getStatistics = function () {
    const total = state.students.length;
    const checked = filterStudents().length;
    const unchecked = total - checked;
    return { total, checked, unchecked };
};
