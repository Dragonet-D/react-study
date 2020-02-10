import React from 'react';
import PieChart from '../Chart/PieChart';

function UserState(props) {
  const { dataSource, callShowDetails, isTitleNeeded, caseOfSwitch, title } = props;
  const { totalUser = 0, avliableUser = 0 } = dataSource;

  const targetOption = {
    legend: {
      data: ['Offline Users', 'Online Users']
    },
    series: {
      data: [
        { value: totalUser - avliableUser, name: 'Offline Users' },
        { value: avliableUser, name: 'Online Users' }
      ],
      color: ['#61a0a8', '#2f4554', '#91c7ae', '#d48265']
    }
  };
  return (
    <PieChart
      targetOption={targetOption}
      title={title}
      caseOfSwitch={caseOfSwitch}
      callShowDetails={callShowDetails}
      isTitleNeeded={isTitleNeeded}
    />
  );
}

export default UserState;
