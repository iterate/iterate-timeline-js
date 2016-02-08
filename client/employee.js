'use strict';

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

module.exports.employee = employee;
