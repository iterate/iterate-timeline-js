'use strict';

let months = {}; 

function createMonthMap(fromDate, toDate) {
  let result = new Map();
  let currentDate = fromDate;
  let i = 1;
  while (currentDate < toDate) {
    result.set(i++, currentDate.clone());
    currentDate = currentDate.add(1, 'months');
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
