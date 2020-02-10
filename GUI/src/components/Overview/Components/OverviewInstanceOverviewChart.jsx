import React from 'react';
import BarChart from '../Chart/BarChart';

function OverviewInstanceOverviewChart(props) {
  const { dataSource, callShowDetails, isTitleNeeded, caseOfSwitch, title } = props;
  const { jobVa = 0, liveVa = 0, serviceVa = 0 } = dataSource;
  const targetOption = {
    dataset: {
      source: [
        [' ', 'running', 'waiting', 'not started'],
        [
          'Job Va',
          jobVa && jobVa.running ? jobVa.running : 0,
          jobVa && jobVa.waiting ? jobVa.waiting : 0,
          jobVa && jobVa.not_started ? jobVa.not_started : 0
        ],
        [
          'Live Va',
          liveVa && liveVa.running ? liveVa.running : 0,
          liveVa && liveVa.waiting ? liveVa.waiting : 0,
          liveVa && liveVa.not_started ? liveVa.not_started : 0
        ],
        [
          'Service Va',
          serviceVa && serviceVa.running ? serviceVa.running : 0,
          serviceVa && serviceVa.waiting ? serviceVa.waiting : 0,
          serviceVa && serviceVa.not_started ? serviceVa.not_started : 0
        ]
      ]
    },
    series: [
      { type: 'bar', color: '#006699' },
      { type: 'bar', color: '#749f83' },
      { type: 'bar', color: '#ea7e53' }
    ]
  };
  return (
    <BarChart
      targetOption={targetOption}
      title={title}
      isTitleNeeded={isTitleNeeded}
      callShowDetails={callShowDetails}
      caseOfSwitch={caseOfSwitch}
    />
  );
}

export default OverviewInstanceOverviewChart;
