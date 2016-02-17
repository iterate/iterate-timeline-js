'use strict';

var $ = require('jquery');
var foo = require('handlebars');
// var employee = require('employee');

let statsTemplateScript = $('#employee-statistics').html();
let statsTemplate = foo.compile(statsTemplateScript);


const employee = (employeeJson) => {
  const name = employeeJson.name;
  const startDate = new Date(employeeJson.startDate);
  const hasEndDate = employeeJson.endDate !== '';
  const endDate = new Date(employeeJson.endDate);
  const image = employeeJson.image;

  return {
    name: () => { return name; },
    startDate: () => { return startDate; },
    endDate: () => { return endDate; },
    isCurrentlyEmployed: () => { return !hasEndDate; },
    isEmployedOn: (date) => {
      let started = startDate.getTime() <= date.getTime();
      let stillEmployed = (!hasEndDate || endDate.getTime() > date.getTime());

      return started && stillEmployed;
    },
    image: () => { return image; }
  };
};

let employees = {};

function createMonthMap(fromDate, toDate) {
  console.log(fromDate, toDate);
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

let months = createMonthMap(new Date(2007,2), new Date(2016,1));

function displayEmployees(data) {
  let images = [];
  data.forEach(function(employee) {
    images.push('<img src="/' + employee.image() + '" alt="' + employee.name() + '" width="100px">');
  });
  let employeeImages = $('<div/>', {
    'id': 'employee-images',
    'class': 'item maincontent',
    html: images.join('')
  });
  $('#employee-images').replaceWith(employeeImages);
}

function displayMonth(month) {
  $('#rangemonth').text(month.toDateString());
}

function displayStats(data) {
  $('#stats').replaceWith(statsTemplate({numberOfEmployees: data.length, ratio: 1, alumni: 1}));
}

function currentEmployees(data) {
  return data.filter(function(employee) { return employee.isCurrentlyEmployed(); });
}

function employeesOnDate(data, date) {
  return data.filter(function(employee) {
    return employee.isEmployedOn(date);
  });
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
      displayEmployees(currentEmployees(employees));
    })
    .catch(function(ex) {
      console.log('Failed to fetch employees.', ex);
    });
}

initialize();

$('#rangepicker').change(function() {
  let chosenValue= $(this).val();
  let chosenMonth = months.get(parseInt(chosenValue));
  displayMonth(chosenMonth);
  displayEmployees(employeesOnDate(employees, chosenMonth));
  displayStats(employeesOnDate(employees, chosenMonth));
});

$('#rangepicker').attr('max', months.size);

module.exports.currentEmployees = currentEmployees;
module.exports.employeesOnDate = employeesOnDate;

