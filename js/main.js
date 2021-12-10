const btnSubmit = document.getElementById('btn');

const btnEdit = document.getElementById('btnEdit');
const btnSave = document.getElementById('btnSave');
const btnCancel = document.getElementById('btnCancel');

const btnDelete = document.getElementById('btnDelete');
const btnModalDelete = document.getElementById('btnModalDelete');
const btnModalDeleteCancel = document.getElementById('btnModalDeleteCancel');

const inputEl = document.getElementById('input');

const modalScreen = document.getElementById('modalScreen');

let counter = 0;
let defaultValue = true;
let editOrDelete = 'delete';

// Listeners

window.addEventListener('load', function () {
    if (localStorage.length && localStorage.getItem('values')) {
        const existValues = JSON.parse(localStorage.getItem('values'));

        const listMenu = document.getElementById('toDoList');
        const modalEditOptions = document.getElementById('modalEditOptions');
        const modalDeleteOptions = document.getElementById('modalDeleteOptions');

        clearAll(modalEditOptions);

        for (key in existValues) {
            counter = key;
            creator(counter, existValues[key], listMenu);

            renderInOptions(modalEditOptions, modalDeleteOptions, key);
        } 
    }
});

btnSubmit.addEventListener('click', function () {
    const trimedValue = inputEl.value.trim();

    if (trimedValue != '') {
        counter++;

        const listMenu = document.getElementById('toDoList');
        const modalEditOptions = document.getElementById('modalEditOptions');
        const modalDeleteOptions = document.getElementById('modalDeleteOptions');

        saveToLocalStorage(counter, trimedValue);
        creator(counter, trimedValue, listMenu);
        renderInOptions(modalEditOptions, modalDeleteOptions, counter);

        inputEl.classList.remove('invalid');
        inputEl.value = '';
    } else {
        inputEl.classList.add('invalid');
        inputEl.placeholder = 'U can\'t leave input empty';
    }
});

btnEdit.addEventListener('click', function (event) {
    event.preventDefault();

    editOrDelete = 'edit';

    const bodyEl = document.body;
    const modalScreenEdit = document.getElementById('modalScreenEdit');

    bodyEl.classList.add('modal__open');
    modalScreen.classList.add('active');
    modalScreenEdit.classList.add('active');
});

btnDelete.addEventListener('click', function (event) {
    event.preventDefault();

    editOrDelete = 'delete';

    const bodyEl = document.body;
    const modalScreenDelete = document.getElementById('modalScreenDelete');

    bodyEl.classList.add('modal__open');
    modalScreen.classList.add('active');
    modalScreenDelete.classList.add('active');
});

inputEl.addEventListener('input', function () {
    const trimedValue = this.value.trim();
    if (trimedValue == '') {
        this.classList.remove('invalid');
        this.placeholder = 'Enter new task';
    }
});

modalScreen.addEventListener('click', function (event) {

    if (editOrDelete == 'edit') {
        redactModalEdit(event);
    } else if (editOrDelete == 'delete') {
        redactModalDelete(event);
    }
});

// Functions

function redactModalDelete(eventObj) {
    const modalDeleteSelectBtn = document.getElementById('modalDeleteSelectBtn');
    const modalDeleteTextarea = document.getElementById('modalDeleteTextarea');
    const modalDeleteErrMessage = document.getElementById('modalDeleteErrMessage');

    if (eventObj.target == modalDeleteSelectBtn) {
        modalDeleteSelectBtn.classList.toggle('active');
        modalDeleteErrMessage.classList.remove('active');
    } else {
        modalDeleteSelectBtn.classList.remove('active');
    }
    if (eventObj.target.classList.contains('modal__select-item')) {
        const modalSelectOption = eventObj.target;

        modalDeleteSelectBtn.textContent = modalSelectOption.textContent;

        const dataOption = modalDeleteSelectBtn.dataset.option = modalSelectOption.dataset.id;

        if (+dataOption == 0) {
            modalDeleteTextarea.value = '';
        } else {
            modalDeleteTextarea.value = returnFromStorage(dataOption);
        }
    }
}

function redactModalEdit(eventObj) {
    const modalEditSelectBtn = document.getElementById('modalEditSelectBtn');
    const modalEditTextarea = document.getElementById('modalEditTextarea');
    const modalEditErrMessage = document.getElementById('modalEditErrMessage');

    if (eventObj.target == modalEditSelectBtn) {
        modalEditSelectBtn.classList.toggle('active');
        modalEditErrMessage.classList.remove('active');
    } else {
        modalEditSelectBtn.classList.remove('active');
    }
    if (eventObj.target.classList.contains('modal__select-item')) {
        const modalSelectOption = eventObj.target;

        modalEditSelectBtn.textContent = modalSelectOption.textContent;

        const dataOption = modalEditSelectBtn.dataset.option = modalSelectOption.dataset.id;
        if (+dataOption == 0) {
            modalEditTextarea.value = '';
            modalEditTextarea.setAttribute('disabled', 'true');
        } else {
            modalEditTextarea.removeAttribute('disabled');
            modalEditTextarea.value = returnFromStorage(dataOption);
        }

    }
}

function addListenerToDeleteModalBtn(btn) {
    btn.addEventListener('click', function (event) {
        event.preventDefault();

        const id = +btn.dataset.id;
        const modalScreen = document.getElementById('modalScreen');
        const modalScreenDelete = document.getElementById('modalScreenDelete');
        const modalDeleteErrMessage = document.getElementById('modalDeleteErrMessage');
        const bodyEl = document.body;

        if (id) {
            const modalDeleteSelectBtn = document.getElementById('modalDeleteSelectBtn');

            const dataOption = modalDeleteSelectBtn.dataset.option;

            if (+dataOption != 0) {
                deleteTaskFromStorage(dataOption);

                modalScreen.classList.remove('active');
                bodyEl.classList.remove('modal__open');
                modalScreenDelete.classList.remove('active');
            } else {
                modalDeleteErrMessage.classList.add('active');
            }

        } else {
            modalScreen.classList.remove('active');
            bodyEl.classList.remove('modal__open');
            modalScreenDelete.classList.remove('active');
            modalDeleteErrMessage.classList.remove('active');
        }
    });
}

function addListenerToEditModalBtn(btn) {
    btn.addEventListener('click', function (event) {
        event.preventDefault();

        const id = +btn.dataset.id;
        const modalScreen = document.getElementById('modalScreen');
        const modalScreenEdit = document.getElementById('modalScreenEdit');
        const modalEditErrMessage = document.getElementById('modalEditErrMessage');
        const bodyEl = document.body;

        if (id) {
            const modalEditSelectBtn = document.getElementById('modalEditSelectBtn');
            const dataId = +modalEditSelectBtn.dataset.option;
            if (dataId) {
                const modalEditTextarea = document.getElementById('modalEditTextarea');
                const textAreaValue = modalEditTextarea.value;


                if (textAreaValue != '') {
                    changeTheStorage(dataId, textAreaValue);

                    modalScreen.classList.remove('active');
                    modalScreenEdit.classList.remove('active');
                    bodyEl.classList.remove('modal__open');

                    modalEditSelectBtn.textContent = 'Choose Task';
                    modalEditSelectBtn.dataset.option = 0;

                    modalEditTextarea.setAttribute('disabled', 'true');
                    modalEditTextarea.value = '';
                }
            } else {
                modalEditErrMessage.classList.add('active');
            }
        } else {
            modalScreen.classList.remove('active');
            modalScreenEdit.classList.remove('active');
            modalEditErrMessage.classList.remove('active');
            bodyEl.classList.remove('modal__open');

        }
    });
}

function deleteTaskFromStorage(id) {
    const existValues = JSON.parse(localStorage.getItem('values'));
    delete existValues[id];

    const listMenu = document.getElementById('toDoList');
    const modalEditOptions = document.getElementById('modalEditOptions');
    const modalDeleteOptions = document.getElementById('modalDeleteOptions');
    const modalDeleteSelectBtn = document.getElementById('modalDeleteSelectBtn');
    const modalDeleteTextarea = document.getElementById('modalDeleteTextarea');

    if (Object.keys(existValues).length == 0) {
        localStorage.removeItem('values');

        clearAll(listMenu);
        clearAll(modalEditOptions);
        clearAll(modalDeleteOptions);

        modalDeleteSelectBtn.textContent = 'Choose Task';
        modalDeleteSelectBtn.dataset.option = 0;
        modalDeleteTextarea.value = '';

        counter = 0;
        defaultValue = true;
    } else {
        const arrOfKeys = Object.keys(existValues);

        clearAll(listMenu);
        clearAll(modalEditOptions);
        clearAll(modalDeleteOptions);

        defaultValue = true;

        for (let i = 0; i < arrOfKeys.length; i++) {
            let tempValue = existValues[arrOfKeys[i]];
            delete existValues[arrOfKeys[i]];
            existValues[i + 1] = tempValue;

            creator(i + 1, tempValue, listMenu);
            renderInOptions(modalEditOptions, modalDeleteOptions, i + 1);
        }
        modalDeleteSelectBtn.textContent = 'Choose Task';
        modalDeleteSelectBtn.dataset.option = 0;
        modalDeleteTextarea.value = '';

        localStorage.setItem('values', JSON.stringify(existValues));
    }
}

function changeTheStorage(id, editedValue) {
    const existValues = JSON.parse(localStorage.getItem('values'));

    existValues[id] = editedValue;

    localStorage.setItem('values', JSON.stringify(existValues));

    const listMenu = document.getElementById('toDoList');
    const currentTask = listMenu.querySelector(`[data-id="${id}"]`);

    currentTask.textContent = editedValue;
}

function addPointListenerToBtn(btn) {
    btn.addEventListener('mousemove', function (event) {
        const x = event.pageX - this.offsetLeft;
        const y = event.pageY - this.offsetTop;

        console.log(this.offsetLeft);
        btn.style.setProperty('--x', x + 'px');
        btn.style.setProperty('--y', y + 'px');
    });
}

function renderInOptions(parentBlock, parentBlock2, key) {

    if (defaultValue) {
        const modalDefItem = document.createElement('div');

        modalDefItem.classList.add('modal__select-item');
        modalDefItem.dataset.id = 0;
        modalDefItem.textContent = 'Choose Task';

        const cloneDefItem = modalDefItem.cloneNode(true);

        parentBlock.append(modalDefItem);
        parentBlock2.append(cloneDefItem);

        defaultValue = false;
    }

    const modalItem = document.createElement('div');

    modalItem.classList.add('modal__select-item');
    modalItem.dataset.id = key;
    modalItem.textContent = `Task #${key}`;

    const cloneItem = modalItem.cloneNode(true);

    parentBlock.append(modalItem);
    parentBlock2.append(cloneItem);
}

function returnFromStorage(id) {
    if (localStorage.length && localStorage.getItem('values')) {
        const parsedData = JSON.parse(localStorage.getItem('values'));

        return parsedData[id];
    }
}


function clearAll(parentBlock) {
    const range = document.createRange();
    range.selectNodeContents(parentBlock);
    range.deleteContents();
}

function saveToLocalStorage(count, inputValue) {

    if (localStorage.length && localStorage.getItem('values')) {
        const existValues = JSON.parse(localStorage.getItem('values'));

        for (key in existValues) {
            counter = key;
        }

        existValues[++counter] = inputValue;

        localStorage.setItem('values', JSON.stringify(existValues));
    } else {
        const obj = new Object();
        obj[count] = inputValue;

        localStorage.setItem('values', JSON.stringify(obj));
    }
}

function creator(counter, inputValue, parentBlock) {
    const divWrapper = document.createElement('div');
    divWrapper.classList.add('todo__wrapper');

    const divLabel = document.createElement('div');
    divLabel.classList.add('todo__label');
    divLabel.textContent = `Task #${counter}`;

    const liEl = document.createElement('li');
    liEl.classList.add('todo__task');
    liEl.textContent = inputValue;
    liEl.dataset.id = counter;

    divWrapper.append(divLabel);
    divWrapper.append(liEl);
    parentBlock.append(divWrapper);
}

// Used Functions

addPointListenerToBtn(btnSubmit);
addPointListenerToBtn(btnEdit)
addPointListenerToBtn(btnDelete);

addListenerToEditModalBtn(btnSave);
addListenerToEditModalBtn(btnCancel);

addListenerToDeleteModalBtn(btnModalDelete);
addListenerToDeleteModalBtn(btnModalDeleteCancel);