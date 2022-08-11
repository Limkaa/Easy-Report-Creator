let state = {
    students: [],
    currentStudent: null,
};

function getStudentId() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    return params.id;
}

function getStudentsFromStorage() {
    chrome.runtime.sendMessage({ method: 'getLocalStorage', key: 'students' }, function (response) {
        console.log(response.data);
    });
}

function getStudentById() {
    return state.students.filter((element) => element.id === getStudentId());
}

function saveStudentsToStorage() {
    chrome.storage.sync.set({ students: state.students });
}

function addNewStudent() {
    let newStudent = { id: getStudentId() };
    if (state.students.filter((student) => student.id === newStudent.id).length === 0) {
        state.students.push(newStudent);
    }
}

window.addEventListener('load', function () {
    // state.students = getStudentsFromStorage();
    getStudentsFromStorage();
    // console.log(`Before: ${state.students}`);
    // addNewStudent();
    // console.log(`After: ${state.students}`);
});
