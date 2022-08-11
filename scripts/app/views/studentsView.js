import View from './View.js';

class StudentsView extends View {
    _parentElement = $('#student-list');
    _errorMessage = 'Вы еще не добавили ни одного ученика';
    _message = '';

    elements = {
        studentForm: $('#form__new-student'),
        // studentForm_name: this.studentForm.find('input[name="name"]'),
        studentForm_name: console.log(this),
        studentForm_addBtn: this.elements.studentForm.find('button'),
        studentCheckbox: this._parentElement.find('input:checkbox'),
        studentDeleteBtn: this._parentElement.find('i'),
        clearAllCheckboxesBtn: this._parentElement.find('.clear-checkboxes'),
    };

    actions = {
        renderView: {
            addHandler: (handler) => $(document).ready(handler),
        },
        addStudent: {
            addHandler: (handler) => {
                this.elements.studentForm_addBtn.on('click', function () {
                    handler(this.elements.studentForm_name.val());
                    this.elements.studentForm_name.val('');
                });
            },
        },
        checkStudent: {
            eventType: 'change',
            element: this.elements.studentCheckbox,
            function: (handler) => handler(),
        },
        deleteStudent: {
            eventType: 'click',
            element: this.elements.studentDeleteBtn,
            function: (handler) => handler(),
        },
        uncheckAll: {
            eventType: 'click',
            element: this.elements.clearAllCheckboxesBtn,
            function: (handler) => handler(),
        },
    };

    clearNewStudentForm() {}

    addHandler(callback, handler) {
        if (this.callbacks[callback]) console.error(`Student view callback "${callback}" is not defined`);
        let self = this;

        let action = this.callbacks[callback];
        switch (callback) {
            case action.callback:
                break;
            case action.callback:
                $(document).ready(handler);
                break;

            default:
                break;
        }
        if (callback == this.callbacks.renderView) {
            $(document).ready(handler);
        } else if (callback == this.callbacks.uncheckAll) {
            studentList.on('click', '.clear-checkboxes', handler);
        } else if (callback == this.callbacks.addStudent) {
            newStudentForm.on('submit', function (e) {
                e.preventDefault();
                if (!newStudentForm_name.val()) return self.renderMessage('danger', 'Впишите имя ученика', false, true);
                handler(newStudentForm_name.val());
                newStudentForm_name.val('');
            });
        } else if (callback == this.callbacks.checkStudent) {
            studentList.on('click', 'input:checkbox', function () {
                handler($(this).closest('li').attr('id'));
            });
        } else if (callback == this.callbacks.deleteStudent) {
            studentList.on('click', 'i', function () {
                handler($(this).closest('li').attr('id'));
            });
        }
    }

    _generateMarkup() {
        // prettier-ignore
        const students = this._data.students.map((student) => /*html*/ `
            <li class="list-group-item d-flex justify-content-between align-items-center ${student.checked && 'list-group-item-success'}" id="${student.id}">
                <input class="form-check-input" type="checkbox" ${student.checked && 'checked'} style="min-width:1em"/>
                <div class="mx-3 flex-grow-1 d-inline-block text-truncate" title="${student.name}">${student.name}</div>
                <i class="bi bi-x-circle"></i>
            </li>`).join('');

        return /*html*/ `
            <div class="text-muted small">
                <div>- Всего учеников: ${this._data.stats.total}</div>
                <div>- Отправлено отчетов: ${this._data.stats.checked}</div>
                <div>- Осталось отправить отчетов: ${this._data.stats.unchecked}</div>
            </div>
            <div class="list-group mt-2" id="students-list">${students}</div>
            <button type="button" class="clear-checkboxes btn btn-sm btn-outline-secondary mt-3">
                Снять выделение у всех
            </button>
        `;
    }
}

export default new StudentsView();
