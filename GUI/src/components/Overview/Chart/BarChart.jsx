import React from 'react';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ContainerChart from '../ContainerChart';
import { barChart } from '../config';

function BarChart(props) {
  const { title, callShowDetails, isTitleNeeded, caseOfSwitch, targetOption } = props;
  function setOption() {
    let option = _.cloneDeep(barChart);
    if (targetOption) {
      option = Object.assign(option, targetOption);
    }
    return option;
  }
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

BarChart.defaultProps = {
  title: ''
};

BarChart.propTypes = {
  title: PropTypes.string
};

export default BarChart;
