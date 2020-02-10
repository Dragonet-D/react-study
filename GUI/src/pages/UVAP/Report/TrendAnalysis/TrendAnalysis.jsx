import React, { Fragment, useState, useEffect, useReducer, useCallback } from 'react';
import { connect } from 'dva';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import {
  TrendFilterToolbar,
  CrowdAndPeopleChooseDrawer,
  // PeopleChooseDrawer,
  // TabPanelTrend,
  ReportSearchChart,
  ReportAggregateChart
} from 'components/UVAP';
import { handleReportTypeList } from 'pages/UVAP/Report/utils';
import { Tabs } from 'antd';
import { IVHTabsAntd } from 'components/common';

const { TabPane } = Tabs;

const pageInfoReducer = (pageInfo, action) => {
  switch (action.type) {
    case 'pindex':
      return { ...pageInfo, pindex: action.data };
    case 'psize':
      return { pindex: PAGE_NUMBER, psize: action.data };
    // case 'totalNum':
    //   return { ...pageInfo, totalNum: action.data || 0 };
    default:
      throw new Error();
  }
};

function TrendAnalysis(props) {
  // const classes = useStyles();
  const { dispatch, global, TrendAnalysis } = props;
  const { userId } = global;
  const moduleName = TrendAnalysis.namespace;
  const { reportTypeList, reportCrowdChart, AggregateList, channelList } = TrendAnalysis || {};
  const [pageInfo] = useReducer(pageInfoReducer, {
    pindex: PAGE_NUMBER,
    psize: PAGE_SIZE
  });
  const [parameters, setParameters] = useState({});
  const [chooseCrowdStatus, setChooseCrowdStatus] = useState(false);
  const [choosePeopleStatus, setChoosePeopleStatus] = useState(false);

  const [simpleReportTypeList, setSimpleReportTypeList] = useState([]);

  const [multipleDeivceItems, setMultipleDeivceItems] = useState([]);
  const [reportType, setReportType] = useState('vap.event.crowd');
  useEffect(() => {
    setSimpleReportTypeList(handleReportTypeList(reportTypeList));
  }, [reportTypeList]);

  const getReportList = useCallback(
    (obj = {}) => {
      // dispatch({
      //   type: `${moduleName}/getReportList`,
      //   payload: {
      //     userId,
      //     ...parameters,
      //     ...pageInfo,
      //     multipleDeivceItems,
      //     ...obj
      //   }
      // });
      if (reportType === 'vap.event.crowd') {
        dispatch({
          type: `${moduleName}/getGenerateCrowdChart`,
          payload: {
            userId,
            ...parameters,
            ...pageInfo,
            multipleDeivceItems,
            ...obj
          }
        });
      }
      if (reportType === 'vap.event.peoplecount') {
        dispatch({
          type: `${moduleName}/getAggregateReportList`,
          payload: {
            userId,
            ...parameters,
            ...pageInfo,
            multipleDeivceItems,
            ...obj
          }
        });
      }
    },
    [dispatch, moduleName, userId, parameters, pageInfo, multipleDeivceItems, reportType]
  );
  useEffect(() => {
    getReportList();
  }, [getReportList]);

  const getChannelList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getChannelList`,
        payload: {
          userId,
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  function clearTableList() {
    // setDataSource([]);
    // setTotalNum(0);
  }

  function handleChooseChannelClose() {
    if (reportType === 'vap.event.peoplecount') {
      setChoosePeopleStatus(false);
    } else {
      setChooseCrowdStatus(false);
    }
  }

  function handleChooseChannelOpen() {
    if (reportType === 'vap.event.peoplecount') {
      setChoosePeopleStatus(true);
    } else {
      setChooseCrowdStatus(true);
    }
  }
  // function handleChoosePeopleClose() {
  //   setChoosePeopleStatus(false);
  // }
  const handleChange = event => {
    if (event === '1') {
      setReportType('vap.event.crowd');
    } else {
      setReportType('vap.event.peoplecount');
    }
  };

  return (
    <Fragment>
      <div>
        <IVHTabsAntd
          defaultActiveKey="1"
          tabPosition="left"
          // style={{ height: 220 }}
          onChange={handleChange}
        >
          <TabPane tab="Crowd Detection" key="1">
            <>
              <TrendFilterToolbar
                reportTypeList={simpleReportTypeList}
                setParameters={setParameters}
                getReportList={getReportList}
                clearTableList={clearTableList}
                handleChooseChannelOpen={handleChooseChannelOpen}
                multipleDeivceItems={multipleDeivceItems}
              />
              <ReportSearchChart
                dataSource={reportCrowdChart || {}}
                title={I18n.t('overview.title.licenseManagement')}
                callShowDetails={reportCrowdChart}
                caseOfSwitch="reportSearchManagement"
                isTitleNeeded={false}
              />
              <CrowdAndPeopleChooseDrawer
                // channelData={channelTreeData}
                open={chooseCrowdStatus}
                onClose={handleChooseChannelClose}
                getChannelList={getChannelList}
                channelList={channelList}
                multipleDeivceItems={multipleDeivceItems}
                setMultipleDeivceItems={setMultipleDeivceItems}
              />
            </>
          </TabPane>
          <TabPane tab="People Counting" key="2">
            <>
              <TrendFilterToolbar
                reportTypeList={simpleReportTypeList}
                setParameters={setParameters}
                getReportList={getReportList}
                clearTableList={clearTableList}
                handleChooseChannelOpen={handleChooseChannelOpen}
                multipleDeivceItems={multipleDeivceItems}
              />
              {AggregateList.items && (
                <ReportAggregateChart
                  dataSource={AggregateList.items || {}}
                  title={I18n.t('overview.title.licenseManagement')}
                  callShowDetails={AggregateList.items}
                  caseOfSwitch="reportManagement"
                  isTitleNeeded={false}
                />
              )}
              <CrowdAndPeopleChooseDrawer
                open={choosePeopleStatus}
                onClose={handleChooseChannelClose}
                getChannelList={getChannelList}
                channelList={channelList}
                multipleDeivceItems={multipleDeivceItems}
                setMultipleDeivceItems={setMultipleDeivceItems}
              />
            </>
          </TabPane>
        </IVHTabsAntd>
      </div>
    </Fragment>
  );
}

export default connect(({ global, TrendAnalysis }) => ({ global, TrendAnalysis }))(TrendAnalysis);
