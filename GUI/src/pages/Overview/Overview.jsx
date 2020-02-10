import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import { isSuccess, dataUpdatedHandle } from 'utils/helpers';
import msgCenter from 'utils/messageCenter';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  CameraUsageChart,
  UserStateChart,
  OverviewDetails,
  LicenseManagementChart,
  VAInstanceResourceUsageChart,
  LicenseManagement,
  InstanceOverviewChart,
  OverviewSystemStatus
} from 'components/Overview';

let operation = '';
let lastPageNo = PAGE_NUMBER;
let lastPageSize = PAGE_SIZE;
let lastFilterObj = {};
const useStyles = makeStyles(theme => {
  return {
    item: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    tabRoot: {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:focus': {},
      '&:hover': {},
      '&$tabSelected': {
        fontWeight: theme.typography.fontWeightMedium
      }
    }
  };
});

function Overview(props) {
  const moduleName = 'overview';
  const classes = useStyles();
  const {
    dispatch,
    overview,
    global: { userId },
    theme
  } = props;
  const {
    overviewUserInfo,
    licenseChart,
    instanceOverviewChart,
    VAIRUsageChart,
    systemStatus,
    engineStatusList,
    vaGatewayList
  } = overview;
  const [activeIndex, setActiveIndex] = useState(0);
  const [detailTitle, setDetailTitle] = useState('');
  const [targetChart, setTargetChart] = useState(null);
  const [tableSource, setTableSource] = useState({});
  const [tableInfo, setTableInfo] = useState({});
  const [distributionSource, setDistributionSource] = useState([]);
  const [value, setValue] = React.useState(0);

  const init = useCallback(() => {
    dispatch({
      type: `${moduleName}/getOverviewSummary`,
      payload: userId
    });
    dispatch({
      type: `${moduleName}/getLicenseChart`,
      payload: {
        userId
      }
    });
    dispatch({
      type: `${moduleName}/getInstanceOverviewChart`,
      payload: { userId, status: ['running', 'waiting', 'not_started'], param: {} }
    });
    dispatch({
      type: `${moduleName}/getVAInstanceRUChart`,
      payload: {
        userId
      }
    });
    dispatch({
      type: `${moduleName}/getSystemStatus`
    });
    dispatch({
      type: `${moduleName}/getEngineStatusList`,
      payload: {
        userId,
        codeCategory: ['VAP_ENGINE_STATUS']
      }
    });
    dispatch({
      type: `${moduleName}/getVaGateway`,
      payload: {
        userId
      }
    });
  }, [dispatch, userId]);

  useEffect(() => {
    init();
  }, [init]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleGetSystemStatus = () => {
    dispatch({
      type: `${moduleName}/getSystemStatus`
    });
  };
  const handleGoBack = useCallback(() => {
    setActiveIndex(0);
  }, []);
  function handleGetDistribution(appId) {
    dispatch({
      type: `${moduleName}/getDistribution`,
      payload: { appId, userId }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        if (res.data) {
          setDistributionSource(res.data.map((item, index) => ({ ...item, _id: index })));
        }
      } else {
        msgCenter.warn(res.message, '');
      }
    });
  }
  const getTableData = useCallback(
    (pageNo, pageSize, prop, param) => {
      let info = Object.assign({}, { pageSize, pageNo });
      if (operation === 'getUserState') {
        info.searchUserId = userId;
        info = { ...param, ...info };
      } else {
        info.userId = userId;
        info.param = param;
      }
      dispatch({
        type: `${moduleName}/${prop}`,
        payload: {
          ...info
        } // uid,param only for user status search
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          if (res.data) {
            if (
              operation === 'getCameraUsage'
              // || operation === 'getLicenseList'
            ) {
              const filterArr = res.data.slice(pageNo * pageSize, pageNo * pageSize + pageSize);
              setTableSource({ items: filterArr, totalNum: res.data.length });
            } else if (operation === 'getUserState') {
              setTableSource({ items: res.data.items, totalNum: res.data.totalNum });
            } else {
              setTableSource(res.data);
            }
          }
        } else {
          msgCenter.warn(res.message, '');
        }
      });
    },
    [dispatch, userId]
  );
  const handleGetDataByPage = useCallback(
    (pageNo, pageSize, filterObj) => {
      lastPageNo = pageNo;
      lastPageSize = pageSize;
      if (filterObj) {
        lastFilterObj = filterObj;
      }
      getTableData(pageNo, pageSize, operation, lastFilterObj);
    },
    [getTableData]
  );
  const handleDisConnectCam = useCallback(
    id => {
      dispatch({
        type: `${moduleName}/disconnectCam`,
        payload: { id }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msgCenter.success(res.message, '');
          handleGetDataByPage(lastPageNo, lastPageSize, lastFilterObj);
        } else {
          msgCenter.warn(res.message, '');
        }
      });
    },
    [dispatch, handleGetDataByPage]
  );
  const handleDisConnectUser = useCallback(
    id => {
      dispatch({
        type: `${moduleName}/disconnectUser`,
        payload: { auditUuid: id, loginUserId: userId }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msgCenter.success(res.message, '');
          handleGetDataByPage(lastPageNo, lastPageSize, lastFilterObj);
        } else {
          msgCenter.warn(res.message, '');
        }
      });
    },
    [dispatch, userId, handleGetDataByPage]
  );

  function handleUploadLicense(obj = {}) {
    return dispatch({
      type: `${moduleName}/uploadLicense`,
      payload: { ...obj, userId }
    });
  }

  function saveDistribution(assignLicenseList, appId) {
    dispatch({
      type: `${moduleName}/saveDistribution`,
      payload: assignLicenseList
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('overview.title.saveDistribution'), () => {
        handleGetDistribution(appId);
      });
    });
  }

  const callShowDetails = useCallback(
    target => {
      setTableSource({});
      lastFilterObj = {};
      switch (target) {
        case 'cameraUsage':
          setActiveIndex(1);
          setDetailTitle(I18n.t('overview.title.cameraUsage'));
          setTargetChart(
            <CameraUsageChart
              dataSource={overviewUserInfo.cameraUsage || {}}
              theme={theme}
              callShowDetails={callShowDetails}
              isTitleNeeded={false}
              title={I18n.t('overview.title.cameraUsage')}
              caseOfSwitch="cameraUsage"
            />
          );
          setTableInfo({
            columns: 'cameraColumns',
            keyId: 'sessionId',
            extraCell: 'cameraExtraCell',
            extraMethod: handleDisConnectCam,
            extraParam: 'sessionId',
            fieldList: [
              ['CameraName', 'cameraName', 'iptType'],
              ['ParentDevice', 'parentDevice', 'iptType'],
              ['URI_', 'uriAddress', 'iptType'],
              ['RecordingSchedule', 'scheduleName', 'iptType'],
              ['Model', 'model', 'iptType'],
              ['SessionStatus', 'status', 'iptType'],
              ['ConnectedBy', 'connectedBy', 'iptType']
            ]
          });
          operation = 'getCameraUsage';
          handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
          break;
        case 'userState':
          setActiveIndex(1);
          setDetailTitle(I18n.t('overview.title.userState'));
          setTargetChart(
            <UserStateChart
              dataSource={overviewUserInfo.userStatus || {}}
              theme={theme}
              callShowDetails={callShowDetails}
              caseOfSwitch="userState"
              isTitleNeeded={false}
              title={I18n.t('overview.title.userState')}
            />
          );
          setTableInfo({
            columns: 'userColumns',
            keyId: 'userId',
            extraCell: 'userExtraCell',
            extraMethod: handleDisConnectUser,
            extraParam: 'userLoginInfoId',
            fieldList: [
              ['UserID', 'userId', 'iptType'],
              ['FullName', 'userFullName', 'iptType'],
              ['Email', 'userEmail', 'iptType'],
              ['Status', 'userStatus', 'iptType']
            ]
          });
          operation = 'getUserState';
          handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
          break;
        case 'licenseManagement':
          setActiveIndex(2);
          setDetailTitle(I18n.t('overview.title.licenseManagement'));
          setTargetChart(
            <LicenseManagementChart
              dataSource={licenseChart || {}}
              title={I18n.t('overview.title.licenseManagement')}
              callShowDetails={callShowDetails}
              caseOfSwitch="licenseManagement"
              isTitleNeeded={false}
            />
          );
          operation = 'getLicenseList';
          handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
          break;
        case 'instanceOverview':
          setActiveIndex(1);
          setDetailTitle(I18n.t('overview.title.instanceOverview'));
          setTargetChart(
            <InstanceOverviewChart
              dataSource={instanceOverviewChart || {}}
              title={I18n.t('overview.title.instanceOverview')}
              callShowDetails={callShowDetails}
              caseOfSwitch="instanceOverview"
              isTitleNeeded={false}
            />
          );
          setTableInfo({
            columns: 'instanceOverviewColumns',
            keyId: 'instanceId',
            fieldList: [
              ['Type', 'type', 'iptType'],
              ['Status', 'status', 'iptType'],
              ['Name', 'name', 'iptType'],
              ['VA_Engine_Name', 'engineName', 'iptType'],
              ['Channel', 'channel', 'iptType'],
              ['Priority', 'priority', 'iptType']
            ]
          });
          operation = 'getInstanceOverviewList';
          handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
          break;
        case 'vaInstanceResourceUsage':
          setActiveIndex(1);
          setDetailTitle(I18n.t('overview.title.vaInstanceResourceUsage'));
          setTargetChart(
            <VAInstanceResourceUsageChart
              dataSource={VAIRUsageChart || {}}
              title={I18n.t('overview.title.vaInstanceResourceUsage')}
              callShowDetails={callShowDetails}
              caseOfSwitch="vaInstanceResourceUsage"
              isTitleNeeded={false}
            />
          );
          setTableInfo({
            columns: 'vaIRUColumns',
            keyId: 'uuid',
            fieldList: [
              ['Name', 'name', 'iptType'],
              ['VA_Engine_Name', 'engineName', 'iptType'],
              ['Channel', 'channel', 'iptType'],
              ['Priority', 'priority', 'iptType']
            ]
          });
          operation = 'getVAInstanceRUList';
          handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
          break;
        default:
          break;
      }
    },
    [
      theme,
      VAIRUsageChart,
      handleDisConnectCam,
      handleGetDataByPage,
      handleDisConnectUser,
      instanceOverviewChart,
      licenseChart,
      overviewUserInfo.cameraUsage,
      overviewUserInfo.userStatus
    ]
  );
  return (
    <>
      <div className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          classes={{ root: classes.tabsRoot }}
        >
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              selected: classes.tabSelected
            }}
            label="Overall Status"
          />
          <Tab
            disableRipple
            classes={{
              root: classes.tabRoot,
              selected: classes.tabSelected
            }}
            label="System Status"
            onClick={() => handleGetSystemStatus()}
          />
        </Tabs>
      </div>
      {value === 0 && (
        <>
          <Typography
            component="div"
            role="tabpanel"
            hidden={activeIndex !== 0}
            id={`full-width-tabpanel-${activeIndex}`}
            aria-labelledby={`full-width-tab-${activeIndex}`}
          >
            <div className={classes.item}>
              <CameraUsageChart
                title={I18n.t('overview.title.cameraUsage')}
                dataSource={overviewUserInfo.cameraUsage || {}}
                theme={theme}
                callShowDetails={callShowDetails}
                caseOfSwitch="cameraUsage"
              />
              <UserStateChart
                title={I18n.t('overview.title.userState')}
                dataSource={overviewUserInfo.userStatus || {}}
                theme={theme}
                callShowDetails={callShowDetails}
                caseOfSwitch="userState"
              />
              <LicenseManagementChart
                dataSource={licenseChart || {}}
                title={I18n.t('overview.title.licenseManagement')}
                callShowDetails={callShowDetails}
                caseOfSwitch="licenseManagement"
              />
              <InstanceOverviewChart
                dataSource={instanceOverviewChart || {}}
                title={I18n.t('overview.title.instanceOverview')}
                callShowDetails={callShowDetails}
                caseOfSwitch="instanceOverview"
              />
            </div>
            <VAInstanceResourceUsageChart
              dataSource={VAIRUsageChart || {}}
              title={I18n.t('overview.title.vaInstanceResourceUsage')}
              callShowDetails={callShowDetails}
              caseOfSwitch="vaInstanceResourceUsage"
              theme={theme}
            />
          </Typography>
          <Typography
            component="div"
            role="tabpanel"
            hidden={activeIndex !== 1}
            id={`full-width-tabpanel-${activeIndex}`}
            aria-labelledby={`full-width-tab-${activeIndex}`}
          >
            {activeIndex === 1 && (
              <OverviewDetails
                onBack={handleGoBack}
                detailTitle={detailTitle}
                dataSource={tableSource}
                tableInfo={tableInfo}
                targetChart={targetChart}
                handleGetDataByPage={handleGetDataByPage}
              />
            )}
          </Typography>
          <Typography
            component="div"
            role="tabpanel"
            hidden={activeIndex !== 2}
            id={`full-width-tabpanel-${activeIndex}`}
            aria-labelledby={`full-width-tab-${activeIndex}`}
          >
            {activeIndex === 2 && (
              <LicenseManagement
                onBack={handleGoBack}
                detailTitle={detailTitle}
                dataSource={tableSource}
                targetChart={targetChart}
                handleGetDataByPage={handleGetDataByPage}
                handleGetDistribution={handleGetDistribution}
                distributionSource={distributionSource}
                setDistributionSource={setDistributionSource}
                handleUploadLicense={handleUploadLicense}
                getTableData={getTableData}
                userId={userId}
                saveDistribution={saveDistribution}
                engineStatusList={engineStatusList}
                vaGatewayList={vaGatewayList}
              />
            )}
          </Typography>
        </>
      )}
      {value === 1 && <OverviewSystemStatus dataSource={systemStatus || {}} />}
    </>
  );
}

export default connect(({ global, overview }) => ({ global, overview }))(Overview);
