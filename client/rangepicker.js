'use strict';

let months = {}; 

function createMonthMap(fromDate, toDate) {
  let result = new Map();
  let currentDate = fromDate;
  let i = 1;
  while (currentDate < toDate) {
    result.set(i++, currentDate);
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getYear();
    let newMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    let newYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    currentDate = new Date(1900 + newYear, newMonth);
  }

  return result;
}

function getChosenMonth() {
  return months.get(parseInt(document.querySelector('#rangepicker').value));
}

function initialize(fromDate, toDate, updateFunction) {
  months = createMonthMap(fromDate, toDate); 
  let rangepicker = document.querySelector('#rangepicker');

  rangepicker.addEventListener('change', function() { 
    updateFunction(getChosenMonth());
  });

  rangepicker.setAttribute('max', months.size);
  rangepicker.setAttribute('value', months.size);
}

module.exports.initialize = initialize;
module.exports.getChosenMonth = getChosenMonth;
