import { lessons, getReport, messages, default_comment_templates } from './data.js';

// Students section
let students_list = $('#students-list');
let new_student = $('#new-student-name');
let add_new_student_btn = $('#addNewStudent');
let report_sending_stats = $('#report-sending-stats');
let clear_checkboxes_of_students = $('#clear-checkboxes-of-students');

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

// Modal window for help messages
let help_message_modal_window_title = $('#help-messages-modal-window-title');
let help_message_modal_window_text = $('#help-messages-modal-window-text');

// Data from localstorage
let students = JSON.parse(localStorage.getItem('students')) || [];
let comment_templates = JSON.parse(localStorage.getItem('templates')) || default_comment_templates;

$(document).ready(function () {
    reloadDataInPage();

    function saveLocalStorage() {
        localStorage.setItem('students', JSON.stringify(students));
        localStorage.setItem('templates', JSON.stringify(comment_templates));
    }

    function reloadDataInPage() {
        renderCommentTemplates();
        renderStudents();
        renderLessons();
    }

    function renderCommentTemplates() {
        template_select.children().not(':first-child').remove();
        comment_templates.forEach((template, index) => {
            let html = `<option value="${index + 1}">${template.title}</option>`;
            template_select.append(html);
        });
    }

    function renderStudents() {
        students_list.empty();
        let left_reports_counter = 0;
        students.forEach((student, index) => {
            let html = `
            <li class="list-group-item d-flex justify-content-between ${
                student.checked && 'list-group-item-success'
            }" id="student-${index}">
                <div>
                    <input class="form-check-input me-1" type="checkbox" value="" ${student.checked && 'checked'}/>
                </div>
                <span class="mx-2 flex-grow-1">${student.name}</span>
                <i class="bi bi-x-circle"></i>
            </li>`;
            student.checked ? students_list.append(html) : students_list.prepend(html);
            left_reports_counter += !student.checked ? 1 : 0;
        });
        report_sending_stats.html(
            `- Всего учеников: ${students.length}<br>- Осталось отправить отчетов: ${left_reports_counter}<br>`
        );
    }

    function renderLessons() {
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

    add_new_student_btn.click(function () {
        let name = new_student.val();
        if (name == '') return;
        students.push({ name: name, checked: false });
        saveLocalStorage();
        renderStudents();
        new_student.val('');
    });

    $(document).on('change', '#students-list input:checkbox', function () {
        let element = $(this).parent().parent();
        let index = element.attr('id').split('-')[1];
        students[index]['checked'] = $(this).prop('checked');
        saveLocalStorage();
        renderStudents();
        element.toggleClass('list-group-item-success');
    });

    $(document).on('click', '#students-list i', function () {
        let element = $(this).parent();
        students.splice(element.attr('id').split('-')[1], 1);
        saveLocalStorage();
        renderStudents();
        element.remove();
    });

    function getLearnedLessons() {
        return lessons_list
            .find('input:checkbox:checked')
            .map(function () {
                return $(this).val();
            })
            .get();
    }

    function clearLearnedLessons() {
        return lessons_list.find('input:checkbox:checked').map(function () {
            $(this).attr('checked', false);
        });
    }

    $('.show-info').on('click', function () {
        let type = $(this).attr('data-info-type');
        let message = messages[type];
        help_message_modal_window_title.html(message.title);
        help_message_modal_window_text.html(message.text);
    });

    $('#createReport').click(function () {
        $('#report-result').val('');
        let report = getReport(
            name.val(),
            comment.val(),
            actual_attendance.val(),
            expected_attendance.val(),
            mark.val(),
            getLearnedLessons()
        );
        report_result.val(report);
        updateReportSymbolsCount();
    });

    $('#clearReportData').click(function () {
        $('#report-result').val('');
        name.val('');
        comment.val('');
        actual_attendance.val('');
        expected_attendance.val('3');
        mark.val('10');
        template_select.val(0).change();
        updateReportSymbolsCount();
        clearLearnedLessons();
    });

    clear_checkboxes_of_students.click(function () {
        students_list.find('input:checkbox:checked').map(function () {
            $(this).attr('checked', false);
            let parent = $(this).parent().parent();
            let index = parent.attr('id').split('-')[1];
            students[index]['checked'] = false;
            parent.toggleClass('list-group-item-success');
        });
        saveLocalStorage();
        renderStudents();
    });

    function toggleManageTemplateButtons(edit_disabled = true, delete_disabled = true) {
        edit_template_btn.attr('disabled', edit_disabled);
        delete_template_btn.attr('disabled', delete_disabled);
    }

    template_select.on('change', function () {
        let option = $('option[value=' + this.value + ']', this);
        option.siblings().removeAttr('selected');
        option.attr('selected', true);

        if (this.value == 0) {
            toggleManageTemplateButtons();
            return comment.val('');
        }

        toggleManageTemplateButtons(false, false);
        comment.val(comment_templates[this.value - 1].text);
    });

    function addCommentTemplate() {
        if (!validateCommentTemplateInfo()) return;
        let new_template = {
            title: comment_template_title.val(),
            text: comment_template_text.val(),
        };
        comment_templates.push(new_template);
        saveLocalStorage();
        renderCommentTemplates();
        template_select.val(comment_templates.length).change();
        close_comment_template_btn.click();
    }

    function updateCommentTemplate() {
        if (!validateCommentTemplateInfo()) return;
        let id = getCurrentCommentTemplateId();
        let title = comment_template_title.val();
        let text = comment_template_text.val();
        comment_templates[id] = { title, text };
        saveLocalStorage();
        renderCommentTemplates();
        template_select.val(id + 1).change();
        close_comment_template_btn.click();
    }

    function deleteCommentTemplate() {
        let id = getCurrentCommentTemplateId();
        comment_templates.splice(id, 1);
        comment.val('');
        saveLocalStorage();
        renderCommentTemplates();
        close_comment_template_btn.click();
        template_select.val(0).change();
    }

    function getCurrentCommentTemplateId() {
        return template_select.find(':selected').val() - 1;
    }

    function validateCommentTemplateInfo() {
        let title = comment_template_title.val();
        let text = comment_template_text.val();
        let permission = title != '' && text != '';
        if (!permission) comment_template_error.css('display', 'block');
        return permission;
    }

    create_comment_template_btn.click(addCommentTemplate);
    save_comment_template_btn.click(updateCommentTemplate);
    delete_comment_template_btn.click(deleteCommentTemplate);
    close_comment_template_btn.click(restoreModalState);

    function restoreModalState() {
        template_modal.find('.modal-body').css('display', 'block');
        comment_template_error.css('display', 'none');
        save_comment_template_btn.css('display', 'none');
        create_comment_template_btn.css('display', 'none');
        delete_comment_template_btn.css('display', 'none');
    }

    add_template_btn.click(function () {
        create_comment_template_btn.css('display', 'block');
        template_modal_title.text('Новый шаблон комментария');
        comment_template_title.val('');
        comment_template_text.val('');
    });

    edit_template_btn.click(function () {
        save_comment_template_btn.css('display', 'block');
        template_modal_title.text('Изменение шаблона комментария');
        let template = comment_templates[getCurrentCommentTemplateId()];
        comment_template_title.val(template.title);
        comment_template_text.val(template.text);
    });

    delete_template_btn.click(function () {
        template_modal.find('.modal-body').css('display', 'none');
        let template = comment_templates[getCurrentCommentTemplateId()];
        delete_comment_template_btn.css('display', 'block');
        template_modal_title.text(`Вы точно хотите удалить шаблон: "${template.title}"?`);
    });

    copy_report_btn.click(function () {
        var $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(report_result.val()).select();
        document.execCommand('copy');
        $temp.remove();
        $('#copied-to-clipboard').css('display', 'block').delay(1500).fadeOut();
    });

    function updateReportSymbolsCount() {
        let count = report_result.val().length;
        report_symbols_count.html(`Символов: ${count}`);
        if (count > 950 && too_much_symbols_warning.css('display') == 'none') {
            too_much_symbols_warning.css('display', 'block');
        } else if (count <= 950 && too_much_symbols_warning.css('display') == 'block') {
            too_much_symbols_warning.css('display', 'none');
        }
    }

    report_result.bind('input propertychange', function () {
        updateReportSymbolsCount();
    });
});
