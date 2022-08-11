import * as model from './models/students.js';
import { state } from './storage.js';
import studentsView from './views/studentsView.js';

const controlStudents = function () {
    if (!state.students.length) return studentsView.renderMessage();
    const stats = model.getStatistics();
    const students = model.sortStudentsByChecked();
    studentsView.render({ stats, students });
};

const controlAddStudent = function (name) {
    model.addStudent(name);
    controlStudents();
};

const controlToggleStudentCheckbox = function (id) {
    model.toggleStudentCheck(id);
    controlStudents();
};

const controlDeleteStudent = function (id) {
    model.deleteStudent(id);
    controlStudents();
};

const controlUncheckAllStudents = function () {
    model.uncheckAllStudents();
    controlStudents();
};

const init = function () {
    studentsView.addHandler(studentsView.callbacks.renderView, controlStudents);
    studentsView.addHandler(studentsView.callbacks.addStudent, controlAddStudent);
    studentsView.addHandler(studentsView.callbacks.checkStudent, controlToggleStudentCheckbox);
    studentsView.addHandler(studentsView.callbacks.deleteStudent, controlDeleteStudent);
    studentsView.addHandler(studentsView.callbacks.uncheckAll, controlUncheckAllStudents);
};

init();
