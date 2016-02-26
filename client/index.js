'use strict';

let employee = require('./employee').employee;
let rangepicker = require('./rangepicker');
let moment = require('moment');

let statsTemplate = require('./template/stats.hbs');
let employeeImagesTemplate = require('./template/employee-images.hbs');

let employees = [];

function displayEmployees(data) {
  let images = data.map(function(v) {
    return {
      file: v.image,
      employeeName: v.name
    };
  });

  document.querySelector('#employee-images').innerHTML = employeeImagesTemplate({images: images});
}

function displayMonth(month) {
  document.querySelector('#rangemonth').textContent = month.format('MMMM YYYY');
}

function currentEmployees(data) {
  return data.filter(function(employee) { return employee.isCurrentlyEmployed(); });
}

function employeesOnDate(data, date) {
  return data.filter(function(employee) {
    return employee.isEmployedOn(date);
  });
}

function displayStats(employees, month) {
  let currentEmployees = employeesOnDate(employees, month);
  let employeesUpToDate = employees.filter(function(employee) { return employee.startDate <= month; });
  let currentMales = currentEmployees.filter(function(employee) { return employee.isMale; }).length;
  let currentFemales = currentEmployees.filter(function(employee) { return employee.isFemale; }).length;
  let ratio = ((currentFemales / currentMales) * 100).toFixed();
  document.querySelector('#stats').innerHTML = statsTemplate({
    month: month.format('MMMM YYYY'),
    numberOfEmployees: currentEmployees.length,
    ratio: ratio,
    alumni: employeesUpToDate.length
  });
}

function changeMonth(month) {
  displayMonth(month);
  displayEmployees(employeesOnDate(employees, month));
  displayStats(employees, month);
}

rangepicker.initialize(moment('2007-03-01'), moment(), changeMonth);

function initialize() {
  fetch('/data/employees.json')
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      employees = json.map(employee);
    })
    .then(function() {
      changeMonth(rangepicker.getChosenMonth());
    })
    .catch(function(ex) {
      console.log('Failed to fetch employees.', ex);
    });
}

initialize();

module.exports.currentEmployees = currentEmployees;
module.exports.employeesOnDate = employeesOnDate;

