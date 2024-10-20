let entries = [];

const validateTitle = (title, titleError) => {
    let result = false;
    if (title.value.length !== 0) {
        result = true;
        titleError.style.display = "none";
    } else {
        title.value = "";
        titleError.style.display = "block";
    }
    return result;
}

const validateDate = (date, dateError) => {
    let result = false;

    if (date.value.length === 5 && date.value.at(2) === '/') {
        let month = date.value.substring(0, 2);
        let day = date.value.substring(3, 5);
        month = parseInt(month);
        day = parseInt(day);
        if (validMonth(month) && validDay(day)) {
            result = true;
            dateError.style.display = "none";
        } else {
            date.value = "";
            dateError.style.display = "block";
        }
    } else {
        date.value = "";
        dateError.style.display = "block";
    }

    return result;
}

const validMonth = (month) => {
    return Number.isInteger(month) && month >= 1 && month <= 12;
}

const validDay = (day) => {
    return Number.isInteger(day) && day >= 1 && day <= 31;
}

const validHourWithMin = (num1, num2, time, timeError) => {
    let result = false;
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    if (Number.isInteger(num1) && Number.isInteger(num2) && num1 > 0 && num2 > 0) {
        result = true;
        timeError.style.display = "none";
    } else {
        time.value = "";
        timeError.style.display = "block";
    }
    return result;
}

const validHourOrMin = (num, time, timeError) => {
    let result = false;
    num = parseInt(num);
    if (Number.isInteger(num) && num > 0) {
        result = true;
        timeError.style.display = "none";
    } else {
        time.value = "";
        timeError.style.display = "block";
    }
    return result;
}

const validateTime = (time, timeError) => {
    let result = false;
    let length = time.value.length;

    //Check for single-digit hour input
    //Ex: "1h"
    if (length === 2) {
        if (time.value.at(1) === 'h') {
            let num = time.value.at(0);
            result = validHourOrMin(num, time, timeError);
        } else {
            time.value = "";
            timeError.style.display = "block";
        }
    }
    //Check for double-digit hour or minute input
    //Ex: "10h" or "15m"
    else if (length === 3) {
        if (time.value.at(2) === 'h' || time.value.at(2) === 'm') {
            let num = time.value.substring(0,2);
            result = validHourOrMin(num, time, timeError);
        } else {
            time.value = "";
            timeError.style.display = "block";
        }
    }
    //Check for single-digit hour input w/ minutes
    //Ex: "1h 30m"
    else if (length === 6) {
        if (time.value.at(1) === 'h' && time.value.at(2) === ' ' && time.value.at(5) === 'm') {
            let num1 = time.value.at(0);
            let num2 = time.value.substring(3, 5);
            result = validHourWithMin(num1, num2, time, timeError);
        } else {
            time.value = "";
            timeError.style.display = "block";
        }
    }
    //Check for double-digit hour input w/ minutes
    //Ex: "12h 30m"
    else if (length === 7) {
        if (time.value.at(2) === 'h' && time.value.at(3) === ' ' && time.value.at(6) === 'm') {
            let num1 = time.value.substring(0, 2);
            let num2 = time.value.substring(4, 6);
            result = validHourWithMin(num1, num2, time, timeError);
        } else {
            time.value = "";
            timeError.style.display = "block";
        }
    } else {
        time.value = "";
        timeError.style.display = "block";
    }

    return result;
}

const clearList = () => {
    const list = document.getElementById('list');
    list.innerHTML = '';
}

const addButtonHandler = () => {
    const title = document.getElementById('title');
    const date = document.getElementById('date');
    const time = document.getElementById('time');

    let titleValue = title.value;
    let dateValue = date.value;
    let timeValue = time.value;

    const titleError = document.getElementById('title-error');
    const dateError = document.getElementById('date-error');
    const timeError = document.getElementById('time-error');

    let validTitle = validateTitle(title, titleError);
    let validDate = validateDate(date, dateError);
    let validTime = validateTime(time, timeError);

    if (validTitle && validDate && validTime) {
        let entry = {
            title: titleValue,
            date: dateValue,
            time: timeValue,
        }

        title.value = "";
        date.value = "";
        time.value = "";

        clearList();

        entries.push(entry);

        displayList();

        //save to local storage after adding
        const priorityList = document.getElementById('list').innerHTML;
        localStorage.setItem('inputValue', priorityList);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}

const deleteButtonHandler = (title) => {
    entries = entries.filter(entry => entry.title !== title);

    clearList();
    displayList();

    //save to local storage after deleting
    const priorityList = document.getElementById('list').innerHTML;
    localStorage.setItem('inputValue', priorityList);
    localStorage.setItem('entries', JSON.stringify(entries));
}

const displayList = () => {
    const list = document.getElementById('list');
    list.innerHTML = "<thead> <th class='fifty-five'>Title</th> <th class='fifteen'>Date</th> " +
        "<th class='fifteen'>Est. Time</th> <th class='fifteen'>Delete</th> </thead>";

    entries.sort(compareByDate);
    for (let i = 0; i < entries.length; i++) {
        const entryHTML = createEntryHTML(entries[i]);
        list.appendChild(entryHTML);
    }
}

const clearButtonHandler = () => {
    clearList();
    entries = [];
    localStorage.clear();
    displayList();
}

const compareByDate = (a, b) => {
    let numA = a.date;
    let numB = b.date;

    numA = numA.replace("/", "");
    numB = numB.replace("/", "");

    numA = parseInt(numA);
    numB = parseInt(numB);

    if (numA < numB) {
        return -1;
    } else if (numA > numB) {
        return 1;
    } else {
        return 0;
    }
}

const createEntryHTML = (entry) => {
    const entryHTML = document.createElement('tr');

    const entryTitle = document.createElement('td')
    entryTitle.innerText = entry.title;
    const entryDate = document.createElement('td')
    entryDate.innerText = entry.date;
    const entryTime = document.createElement('td')
    entryTime.innerText = entry.time;
    const deleteButton = createDeleteButton();

    entryHTML.append(entryTitle, entryDate, entryTime, deleteButton);
    deleteButton.onclick = () => {
        return deleteButtonHandler(deleteButton.parentNode.firstChild.textContent);
    }

    return entryHTML;
}

const createDeleteButton = () => {
    const buttonCell = document.createElement('td');
    const deleteButton = document.createElement('button')
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerText = 'X';

    buttonCell.appendChild(deleteButton);

    return buttonCell;
}

window.onload = () => {
    const addButton = document.getElementById('add');
    addButton.onclick = addButtonHandler;
    const clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;

    const priorityList = localStorage.getItem('inputValue');
    if (priorityList) {
        document.getElementById('list').innerHTML = priorityList;
    }

    const savedEntries = localStorage.getItem('entries');
    if (savedEntries) {
        entries = JSON.parse(savedEntries);
    }

    clearList();
    displayList();
}

//BUG: can't delete task immediately upon reload
//workaround - add a task, then all delete buttons become interactable
//FIXED: clear and display list on window load

//TODO: Validate input - Completed
//TODO: Add styling for phones - Completed
//TODO: Documentation