'use strict';

let employee = require('./employee').employee;
let rangepicker = require('./rangepicker');
let moment = require('moment');
let chart = require('./chart');
let base64 = require('base-64');

let statsTemplate = require('./template/stats.hbs');
let employeeImagesTemplate = require('./template/employee-images.hbs');

let allEmployees = [];

// replace these with username/password
const username = '';
const password = '';

function displayEmployees(employees) {
  let images = employees.map(function(v) {
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

function employeesOnDate(employees, date) {
  return employees.filter(function(employee) {
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
  displayEmployees(employeesOnDate(allEmployees, month));
  displayStats(allEmployees, month);
}

rangepicker.initialize(moment('2007-03-01'), moment(), changeMonth);

function initialize() {
  fetch('https://ansatt.app.iterate.no/api/people/full', {
    headers: {
      'Authorization': 'Basic ' + base64.encode(username + ':' + password)
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      allEmployees = json.map(employee);
    })
    .then(function() {
      changeMonth(rangepicker.getChosenMonth());
      chart.drawGraph(moment('2007-03-01'), moment(), allEmployees, changeMonth);
    })
    .catch(function(ex) {
      console.log('Failed to fetch employees.', ex);
    });
}

initialize();
