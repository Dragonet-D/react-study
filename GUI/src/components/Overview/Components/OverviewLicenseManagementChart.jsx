import React from 'react';
import _ from 'lodash';
import BarChart from '../Chart/BarChart';

function LicenseManagement(props) {
  const { callShowDetails, isTitleNeeded, caseOfSwitch, dataSource, title } = props;
  const sourceArr = [];
  if (!_.isEqual(dataSource, {})) {
    for (const k in dataSource) {
      const { appName = 0, total = 0, inuse = 0, remaining = 0 } = dataSource[k];
      sourceArr.push([appName, total, remaining, inuse]);
    }
  } else {
    sourceArr.push([0, 0, 0, 0]);
  }
  const targetOption = {
    dataset: {
      source: [['', 'Total License', 'License Remaining', 'License In Use'], ...sourceArr]
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [
      { type: 'bar', color: '#d48265' },
      { type: 'bar', color: '#91c7ae' },
      { type: 'bar', color: '#2f4554' }
    ]
  };
  return (
    <BarChart
      targetOption={targetOption}
      title={title}
      caseOfSwitch={caseOfSwitch}
      callShowDetails={callShowDetails}
      isTitleNeeded={isTitleNeeded}
    />
  );
}

export default LicenseManagement;
