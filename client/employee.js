'use strict';

let moment = require('moment');

const employee = (employeeJson) => {
  const name = employeeJson.name;
  const startDate = moment(employeeJson.startDate);
  const hasEndDate = employeeJson.endDate !== '';
  const endDate = moment(employeeJson.endDate);
  const image = employeeJson.image;
  const sex = employeeJson.sex;

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
    get image () { return image; },
    get isMale () { return sex === 'male'; },
    get isFemale () { return sex === 'female'; }
  };
};

module.exports.employee = employee;
