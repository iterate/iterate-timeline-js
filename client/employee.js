'use strict';

const employee = (employeeJson) => {
  const name = employeeJson.name;
  const startDate = new Date(employeeJson.startDate);
  const hasEndDate = employeeJson.endDate !== '';
  const endDate = new Date(employeeJson.endDate);
  const image = employeeJson.image;

  return {
    get name () { return name; },
    get startDate () { return startDate; },
    get endDate () { return endDate; },
    isCurrentlyEmployed: () => { return !hasEndDate; },
    isEmployedOn: (date) => {
      let started = startDate.getTime() <= date.getTime();
      let stillEmployed = (!hasEndDate || endDate.getTime() > date.getTime());

      return started && stillEmployed;
    },
    get image () { return image; }
  };
};

module.exports.employee = employee;
