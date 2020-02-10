/* eslint-disable no-unused-vars */
import React, { useCallback, useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {
  IVHTable,
  Pagination,
  TextField,
  ToolTip,
  TableToolbar,
  IVHTableAntd,
  AntdInput,
  Permission
} from 'components/common';
import materialKeys from 'utils/materialKeys';
import IconButton from '@material-ui/core/IconButton';
import PieChart from '@material-ui/icons/PieChart';
import Save from '@material-ui/icons/Save';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { dataUpdatedHandle } from 'utils/helpers';
import _ from 'lodash';
import { Button } from '../../common';
import LicenseExtraCell from './LicenseExtraCell';
import LicenseUploadDialog from './LicenseUploadDialog';

// import { licenseColumns } from '../config';

const useStyles = makeStyles(theme => {
  return {
    lineCenter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeBtn: {
      position: 'absolute',
      bottom: 0
      // right: 0
    },
    tableInput: {
      maxHeight: theme.spacing(2.5),
      maxWidth: theme.spacing(10)
    }
  };
});
function ShowDetails(props) {
  const classes = useStyles();
  const {
    onBack,
    dataSource,
    targetChart,
    handleGetDataByPage,
    distributionSource,
    setDistributionSource,
    handleGetDistribution,
    handleUploadLicense,
    getTableData,
    userId,
    saveDistribution,
    independentModule,
    engineStatusList,
    vaGatewayList
  } = props;
  const [pageNo, setpageNo] = useState(PAGE_NUMBER);
  const [pageSize, setpageSize] = useState(PAGE_SIZE);
  const [openLicenseUpload, setOpenLicenseUpload] = useState(false);
  const [targetLicense, setTargetLicense] = useState({});
  const [flagShowTable, setFlagShowTable] = useState(false);
  const [distributePageNo, setDistributePageNo] = useState(PAGE_NUMBER);
  const [distributePageSize, setDistributePageSize] = useState(PAGE_SIZE);
  const [assignLicenseList, setAssignLicenseList] = useState([]);

  const licenseColumns = [
    {
      title: I18n.t('overview.title.status'),
      dataIndex: 'appStatus',
      render: status => (
        <span>
          {_.findIndex(engineStatusList, { codeValue: status }) >= 0
            ? engineStatusList[_.findIndex(engineStatusList, { codeValue: status })].codeDesc
            : ''}
        </span>
      )
    },
    {
      title: I18n.t('overview.title.vaEngineName'),
      dataIndex: 'appName'
    },
    {
      title: I18n.t('overview.title.version'),
      dataIndex: 'appVersion'
    },
    {
      title: I18n.t('overview.title.vaEngineGateway'),
      dataIndex: 'appGateway'
    },
    {
      title: I18n.t('overview.title.vaEngineCategory'),
      dataIndex: 'appCategory'
    },
    {
      title: I18n.t('overview.title.totalLicense'),
      dataIndex: 'total'
    },
    {
      title: I18n.t('overview.title.licenseRemaining'),
      dataIndex: 'remain'
    },
    {
      title: I18n.t('overview.title.licenseInUse'),
      dataIndex: 'inUse'
    }
  ];

  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const onChangePage = (e, page) => {
    setpageNo(page);
    handleGetDataByPage(page, pageSize);
  };

  const onChangeRowsPerPage = e => {
    const { value } = e.target;
    setpageNo(PAGE_NUMBER);
    setpageSize(value);
    handleGetDataByPage(PAGE_NUMBER, value);
  };

  const onChangeDistributePage = (e, page) => {
    setDistributePageNo(page);
  };

  const onChangeRowsPerDistributePage = e => {
    const { value } = e.target;
    setDistributePageSize(value);
  };

  const licenseExtraCell = {
    columns: [
      {
        title: I18n.t('overview.title.actions'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: item => (
          <LicenseExtraCell
            disabled={item.total <= 0}
            itemData={item}
            openUploadPage={openLicenseUploadDialog}
            showTable={showTable}
          />
        ),
        key: '13'
      }
    ]
  };

  function handleAssignLicense(id, value, groupId) {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (_.toNumber(targetLicense.remain) >= _.toNumber(value)) {
        setDistributionSource(distributionSource => {
          distributionSource[_.findIndex(distributionSource, { _id: id })].total = value;
          return _.cloneDeep(distributionSource);
        });
        setAssignLicenseList(assignLicenseList => {
          if (_.findIndex(assignLicenseList, { _id: id }) >= 0) {
            assignLicenseList[_.findIndex(assignLicenseList, { _id: id })].assignLicense = value;
          } else {
            assignLicenseList.push({
              _id: id,
              appId: targetLicense.appId,
              assignLicense: value,
              // parentGroupId: groupDetail.parentId,
              groupId,
              userId
            });
          }

          return assignLicenseList;
        });
      }
    }
  }

  const distributionColumns = [
    {
      title: I18n.t('overview.title.groupName'),
      dataIndex: 'groupName'
    },
    {
      title: I18n.t('overview.title.assignLicense'),
      dataIndex: '',
      render: record => (
        <AntdInput
          disabled={targetLicense.remain <= 0 || !targetLicense.remain}
          value={record.total !== '' ? record.total : ''}
          onChange={e => handleAssignLicense(record._id, e.target.value, record.groupId)}
          className={classes.tableInput}
        />
      )
    },
    {
      title: I18n.t('overview.title.licenseRemaining'),
      dataIndex: 'remain'
      // key: 'remain'
    }
  ];
  function showTable(item) {
    setFlagShowTable(true);
    setTargetLicense(item);
    handleGetDistribution(item.appId);
  }
  function openLicenseUploadDialog(item) {
    setOpenLicenseUpload(true);
    setTargetLicense(item);
  }
  function closeLicenseUploadDialog() {
    setOpenLicenseUpload(false);
  }
  function uploadLicense(obj) {
    handleUploadLicense(obj).then(res => {
      dataUpdatedHandle(res, I18n.t('overview.title.uploadLicense'), () => {
        setOpenLicenseUpload(false);
        getTableData(pageNo, pageSize, 'getLicenseList');
      });
    });
  }

  React.useEffect(() => {
    setTargetLicense(targetLicense => {
      if (!_.isEmpty(targetLicense)) {
        return dataSource.items[_.findIndex(dataSource.items, { appId: targetLicense.appId })];
      } else {
        return targetLicense;
      }
    });
  }, [dataSource]);

  return (
    <>
      {!independentModule && (
        <div>
          <Typography color="textSecondary" variant="h6" style={{ display: 'inline' }}>
            {I18n.t('overview.title.licenseManagement')}
          </Typography>
          <Button size="small" color="primary" onClick={handleBack} style={{ float: 'right' }}>
            {I18n.t('overview.button.backToOverview')}
          </Button>
        </div>
      )}
      <div className={classes.lineCenter}>
        <Paper elevation={0} style={{ width: flagShowTable ? '50%' : '100%' }}>
          {targetChart}
        </Paper>
        <Paper
          elevation={0}
          style={{ display: flagShowTable ? 'inline' : 'none', width: '49%', position: 'relative' }}
        >
          <Typography color="inherit" variant="subtitle1">
            {I18n.t('overview.title.distributionByGroup')}
          </Typography>
          <TextField
            disabled
            value={targetLicense.appName || ''}
            label={I18n.t('overview.title.vaEngineName')}
            placeholder={I18n.t('overview.title.vaEngineName')}
            margin="dense"
          />
          <TextField
            disabled
            value={targetLicense.total || ''}
            label={I18n.t('overview.title.totalLicense')}
            placeholder={I18n.t('overview.title.totalLicense')}
            margin="dense"
          />
          <TextField
            disabled
            value={targetLicense.remain || ''}
            label={I18n.t('overview.title.licenseRemaining')}
            placeholder={I18n.t('overview.title.licenseRemaining')}
            margin="dense"
          />
          <TextField
            disabled
            value={targetLicense.inUse || ''}
            label={I18n.t('overview.title.licenseInUse')}
            placeholder={I18n.t('overview.title.licenseInUse')}
            margin="dense"
          />
          {/* <IVHTable
            dataSource={distributionSource || []}
            columns={distributionColumns}
            keyId="groupId"
          /> */}

          <IVHTableAntd
            columns={distributionColumns}
            dataSource={_.slice(
              distributionSource,
              distributePageNo * distributePageSize,
              (distributePageNo + 1) * distributePageSize
            )}
            rowKey="_id"
          />
          <Pagination
            page={distributePageNo}
            rowsPerPage={distributePageSize}
            count={(distributionSource ? distributionSource.length : 0) || 0}
            onChangePage={onChangeDistributePage}
            onChangeRowsPerPage={onChangeRowsPerDistributePage}
          />

          <div className={classes.closeBtn}>
            <ToolTip title={I18n.t('overview.button.close')}>
              <IconButton
                aria-label={I18n.t('overview.button.close')}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => setFlagShowTable(false)}
                // className={classes.closeBtn}
              >
                <PieChart />
              </IconButton>
            </ToolTip>

            <ToolTip title={I18n.t('overview.button.save')}>
              <IconButton
                aria-label={I18n.t('overview.button.save')}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={() => saveDistribution(assignLicenseList, targetLicense.appId)}
              >
                <Save />
              </IconButton>
            </ToolTip>
          </div>
        </Paper>
      </div>
      <Paper elevation={0} style={{ float: 'left', width: '100%' }}>
        <Permission materialKey={materialKeys['M4-159']}>
          <TableToolbar
            handleGetDataByPage={obj => {
              setpageNo(PAGE_NUMBER);
              handleGetDataByPage(PAGE_NUMBER, pageSize, obj);
            }}
            fieldList={[
              ['EngineName', 'engineName', 'iptType'],
              ['Status', 'status', 'dropdownType'],
              ['VA_Engine_Gateway', 'appGatewayId', 'dropdownType'],
              ['Version', 'version', 'iptType']
            ]}
            dataList={{
              Status: {
                data: engineStatusList,
                type: 'keyVal',
                id: 'codeValue',
                val: 'codeDesc'
              },
              VA_Engine_Gateway: {
                data: vaGatewayList,
                type: 'keyVal',
                id: 'id',
                val: 'name'
              }
            }}
          />
        </Permission>
        <IVHTable
          tableMaxHeight="300px"
          dataSource={(dataSource && dataSource.items) || []}
          columns={licenseColumns}
          extraCell={licenseExtraCell}
          keyId="appId"
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(dataSource && dataSource.totalNum) || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Paper>
      {openLicenseUpload && (
        <LicenseUploadDialog
          openDialog={openLicenseUpload}
          closeDialog={closeLicenseUploadDialog}
          handleSubmit={uploadLicense}
          itemData={targetLicense}
        />
      )}
    </>
  );
}

ShowDetails.defaultProps = {
  onBack: () => {},
  handleGetDataByPage: () => {},
  handleUploadLicense: () => {},
  getTableData: () => {},
  setDistributionSource: () => {},
  userId: '',
  saveDistribution: () => {},
  independentModule: false,
  engineStatusList: [],
  vaGatewayList: []
};

ShowDetails.propTypes = {
  onBack: PropTypes.func,
  handleGetDataByPage: PropTypes.func,
  handleUploadLicense: PropTypes.func,
  getTableData: PropTypes.func,
  setDistributionSource: PropTypes.func,
  userId: PropTypes.string,
  saveDistribution: PropTypes.func,
  independentModule: PropTypes.bool,
  engineStatusList: PropTypes.array,
  vaGatewayList: PropTypes.array
};

export default ShowDetails;
