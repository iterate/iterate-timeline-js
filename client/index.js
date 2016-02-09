'use strict';

var $ = require('jquery');
// var employee = require('employee');

const employee = (employeeJson) => {
  const name = employeeJson.name;
  const startDate = new Date(employeeJson.startDate);
  const hasEndDate = employeeJson.endDate !== '';
  const endDate = new Date(employeeJson.endDate);
  
  return {
    name: () => { return name; },
    startDate: () => { return startDate; },
    endDate: () => { return endDate; },
    isCurrentlyEmployed: () => { return !hasEndDate; },
    isEmployedOn: (date) => {
      let started = startDate.getTime() <= date.getTime();
      let stillEmployed = (!hasEndDate || endDate.getTime() > date.getTime());

      return started && stillEmployed;
    }
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
  var items = [];
  data.forEach(function(employee) {
    items.push('<li>' + employee.name() + '</li>');
  });
  var employeesList = $('<ul/>', {
    'class': 'employees-list',
    html: items.join('')
  });
  $('.employees-list').replaceWith(employeesList);
}

function displayMonth(month) {
  $('#rangemonth').text(month.toDateString());
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
  $.getJSON('/data/employees.json', function(data) {
    employees = data.map(employee);
  }).done(function( json ) {
    displayEmployees(currentEmployees(employees));
    console.log( 'JSON Data: ' + json );
  }).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ', ' + error;
    console.log( 'Request Failed: ' + err );
  });
}

initialize();

$('#rangepicker').change(function() {
  let chosenValue= $(this).val();
  let chosenMonth = months.get(parseInt(chosenValue));
  displayMonth(chosenMonth);
  displayEmployees(employeesOnDate(employees, chosenMonth));
});

module.exports.currentEmployees = currentEmployees;
module.exports.employeesOnDate = employeesOnDate;

