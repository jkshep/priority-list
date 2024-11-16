let entries = [];

/**
 * Validates the title of a priority
 * @param title HTML input for title
 * @param titleError HTML span for title error popup
 * @returns {boolean} true if the title is valid and false if not
 */
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

/**
 * Validates the date of a priority
 * @param date HTML input for date
 * @param dateError HTML span for date error popup
 * @returns {boolean} true if the date is valid and false if not
 */
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

/**
 * Helper method for validateDate(). Determines if the passed month
 * is valid
 * @param month input for month from the user
 * @returns {boolean} true if the number is an integer between 1 and 12, inclusive.
 * Returns false otherwise
 */
const validMonth = (month) => {
    return Number.isInteger(month) && month >= 1 && month <= 12;
}

/**
 * Helper method for validateDate(). Determines if the passed day
 * is valid
 * @param day input for day from the user
 * @returns {boolean} true if the number is an integer between 1 and 31, inclusive.
 * Returns false otherwise
 */
const validDay = (day) => {
    return Number.isInteger(day) && day >= 1 && day <= 31;
}

/**
 * Helper method for validateTime(). Determines if the passed hour and minute
 * values are valid in the format ##h ##m.
 * @param num1 number indicating estimated hours
 * @param num2 number indicating estimated minutes
 * @param time HTML input for time
 * @param timeError HTML span for time error popup
 * @returns {boolean} true if the hour and minute values are numbers greater than 0 and false otherwise
 */
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

/**
 * Helper method for validateTime(). Determines if the passed hour or minute
 * values are valid in the format ##h or ##m
 * @param num number indicating estimated hours or estimated minutes
 * @param time HTML input for time
 * @param timeError HTML span for time error popup
 * @returns {boolean} true if the hour or minute value is a number greater than 0 and false otherwise
 */
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

/**
 * Validates the estimated time of a priority
 * @param time HTML input for time
 * @param timeError HTML span for time error popup
 * @returns {boolean} true if the time is valid and false if not
 */
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

/**
 * Clears the HTML table element representing the priority list
 */
const clearList = () => {
    const list = document.getElementById('list');
    list.innerHTML = '';
}

/**
 * Handler for the add button. Checks inputs for valid values and adds new priority
 * to the list.
 */
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

/**
 * Handler for delete buttons. Deletes the priority containing the button from the
 * priority list.
 * @param title title of priority to be deleted
 */
const deleteButtonHandler = (title) => {
    entries = entries.filter(entry => entry.title !== title);

    clearList();
    displayList();

    //save to local storage after deleting
    const priorityList = document.getElementById('list').innerHTML;
    localStorage.setItem('inputValue', priorityList);
    localStorage.setItem('entries', JSON.stringify(entries));
}

/**
 * Displays the priority lists after sorting the entries by date
 */
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

/**
 * Handler for the clear button. Clears all priorities from the list.
 */
const clearButtonHandler = () => {
    clearList();
    entries = [];
    localStorage.clear();
    displayList();
}

/**
 * Compares two dates in the format mm/dd
 * @param a the first date
 * @param b the second date
 * @returns {number} -1 if the first date is before the second, 1 if the first date
 * is after the second, and 0 if they are the same
 */
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

/**
 * Creates an HTML row element for the entry
 * @param entry an entry object containing a title, date, and time
 * @returns {HTMLTableRowElement} an HTML row element representing the priority
 */
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
        return deleteButtonHandler(entry.title);
    }

    return entryHTML;
}

/**
 * Creates a table cell containing a delete button.
 * @returns {HTMLTableCellElement} the table cell containing the delete button
 */
const createDeleteButton = () => {
    const buttonCell = document.createElement('td');
    const deleteButton = document.createElement('button')
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerText = 'X';

    buttonCell.appendChild(deleteButton);

    return buttonCell;
}

/**
 * On window load method. Initializes the add and clear buttons. Gets the saved list
 * and entry array from local storage and displays the list on the screen.
 */
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