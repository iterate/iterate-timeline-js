'use strict';
let expect = require('chai').expect;
let app = require('./../../client/employee.js');

describe('employee', function() {
  let employees = [
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

  it('without end date is currently employed', function() {
    let employee = app.employee(employees[0]);

    expect(employee.isCurrentlyEmployed()).to.equal(true);
  });

  it('with end date is not currently employed', function() {
    let employee = app.employee(employees[1]);

    expect(employee.isCurrentlyEmployed()).to.equal(false);
  });

  it('is employed on date within start and end', function() {
    let employee = app.employee(employees[1]);
    
    let _20150101 = new Date('2015-1-1'); 

    expect(employee.isEmployedOn(_20150101)).to.equal(true);
  });


});
