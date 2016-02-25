'use strict';

const employee = (employeeJson) => {
  function createDateAsUTC(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
  }
  const name = employeeJson.name;
  const startDate = createDateAsUTC(new Date(employeeJson.startDate));
  const hasEndDate = employeeJson.endDate !== '';
  const endDate = createDateAsUTC(new Date(employeeJson.endDate));
  const image = employeeJson.image;

  return {
    get name () { return name; },
    get startDate () { return startDate; },
    get endDate () { return endDate; },
    isCurrentlyEmployed: () => { return !hasEndDate; },
    isEmployedOn: (date) => {
      let started = startDate <= date;
      let stillEmployed = (!hasEndDate || endDate.getTime() > date.getTime());

      return started && stillEmployed;
    },
    get image () { return image; }
  };
};

module.exports.employee = employee;
