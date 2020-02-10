import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { lineChart } from '../config';
import ContainerChart from '../ContainerChart';

function LineChart(props) {
  const { title, callShowDetails, isTitleNeeded, caseOfSwitch, targetOption } = props;
  function setOption() {
    let option = _.cloneDeep(lineChart);
    if (targetOption) {
      option = Object.assign(option, targetOption);
    }
    return option;
  }
  // return (
  //   <ContainerChart title="VA Instance Usage">
  //     <div>123</div>
  //   </ContainerChart>
  // );
  return (
    <ContainerChart
      title={title}
      onShowDetails={callShowDetails}
      isTitleNeeded={isTitleNeeded}
      caseOfSwitch={caseOfSwitch}
    >
      <ReactEcharts option={setOption()} notMerge lazyUpdate />
    </ContainerChart>
  );
}
LineChart.defaultProps = {
  title: ''
};

LineChart.propTypes = {
  title: PropTypes.string
};

export default LineChart;
