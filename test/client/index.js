'use strict';
var expect = require('chai').expect;
var app = require('./../../client/index.js');

describe('new test', function() {
  it('should filter out current employees', function() {
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

    var result = app.currentEmployees(employees);

    expect(result).to.have.length(1);
  });
});
