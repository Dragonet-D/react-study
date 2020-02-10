import React from 'react';
import _ from 'lodash';
import LineChart from 'components/Overview/Chart/LineChart';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';

function ReportAggregateChart(props) {
  const { callShowDetails, isTitleNeeded, caseOfSwitch, dataSource, title } = props;
  const sourceArr = [];
  if (!_.isEqual(dataSource, {})) {
    for (const k in dataSource) {
      const { time = 0, data = 0 } = dataSource[k];
      sourceArr.push([
        moment(_.toNumber(time)).format(DATE_FORMAT),
        data.peopleCountIn,
        data.peopleCountOut
      ]);
    }
  } else {
    sourceArr.push([0, 0, 0, 0]);
  }
  const targetOption = {
    dataset: {
      source: [['', 'In', 'Out'], ...sourceArr]
    },
    xAxis: { type: 'category' },
    yAxis: {}
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

export default ReportAggregateChart;
