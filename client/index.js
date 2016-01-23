'use strict';

var $ = require('jquery');

var employees = {};

function displayEmployees(data) {
  var items = [];
  data.forEach(function(employee) {
    items.push('<li>' + employee.name + '</li>');
  });
  var employeesList = $('<ul/>', {
    'class': 'employees-list',
    html: items.join('')
  });
  $('#timeline').append(employeesList);
}

function isCurrentlyEmployed(employee) {
  console.log(employee);
  if (employee.endDate === '') {
    return true;
  } else {
    return false;
  }
}

function currentEmployees(data) {
  console.log('employees: ' + data);
  return data.filter(isCurrentlyEmployed);
}

$.getJSON('/data/employees.json', function(data) {
  employees = data;
}).done(function( json ) {
  displayEmployees(currentEmployees(employees));
  console.log( 'JSON Data: ' + json );
}).fail(function( jqxhr, textStatus, error ) {
  var err = textStatus + ', ' + error;
  console.log( 'Request Failed: ' + err );
});


