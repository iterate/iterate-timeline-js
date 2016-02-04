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
  if (employee.endDate === '') {
    return true;
  } else {
    return false;
  }
}

function currentEmployees(data) {
  return data.filter(isCurrentlyEmployed);
}

function isEmployedOn(date) {
  return function(employee) {
    var startDate = new Date(employee.startDate);
    var endDate = new Date(employee.endDate);
    var started = startDate.getTime() <= date.getTime();
    var stillEmployed = (employee.endDate === '' || endDate.getTime() > date.getTime());
    if (started && stillEmployed) {
      return true;
    } else {
      return false;
    }
  };
}

function employeesOnDate(data, date) {
  return data.filter(isEmployedOn(date));
}

function initialize() {
  $.getJSON('/data/employees.json', function(data) {
    employees = data;
  }).done(function( json ) {
    displayEmployees(currentEmployees(employees));
    console.log( 'JSON Data: ' + json );
  }).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ', ' + error;
    console.log( 'Request Failed: ' + err );
  });
}

module.exports.currentEmployees = currentEmployees;
module.exports.employeesOnDate = employeesOnDate;
module.exports.isEmployedOn = isEmployedOn;


