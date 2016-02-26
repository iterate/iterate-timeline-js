'use strict';

let moment = require('moment');

const employee = (employeeJson) => {
  const name = employeeJson.name;
  const startDate = moment(employeeJson.startDate);
  const hasEndDate = employeeJson.endDate !== '';
  const endDate = moment(employeeJson.endDate);
  const image = employeeJson.image;

  return {
    get name () { return name; },
    get startDate () { return startDate; },
    get endDate () { return endDate; },
    isCurrentlyEmployed: () => { return !hasEndDate; },
    isEmployedOn: (date) => {
      let started = startDate <= date;
      let stillEmployed = (!hasEndDate || endDate > date);

      return started && stillEmployed;
    },
    get image () { return image; }
  };
};

module.exports.employee = employee;
