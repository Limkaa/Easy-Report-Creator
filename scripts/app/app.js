// @ts-expect-error

import { lessons, getReport, messages, default_comment_templates } from './data.js';
import { Classroom, Student } from './models/classroom.js';
import { Templates, Template } from './models/templates.js';

// Students section
let students_list = $('#students-list');
let new_student = $('#new-student-name');
let add_new_student_btn = $('#addNewStudent');
let report_sending_stats = $('#report-sending-stats');
let clear_students_checkboxes = $('#clear-checkboxes-of-students');

// Report info filling section
let name = $('#student-name');
let actual_attendance = $('#actual-attendance');
let expected_attendance = $('#expected-attendance');
let comment = $('#teacher-comment');
let mark = $('#student-mark');
let lessons_list = $('#getcourseLessons');

// Report result section
let report_result = $('#report-result');
let copy_report_btn = $('#copy-report');
let report_symbols_count = $('#report-symbols-count');
let too_much_symbols_warning = $('#too-much-symbols-warning');

// Comment templates management section
let templatesInputGroup = $('#templates-input_group');
let template_select = $('#template-select');
let template_modal = $('#template-manage-modal');
let comment_template_error = $('#comment-template-error');
let comment_template_title = $('#comment-template-title');
let comment_template_text = $('#comment-template-text');
let add_template_btn = $('#add-new-template');
let edit_template_btn = $('#edit-template');
let delete_template_btn = $('#delete-template');
let template_modal_title = $('#template-manage-modal-title');
let save_comment_template_btn = $('#save-comment-template');
let create_comment_template_btn = $('#create-comment-template');
let delete_comment_template_btn = $('#delete-comment-template');
let close_comment_template_btn = $('#close-template-modal');

// other
let help_messages = $('.show-info');

// Modal window for help messages
let help_message_modal_window_title = $('#help-messages-modal-window-title');
let help_message_modal_window_text = $('#help-messages-modal-window-text');

// validators
const validate_NotEmptyText = (...inputs) => inputs.every((inp) => inp != '');

class App {
    constructor() {
        this._classroom = new Classroom();
        this._templates = new Templates({ default_templates: default_comment_templates });
        this._setup();
        this._renderPage();
    }

    _setup() {
        // Configure necessary handlers and other staff

        // students
        add_new_student_btn.on('click', this._addNewStudent.bind(this));
        students_list.on('click', 'i', this._deleteStudent.bind(this));
        students_list.on('change', 'input:checkbox', this._toggleStudentCheck.bind(this));
        clear_students_checkboxes.on('click', this._uncheckAllStudents.bind(this));

        // templates
        templatesInputGroup.on('click', 'button, i', this._renderTemplateModalForm.bind(this));
        template_select.on('change', this._changeTemplate.bind(this));
        create_comment_template_btn.on('click', this._addTemplate.bind(this));
        save_comment_template_btn.on('click', this._updateTemplate.bind(this));
        // delete_comment_template_btn.on('click', this._.bind(this))

        // help, utilities
        help_messages.on('click', this._showHelpMessage);
    }

    _reset() {
        // reset local storage data
        this._classroom.resetLocalStorage();
        this._templates.resetLocalStorage();
        location.reload();
    }

    _renderPage() {
        this._renderClassroom();
        this._renderLessons();
        this._renderTemplates();
    }

    //  STUDENTS LIST SECTION

    _renderClassroom() {
        // render students list
        students_list.empty();
        report_sending_stats.html(this._classroom.getStatisticsHtml());
        students_list.html(this._classroom.getStudentsListHtml());
    }

    _addNewStudent() {
        // add new student
        let name = new_student.val();
        if (name == '') return;
        this._classroom.addStudent(new Student({ name }));
        new_student.val('');
        this._renderClassroom();
    }

    _deleteStudent(e) {
        // delete student
        let id = $(e.target).closest('li').attr('id');
        this._classroom.deleteStudent(id);
        this._renderClassroom();
    }

    _toggleStudentCheck(e) {
        // check or uncheck student
        let id = $(e.target).closest('li').attr('id');
        this._classroom.toggleStudentCheckedStatus(id);
        this._renderClassroom();
    }

    _uncheckAllStudents() {
        // uncheck all students
        this._classroom.uncheckAllStudents();
        this._renderClassroom();
    }

    //  REPORT FILLING SECTION

    _renderLessons() {
        // render lessons list
        lessons_list.empty();
        lessons.forEach((lesson, index) => {
            let html = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="${lesson}" id="lesson${index}" />
                <label class="form-check-label" for="lesson${index}">${lesson}</label>
            </div>`;
            lessons_list.append(html);
        });
    }

    // render templates list
    _renderTemplates() {
        template_select.children().not(':first-child').remove();
        this._templates.objects.forEach((template) => template_select.append(template.getSelectOptionHtml()));
    }

    // render template manage form
    _renderTemplateModalForm(e) {
        let action = $(e.target).attr('data-action');
        let settings = {};

        if (action == 'template-add') {
            settings = { header: 'Новый шаблон комментария', create_btn: true };
        } else {
            let chosenTemplate = this._templates.getTemplateById(template_select.val());
            let id = chosenTemplate.id;
            let title = chosenTemplate.title;
            let text = chosenTemplate.text;

            if (action == 'template-update') {
                settings = { id, header: 'Изменение шаблона комментария', title, text, save_btn: true };
            } else if (action == 'template-delete') {
                let header = `Вы точно хотите удалить шаблон: "${chosenTemplate.title}"?`;
                settings = { id, header, modal_body: false, delete_btn: true };
            }
        }
        this._setupTemplateModalForm(settings);
    }

    // setup template modal form
    _setupTemplateModalForm({
        id = '',
        header = '',
        title = '',
        text = '',
        modal_body = true,
        error_msg = false,
        save_btn = false,
        create_btn = false,
        delete_btn = false,
    } = {}) {
        template_modal.attr('data-template-id', id);
        template_modal_title.text(header);
        comment_template_title.val(title);
        comment_template_text.val(text);
        template_modal.find('.modal-body').css('display', modal_body ? 'block' : 'none');
        comment_template_error.css('display', error_msg ? 'block' : 'none');
        save_comment_template_btn.css('display', save_btn ? 'block' : 'none');
        create_comment_template_btn.css('display', create_btn ? 'block' : 'none');
        delete_comment_template_btn.css('display', delete_btn ? 'block' : 'none');
    }

    // add template
    _addTemplate() {
        let title = comment_template_title.val();
        let text = comment_template_text.val();

        // TODO: render error if not valid
        if (!validate_NotEmptyText(title, text)) return;

        let template = new Template(title, text);
        this._templates.addTemplate(template);
        this._renderTemplates();

        template_select.val(template.id).change();
        close_comment_template_btn.click();
    }

    // update template
    _updateTemplate() {
        let id = template_modal.attr('data-template-id');
        let title = comment_template_title.val();
        let text = comment_template_text.val();

        // TODO: render error if not valid
        if (!validate_NotEmptyText(title, text)) return;

        this._templates.updateTemplate(id, title, text);
        this._renderTemplates();

        template_select.val(id).change();
        close_comment_template_btn.click();
    }

    // delete template

    // select another template
    _setTemplateById(id) {
        let option = template_select.find(`option[value=${id}]`);
        option.siblings().removeAttr('selected');
        option.attr('selected', true);
    }

    // change template
    _changeTemplate(e) {
        console.log($(e.target));
        let value = e.target.value;
        let option = $(`option[value=${value}]`, e.target);
        option.siblings().removeAttr('selected');
        option.attr('selected', true);

        let no_template = value == 0 ? true : false;
        edit_template_btn.attr('disabled', no_template);
        delete_template_btn.attr('disabled', no_template);

        comment.val(no_template ? '' : this._templates.getTemplateById(value).text);
    }

    // generate report

    // clear data in section

    //  REPORT RESULT SECTION

    _showHelpMessage() {
        let type = $(this).attr('data-info-type');
        let message = messages[type];
        help_message_modal_window_title.html(message.title);
        help_message_modal_window_text.html(message.text);
    }
}

const app = new App();
