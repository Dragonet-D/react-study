import React from 'react';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import PropTypes from 'prop-types';
import ContainerChart from '../ContainerChart';
import { pieDonut } from '../config';

function PieChart(props) {
  const { title, isTitleNeeded, caseOfSwitch, callShowDetails, targetOption, children } = props;
  function setOption() {
    const option = _.cloneDeep(pieDonut);
    if (targetOption) {
      // option = Object.assign(option, targetOption);
      option.legend = Object.assign(option.legend, targetOption.legend);
      option.series = Object.assign(option.series, targetOption.series);
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
      <ReactEcharts
        notMerge
        lazyUpdate
        option={setOption()}
        style={{ height: '300px', width: !children ? '100%' : '85%' }}
      />
      {children}
    </ContainerChart>
  );
}

PieChart.defaultProps = {
  title: ''
};

PieChart.propTypes = {
  title: PropTypes.string
};

export default PieChart;
