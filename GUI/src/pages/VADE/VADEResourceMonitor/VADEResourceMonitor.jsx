import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
// import msg from 'utils/messageCenter';
import { IVHTable, BasicLayoutTitle } from 'components/common';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { I18n } from 'react-i18nify';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ReactEcharts from 'echarts-for-react';
import getUrls from 'utils/urls/index';
import Autorenew from '@material-ui/icons/Autorenew';
import { Tooltip } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};
const styles = () => ({
  root: {
    flexGrow: 1
  },
  tabsRoot: {},
  tabsIndicator: {},
  tabSelected: {},
  // typography: {
  //   padding: theme.spacing.unit * 3
  // },
  pageStyle: {
    marginTop: '10px',
    paddingBottom: '20px'
  },
  echartsBox: {
    width: '100%',
    height: '350px'
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: 600,
    padding: '8px 0 8px 20px',
    color: 'ivory'
  }
});
class VADEResourceMonitor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tadSelectVal: 0,
      serverResourceTotal: '',
      pageNoSR: PAGE_NUMBER,
      pageSizeSR: PAGE_SIZE,
      pageNoTR: PAGE_NUMBER,
      pageSizeTR: PAGE_SIZE
    };
    this.pageNoS = 0;
    this.pageSizeS = 5;
    this.pageNoT = 0;
    this.pageSizeT = 5;
    this.ws = null;
  }

  taskColumns = [
    {
      title: I18n.t('vade.config.taskName'),
      dataIndex: 'taskName'
    },
    {
      title: I18n.t('vade.config.taskStatus'),
      dataIndex: 'taskStatus'
    },
    {
      title: I18n.t('vade.config.processName'),
      dataIndex: 'processName'
    },
    {
      title: I18n.t('vade.config.cpuLoad'),
      dataIndex: 'cpuLoad',
      render: val => `${(val * 100).toFixed(2)}%`
    },
    {
      title: I18n.t('vade.config.gpuMemory'),
      dataIndex: 'gpuMemory',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: I18n.t('vade.config.physicalMemory'),
      dataIndex: 'physicalMemory',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: I18n.t('vade.config.virtualMemory'),
      dataIndex: 'virtualMemory',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    }
  ];

  serverColumns = [
    {
      title: I18n.t('vade.config.hostIp'),
      dataIndex: 'hostIp'
    },
    {
      title: { title: I18n.t('vade.config.cpuLoad_short'), tooltip: I18n.t('vade.config.cpuLoad') },
      dataIndex: 'cpuLoad',
      render: val => `${(val * 100).toFixed(2)}%`
    },
    {
      title: { title: I18n.t('vade.config.numGPUs_short'), tooltip: I18n.t('vade.config.numGPUs') },
      dataIndex: 'numGPUs'
    },
    {
      title: { title: I18n.t('vade.config.numCPUs_short'), tooltip: I18n.t('vade.config.numCPUs') },
      dataIndex: 'numCPUs'
    },
    {
      title: {
        title: I18n.t('vade.config.gpuMemoryAvailable_short'),
        tooltip: I18n.t('vade.config.gpuMemoryAvailable')
      },
      dataIndex: 'gpuMemoryAvailable',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: {
        title: I18n.t('vade.config.gpuMemoryTotal_short'),
        tooltip: I18n.t('vade.config.gpuMemoryTotal')
      },
      dataIndex: 'gpuMemoryTotal',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: {
        title: I18n.t('vade.config.memoryPhysicalAvailable_short'),
        tooltip: I18n.t('vade.config.memoryPhysicalAvailable')
      },
      dataIndex: 'memoryPhysicalAvailable',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: {
        title: I18n.t('vade.config.memoryPhysicalTotal_short'),
        tooltip: I18n.t('vade.config.memoryPhysicalTotal')
      },
      dataIndex: 'memoryPhysicalTotal',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: {
        title: I18n.t('vade.config.memoryVirtualAvailable_short'),
        tooltip: I18n.t('vade.config.memoryVirtualAvailable')
      },
      dataIndex: 'memoryVirtualAvailable',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    },
    {
      title: {
        title: I18n.t('vade.config.memoryVirtualTotal_short'),
        tooltip: I18n.t('vade.config.memoryVirtualTotal')
      },
      dataIndex: 'memoryVirtualTotal',
      render: val => `${(val / (1024 * 1024 * 1024)).toFixed(2)}GB`
    }
  ];

  componentWillReceiveProps(nextProps) {
    const { vadeResourceMonitor } = this.props;
    const { serverResourceTotal } = vadeResourceMonitor;
    if (!_.isEqual(nextProps.vadeResourceMonitor.serverResourceTotal, serverResourceTotal)) {
      this.setState({
        serverResourceTotal: nextProps.vadeResourceMonitor.serverResourceTotal
      });
    }
  }

  handleChange = (event, tadSelectVal) => {
    this.setState({ tadSelectVal });
  };

  handleChangeIndex = index => {
    this.setState({ tadSelectVal: index });
  };

  handleGetServerResourceDataByPage = (pageNo, pageSize) => {
    const { dispatch } = this.props;
    if (pageNo) {
      this.pageNoS = pageNo;
    }
    if (pageSize) {
      this.pageSizeS = pageSize;
    }
    dispatch({
      type: 'vadeResourceMonitor/getServerResource',
      payload: { pageNo, pageSize }
    });
  };

  handleGetTaskResourceDataByPage = (pageNo, pageSize) => {
    const { dispatch } = this.props;
    if (pageNo) {
      this.pageNoT = pageNo;
    }
    if (pageSize) {
      this.pageSizeT = pageSize;
    }
    dispatch({
      type: 'vadeResourceMonitor/getTaskResource',
      payload: { pageNo, pageSize }
    });
  };

  async estabConnectWithWS() {
    const urls = getUrls.websocket;
    const { global } = this.props;
    const ws = new WebSocket(`${urls.vadeMonitor.url}/${global.userId}`);
    this.ws = ws;
    ws.onopen = () => {
      // eslint-disable-next-line no-console
      console.log('connect success');
    };
    ws.onmessage = msgs => {
      try {
        // eslint-disable-next-line no-console
        console.log('RS MSG:', msgs.data);
        if (typeof msgs.data === 'string') {
          this.setState({
            serverResourceTotal: JSON.parse(msgs.data)
          });
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('receive wrong msg');
      }
    };
    ws.onclose = () => {
      // eslint-disable-next-line no-console
      console.log('ws connect close');
    };

    window.onbeforeunload = () => {
      if (ws) {
        ws.close();
      }
    };
  }

  onChangePageTR = (e, page) => {
    const { pageSizeTR } = this.state;
    this.setState({ pageNoTR: page });
    this.handleGetTaskResourceDataByPage(page, pageSizeTR);
  };

  onChangeRowsPerPageTR = e => {
    const { value } = e.target;
    this.setState({ pageNoTR: PAGE_NUMBER, pageSizeTR: value });
    this.handleGetTaskResourceDataByPage(PAGE_NUMBER, value);
  };

  onChangePageSR = (e, page) => {
    const { pageSizeSR } = this.state;
    this.setState({ pageNoSR: page });
    this.handleGetServerResourceDataByPage(page, pageSizeSR);
  };

  onChangeRowsPerPageSR = e => {
    const { value } = e.target;
    this.setState({ pageNoSR: PAGE_NUMBER, pageSizeSR: value });
    this.handleGetServerResourceDataByPage(PAGE_NUMBER, value);
  };

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'vadeResourceMonitor/getServerResourceTotal'
    // });
    this.handleGetServerResourceDataByPage(0, 5);
    this.handleGetTaskResourceDataByPage(0, 5);
    this.estabConnectWithWS();
  }

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    const { vadeResourceMonitor, classes, theme } = this.props;
    const { taskResourceList, serverResourceList } = vadeResourceMonitor;
    const {
      serverResourceTotal,
      pageNoSR,
      pageSizeSR,
      pageNoTR,
      pageSizeTR,
      tadSelectVal
    } = this.state;
    const option = {
      title: {
        text: 'Task Total',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: '60%',
        top: 'center',
        data: ['gpuMemoryAvailable', 'gpuMemoryUnavailable'],
        textStyle: {
          color: '#ccc'
        }
      },
      series: [
        {
          type: 'pie',
          color: ['#dd6b66', '#759aa0'],
          radius: '70%',
          center: ['30%', '60%'],
          data: [
            {
              name: 'gpuMemoryAvailable',
              value:
                serverResourceTotal && serverResourceTotal.gpuMemoryAvailable
                  ? serverResourceTotal.gpuMemoryAvailable / (1024 * 1024)
                  : 100
            },
            {
              name: 'gpuMemoryUnavailable',
              value:
                serverResourceTotal && serverResourceTotal.gpuMemoryTotal
                  ? (serverResourceTotal.gpuMemoryTotal - serverResourceTotal.gpuMemoryAvailable) /
                    (1024 * 1024)
                  : 0
            }
          ],
          label: {
            position: 'inside',
            formatter: '{c} ({d}%)',
            fontStyle: 'normal'
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    };
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <BasicLayoutTitle titleName={I18n.t('vade.config.resourceMonitor')} />
        <Paper elevation={0}>
          <ReactEcharts option={option} className={classes.echartsBox} />
        </Paper>
        <Paper elevation={0} className={classes.pageStyle} style={{ flex: '1 1 auto' }}>
          <AppBar position="static" color="inherit">
            <Tabs
              value={tadSelectVal}
              indicatorColor="primary"
              textColor="primary"
              onChange={this.handleChange}
              classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
            >
              <Tab
                label={I18n.t('vade.config.taskResource')}
                disableRipple
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              />
              <Tab
                label={I18n.t('vade.config.serverResource')}
                disableRipple
                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
              />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={tadSelectVal}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer dir={theme.direction}>
              <Tooltip title="Refresh">
                <IconButton
                  aria-label="Refresh"
                  onClick={() => this.handleGetTaskResourceDataByPage(this.pageNoT, this.pageSizeT)}
                >
                  <Autorenew />
                </IconButton>
              </Tooltip>
              <IVHTable
                dataSource={(taskResourceList && taskResourceList.items) || []}
                columns={this.taskColumns}
                // tableMaxHeight="calc(100% - 160px)"
                keyId="uuid"
              />
              <TablePagination
                page={pageNoTR}
                rowsPerPage={pageSizeTR}
                count={(taskResourceList && taskResourceList.totalNum) || 0}
                onChangePage={this.onChangePageTR}
                onChangeRowsPerPage={this.onChangeRowsPerPageTR}
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                backIconButtonProps={{
                  'aria-label': 'previous page'
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page'
                }}
              />
            </TabContainer>
            <TabContainer dir={theme.direction}>
              <Tooltip title="Refresh">
                <IconButton
                  aria-label="Refresh"
                  onClick={() =>
                    this.handleGetServerResourceDataByPage(this.pageNoS, this.pageSizeS)
                  }
                >
                  <Autorenew />
                </IconButton>
              </Tooltip>
              <IVHTable
                dataSource={(serverResourceList && serverResourceList.items) || []}
                columns={this.serverColumns}
                // tableMaxHeight="calc(100% - 160px)"
                keyId="uuid"
              />
              <TablePagination
                page={pageNoSR}
                rowsPerPage={pageSizeSR}
                count={(serverResourceList && serverResourceList.totalNum) || 0}
                onChangePage={this.onChangePageSR}
                onChangeRowsPerPage={this.onChangeRowsPerPageSR}
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                backIconButtonProps={{
                  'aria-label': 'previous page'
                }}
                nextIconButtonProps={{
                  'aria-label': 'next page'
                }}
              />
            </TabContainer>
          </SwipeableViews>
        </Paper>
      </div>
    );
  }
}
export default withStyles(styles)(
  connect(({ vadeResourceMonitor, global }) => ({ vadeResourceMonitor, global }))(
    VADEResourceMonitor
  )
);
