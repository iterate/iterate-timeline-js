'use strict';

let employee = require('./employee').employee;
let rangepicker = require('./rangepicker');

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

rangepicker.initialize(new Date(2007,2), new Date(), changeMonth);

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

