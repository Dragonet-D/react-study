import React from 'react';
import _ from 'lodash';
import LineChart from 'components/Overview/Chart/LineChart';
import moment from 'moment';
import { TIME_FORMAT_HH_MM } from 'commons/constants/const';

function ReportSearchChart(props) {
  const { callShowDetails, isTitleNeeded, caseOfSwitch, dataSource, title } = props;
  const sourceArr3 = [
    '2009-11-21 00:00:00',
    '2009-11-21 01:00:00',
    '2009-11-21 02:00:00',
    '2009-11-21 03:00:00',
    '2009-11-21 04:00:00',
    '2009-11-21 05:00:00',
    '2009-11-21 06:00:00',
    '2009-11-21 07:00:00',
    '2009-11-21 08:00:00',
    '2009-11-21 09:00:00',
    '2009-11-21 10:00:00',
    '2009-11-21 11:00:00',
    '2009-11-21 12:00:00',
    '2009-11-21 13:00:00',
    '2009-11-21 14:00:00',
    '2009-11-21 15:00:00',
    '2009-11-21 16:00:00',
    '2009-11-21 17:00:00',
    '2009-11-21 18:00:00',
    '2009-11-21 19:00:00',
    '2009-11-21 20:00:00',
    '2009-11-21 21:00:00',
    '2009-11-21 22:00:00',
    '2009-11-21 23:00:00'
  ];
  const sourceArr = [];
  const sourceArr1 = [];
  let date = [];
  if (!_.isEqual(dataSource, {})) {
    for (const t in sourceArr3) {
      sourceArr.push([moment(sourceArr3[t]).format(TIME_FORMAT_HH_MM)]);
    }
    date = Object.keys(dataSource.items);
    let obj = {};
    for (const k in date) {
      obj = {
        name: date[k],
        type: 'line',
        data: dataSource.items[date[k]]
      };
      sourceArr1.push(obj);
    }
  }
  const targetOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: date,
      icon: 'roundRect',
      textStyle: {
        color: '#c1bebe'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {
          title: 'Save'
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: [...sourceArr]
    },
    yAxis: {
      type: 'value'
    },
    series: sourceArr1
  };

  return (
    <LineChart
      targetOption={targetOption}
      title={title}
      caseOfSwitch={caseOfSwitch}
      callShowDetails={callShowDetails}
      isTitleNeeded={isTitleNeeded}
    />
  );
}

export default ReportSearchChart;
