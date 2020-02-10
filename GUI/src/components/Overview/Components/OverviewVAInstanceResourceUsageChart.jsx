import React from 'react';
import _ from 'lodash';
import ReactEcharts from 'echarts-for-react';
import { I18n } from 'react-i18nify';
import ContainerChart from '../ContainerChart';
import { pieDonut } from '../config';

function VAInstanceResourceUsage(props) {
  const { dataSource, callShowDetails, isTitleNeeded, caseOfSwitch, title } = props;
  const {
    availablePhysicalMemory = 0,
    totalPhysicalMemory = 0,
    availableVirtualMemory = 0,
    totalVirtualMemory = 0,
    availableGpuMemory = 0,
    totalGpuMemory = 0
  } = dataSource;
  const PhysicalMemory = {
    series: {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            // fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        { value: totalPhysicalMemory - availablePhysicalMemory, name: 'In Use' },
        { value: availablePhysicalMemory, name: 'Remaining' }
      ],
      color: ['#61a0a8', '#749f83']
    }
  };
  const VirtualMemory = {
    series: {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            // fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        { value: totalVirtualMemory - availableVirtualMemory, name: 'In Use' },
        { value: availableVirtualMemory, name: 'Remaining' }
      ],
      color: ['#006699', '#4cabce']
    }
  };
  const GpuMemory = {
    series: {
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            // fontSize: '30',
            fontWeight: 'bold'
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: [
        { value: totalGpuMemory - availableGpuMemory, name: 'In Use' },
        { value: availableGpuMemory, name: 'Remaining' }
      ],
      color: ['#dd6b66', '#759aa0']
    }
  };
  const phsicalMemoryOption = _.cloneDeep(pieDonut);
  phsicalMemoryOption.title.text = I18n.t('overview.title.phsicalMemory');
  phsicalMemoryOption.series = Object.assign(phsicalMemoryOption.series, PhysicalMemory.series);
  const virtualMemoryOption = _.cloneDeep(pieDonut);
  virtualMemoryOption.title.text = I18n.t('overview.title.vitualMemory');
  virtualMemoryOption.series = Object.assign(virtualMemoryOption.series, VirtualMemory.series);
  const gpuMemoryOption = _.cloneDeep(pieDonut);
  gpuMemoryOption.title.text = I18n.t('overview.title.gpuMemory');
  gpuMemoryOption.series = Object.assign(gpuMemoryOption.series, GpuMemory.series);
  return (
    <ContainerChart
      title={title}
      onShowDetails={callShowDetails}
      isTitleNeeded={isTitleNeeded}
      caseOfSwitch={caseOfSwitch}
    >
      {/* {totalPhysicalMemory && ( */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <ReactEcharts option={phsicalMemoryOption} notMerge lazyUpdate style={{ width: '33%' }} />
        <ReactEcharts option={virtualMemoryOption} notMerge lazyUpdate style={{ width: '33%' }} />
        <ReactEcharts option={gpuMemoryOption} notMerge lazyUpdate style={{ width: '33%' }} />
      </div>
      {/* )} */}
    </ContainerChart>
  );
}

export default VAInstanceResourceUsage;
