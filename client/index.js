'use strict';

let employee = require('./employee').employee;

let statsTemplate = require('./template/stats.hbs');
let employeeImagesTemplate = require('./template/employee-images.hbs');

let employees = {};

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

let months = createMonthMap(new Date(2007,2), new Date());

function displayEmployees(data) {
  let images = data.map(function(v) {
    return {
      file: v.image(),
      employeeName: v.name()
    };
  });

  document.querySelector('#employee-images').innerHTML = employeeImagesTemplate({images: images});
}

function displayMonth(month) {
  document.querySelector('#rangemonth').textContent = month.toDateString();
}

function displayStats(data) {
  document.querySelector('#stats').innerHTML = statsTemplate({numberOfEmployees: data.length, ratio: 1, alumni: 1});
}

function currentEmployees(data) {
  return data.filter(function(employee) { return employee.isCurrentlyEmployed(); });
}

function employeesOnDate(data, date) {
  return data.filter(function(employee) {
    return employee.isEmployedOn(date);
  });
}

function changeMonth(month) {
  displayMonth(month);
  displayEmployees(employeesOnDate(employees, month));
  displayStats(employeesOnDate(employees, month));
}

function getChosenMonth() {
  return months.get(parseInt(document.querySelector('#rangepicker').value));
}

function initialize() {
  fetch('/data/employees.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      employees = json.map(employee);
    })
    .then(function() {
      changeMonth(getChosenMonth());
    })
    .catch(function(ex) {
      console.log('Failed to fetch employees.', ex);
    });
}

initialize();

let rangepicker = document.querySelector('#rangepicker');

rangepicker.addEventListener('change', function() {
  changeMonth(getChosenMonth());
});

rangepicker.setAttribute('max', months.size);
rangepicker.setAttribute('value', months.size);


module.exports.currentEmployees = currentEmployees;
module.exports.employeesOnDate = employeesOnDate;

