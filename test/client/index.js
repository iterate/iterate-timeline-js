'use strict';
var expect = require('chai').expect;
var app = require('./../../client/index.js');

describe('new test', function() {
  var employees = [
    {
      'name' : 'Morten',
      'startDate' : '2007-09-01',
      'endDate' : '',
      'image' : 'images/morten.jpg'
    },
    {
      'name' : 'Simen',
      'startDate' : '2007-03-01',
      'endDate' : '2015-10-01',
      'image' : 'images/simen.jpg'
    }
  ];
  it('should filter out current employees', function() {
    var result = app.currentEmployees(employees);

    expect(result).to.have.length(1);
  });

  it('should filter out employees on date', function() {
    var date_20150901 = new Date(2015, 9, 1);
    var result = app.employeesOnDate(employees, date_20150901);

    expect(result).to.have.length(2);
  });
});

describe('employee', function() {
  var employee = {
    'name': 'Morten',
    'startDate': '2007-09-01',
    'endDate': '',
    'image': 'images/morten.jpeg'
  };
  it('should be employed on date', function() {
    var result = app.isEmployedOn(new Date('2015-01-01'))(employee);

    expect(result).to.equal(true);
  });
  it('should not be employed before start date', function() {
    var result = app.isEmployedOn(new Date('2006-01-01'))(employee);

    expect(result).to.equal(false);
  });
  it('should be employed at start date', function() {
    var result = app.isEmployedOn(new Date('2007-09-01'))(employee);

    expect(result).to.equal(true);
  });
});
