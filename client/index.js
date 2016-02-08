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

var employees = {};

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

$('#datepicker').change(function() {
  let date = $(this).val();
  let dateObject = new Date(date);
  displayEmployees(employeesOnDate(employees, dateObject));
});

module.exports.currentEmployees = currentEmployees;
module.exports.employeesOnDate = employeesOnDate;

