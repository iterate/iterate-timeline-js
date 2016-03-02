'use strict';

let nv = require('nvd3');
let d3 = require('d3');
let moment = require('moment');

function createMonthArray(fromDate, toDate) {
  let data = [];
  let currentDate = fromDate;
  while(currentDate < toDate) {
    data.push(currentDate.clone());
    currentDate = currentDate.add(1, 'months');
  }

  return data;
}

function drawGraph(fromDate, toDate, employees, updateFunction) {
  nv.addGraph(function() {
    let chart = nv.models.lineChart()
      .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
      .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
      // .transitionDuration(350)  //how fast do you want the lines to transition?
      .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
      .showYAxis(true)        //Show the y-axis
      .showXAxis(true)        //Show the x-axis
    ;
    chart.lines.dispatch.on('elementClick', function(data) { updateFunction(moment(data[0].point.x)); });

    chart.xAxis
      .axisLabel('Tid')
      .tickFormat(function(d) { return d3.time.format('%b\'%y')(new Date(d)); });

    chart.xScale(d3.time.scale());

    chart.yAxis
      .axisLabel('Antall ansatte');

    let months = createMonthArray(fromDate, toDate);
    
    let total = months.map(function(month) {
      let employeesOnDate = employees.filter(function(employee) {
        return employee.isEmployedOn(month);
      });
      return {x: month.toDate(), y: employeesOnDate.length };
    });

    let males = months.map(function(month) {
      let employeesOnDate = employees.filter(function(employee) {
        return employee.isEmployedOn(month) && employee.isMale;
      });
      return {x: month.toDate(), y: employeesOnDate.length };
    }); 
    
    let females = months.map(function(month) {
      let employeesOnDate = employees.filter(function(employee) {
        return employee.isEmployedOn(month) && employee.isFemale;
      });
      return {x: month.toDate(), y: employeesOnDate.length };
    }); 
    let myData = 
    [
      {
        values: total,
        key: 'Totalt'
      },
      {
        values: males,
        key: 'Menn'
      },
      {
        values: females,
        key: 'Kvinner'
      },
    ];

    d3.select('#employee-chart svg')    //Select the <svg> element you want to render the chart in.   
      .datum(myData)         //Populate the <svg> element with chart data...
      .call(chart);          //Finally, render the chart!

    //Update the chart when window resizes.
    nv.utils.windowResize(function() { chart.update(); });
    return chart;
  });
}

module.exports.drawGraph = drawGraph;
