/* eslint-disable no-unused-vars */
import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import { Pagination, TableToolbar, IVHTableAntd, AntdInput, Permission } from 'components/common';
import materialKeys from 'utils/materialKeys';
import { dataUpdatedHandle } from 'utils/helpers';
import { handleEnginesListWithGroup, handleUpdateListData } from 'pages/UVAP/VAEngines/util';
import makeStyles from '@material-ui/core/styles/makeStyles';
import ButtonToolbar from './UserGroupButtonToolbar';

const useStyles = makeStyles(theme => {
  return {
    tableInput: {
      maxHeight: theme.spacing(2.5),
      maxWidth: theme.spacing(10)
    },
    statusTab: {
      display: 'flex',
      flexDirection: 'column'
    },
    messageTab: {
      fontSize: '85%',
      marginTop: theme.spacing(0.5)
    }
  };
});

function VaEnginesTable(props) {
  const classes = useStyles();
  const { dispatch, global, securityUserGroup, mode } = props;
  const {
    userId,
    commonWebsocketData,
    userInfo: { userGroup }
  } = global;
  const moduleName = 'securityUserGroup';
  const { enginesList, groupDetail, labelList, statusList, currentGroupId } =
    securityUserGroup || {};

  // data init
  const [pageNo, setPageNo] = useState(PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  // eslint-disable-next-line no-unused-vars
  const [searchParameters, setSearchParameters] = useState({});
  const [mainPageList, setMainPageList] = useState([]);
  const [rowSelectItems, setRowSelectItems] = useState([]);

  const [assignLicenseList, setAssignLicenseList] = useState([]);

  function handleRowItemSelect(ids, items) {
    setMainPageList(mainPageList => {
      return mainPageList.map(item => {
        if (_.findIndex(items, { appId: item.appId }) >= 0) {
          return {
            ...item,
            checked: true
          };
        } else {
          return {
            ...item,
            checked: false
          };
        }
      });
    });

    setAssignLicenseList(assignLicenseList => {
      return assignLicenseList.filter(item => _.findIndex(items, { appId: item.appId }) >= 0);
    });
    setRowSelectItems(ids);
  }

  const columns = [
    {
      title: I18n.t('vap.table.engines.status'),
      dataIndex: 'status',
      tooltipTitle: 'status.message',
      render: status => (
        <div className={classes.statusTab}>
          <span>
            {_.findIndex(statusList, { codeValue: status.name }) >= 0
              ? statusList[_.findIndex(statusList, { codeValue: status.name })].codeDesc
              : ''}
          </span>
          {status.message ? <span className={classes.messageTab}>{status.message}</span> : ''}
        </div>
      )
    },
    {
      title: I18n.t('vap.table.engines.name'),
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: I18n.t('vap.table.engines.label'),
      dataIndex: 'labels',
      key: 'labels',
      render: array => <span>{!_.isEmpty(array) ? array.join(';') : ''}</span>
    },
    {
      title: I18n.t('vap.table.engines.version'),
      dataIndex: 'appVersion',
      key: 'appVersion'
    },
    {
      title: I18n.t('vap.table.engines.remaining'),
      dataIndex: 'remaining',
      key: 'remaining'
    },
    {
      title: I18n.t('vap.table.engines.assignLicense'),
      dataIndex: '',
      key: '',
      render: record => (
        <>
          {!mode ? (
            <AntdInput
              disabled={
                !record.checked ||
                currentGroupId === 'a0001' ||
                currentGroupId === userGroup ||
                record.remaining <= 0 ||
                !record.remaining
              }
              value={record.assignLicense !== '' ? record.assignLicense : ''}
              onChange={e => handleAssignLicense(record.appId, e.target.value, record.remaining)}
              className={classes.tableInput}
            />
          ) : (
            <span>{record.assignLicense}</span>
          )}
        </>
      )
    }
  ];

  function handleAssignLicense(appId, value, remaining) {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      if (value <= remaining) {
        setMainPageList(mainPageList => {
          mainPageList[_.findIndex(mainPageList, { appId })].assignLicense = value;
          return _.cloneDeep(mainPageList);
        });

        setAssignLicenseList(assignLicenseList => {
          if (_.findIndex(assignLicenseList, { appId }) >= 0) {
            assignLicenseList[_.findIndex(assignLicenseList, { appId })].assignLicense = value;
          } else {
            assignLicenseList.push({
              appId,
              assignLicense: value,
              parentGroupId: userGroup,
              groupId: currentGroupId,
              userId
            });
          }
          return assignLicenseList;
        });
      }
    }
  }

  const rowSelectionConfig = {
    selectedRowKeys: rowSelectItems,
    onChange: handleRowItemSelect,
    getCheckboxProps() {
      return {
        disabled: currentGroupId === 'a0001' || currentGroupId === userGroup
      };
    }
  };

  // func init
  function updateSearchParameters(obj) {
    setSearchParameters(obj);
    getEnginesListFunc({ ...obj, pageNo, pageSize, groupId: currentGroupId });
  }
  function onChangePage(e, page) {
    setPageNo(page);
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    setPageNo(0);
    setPageSize(value);
  }
  function assignEngineToGroup() {
    const newAssignEngines = mainPageList.map(item => {
      if (rowSelectItems.indexOf(item.appId) >= 0) {
        return {
          appId: item.appId,
          status: 'Y'
        };
      } else {
        return {
          appId: item.appId,
          status: 'N'
        };
      }
    });
    dispatch({
      type: `${moduleName}/assignEngineToGroup`,
      payload: {
        createdId: userId,
        apps: newAssignEngines,
        groupId: currentGroupId,
        licenseInfo: assignLicenseList
      }
    }).then(res => {
      dataUpdatedHandle(res, I18n.t('vap.table.engines.assignToGroup'), () => {
        getEnginesListFunc({ ...searchParameters, pageNo, pageSize, groupId: currentGroupId });
        setRowSelectItems([]);
      });
    });
  }
  const getEnginesListFunc = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getEnginesList`,
        payload: {
          userId,
          pageNo,
          pageSize,
          groupId: currentGroupId,
          ...obj
        }
      });
    },
    [dispatch, currentGroupId, moduleName, pageNo, pageSize, userId]
  );

  const getEngineStatusList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getEngineStatusList`,
        payload: {
          userId,
          codeCategory: ['VAP_ENGINE_STATUS'],
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  const getLabelList = useCallback(
    (obj = {}) => {
      dispatch({
        type: `${moduleName}/getLabelList`,
        payload: {
          userId,
          codeCategory: ['VAP_LABELS'],
          ...obj
        }
      });
    },
    [dispatch, moduleName, userId]
  );

  const submitButton = (
    <Permission materialKey={materialKeys['M4-163']}>
      <ButtonToolbar data={mainPageList} handleSave={assignEngineToGroup} />
    </Permission>
  );

  useEffect(() => {
    getLabelList();
    getEngineStatusList();
  }, [getEngineStatusList, getLabelList]);

  useEffect(() => {
    setRowSelectItems(mainPageList.filter(item => item.checked).map(item => item.appId));
    if (mode) {
      setMainPageList(mainPageList.filter(item => item.checked));
    }
  }, [mainPageList, mode]);

  useEffect(() => {
    if (!_.isEmpty(commonWebsocketData)) {
      // commonWebsocketData.addEventListener('message', e => {
      // const data = JSON.parse(commonWebsocketData || '{}');
      const type = commonWebsocketData.type ? commonWebsocketData.type.toLocaleLowerCase() : '';
      const message = commonWebsocketData.message
        ? commonWebsocketData.message.toLocaleLowerCase()
        : '';
      if (
        type === 'vap' &&
        message === 'engine'
        // &&
        // _.findIndex(mainPageList, { appId: commonWebsocketData.data.id }) >= 0
      ) {
        // setMainPageList(mainPageList =>
        //   _.cloneDeep(handleUpdateListData(mainPageList, commonWebsocketData, 'appId'))
        // );
        setPageNo(PAGE_NUMBER);
        getEnginesListFunc({ pageNo: PAGE_NUMBER });
      }
      // });
    }
  }, [commonWebsocketData, getEnginesListFunc]);

  // get main page data
  useEffect(() => {
    getEnginesListFunc({ pageNo, pageSize, groupId: currentGroupId });
  }, [getEnginesListFunc, pageNo, pageSize, currentGroupId]);

  useEffect(() => {
    setMainPageList(
      handleEnginesListWithGroup(!_.isNil(enginesList) ? enginesList.items : [], currentGroupId) ||
        []
    );
  }, [enginesList, currentGroupId]);

  // const headerActionSetting = [
  //   {
  //     title: I18n.t('uvms.channelGroup.detailsBox.assignChannel'),
  //     action: 'assignChannel'
  //   },
  //   {
  //     title: I18n.t('uvms.channelGroup.detailsBox.assignLicense'),
  //     action: 'assignLicense'
  //   }
  // ];

  // function handleAction(target) {
  //   switch (target) {
  //     // case 'assignChannel':
  //     //   assignChannelToGroup();
  //     //   break;
  //     // case 'assignLicense':
  //     //   assignChannelToGroup();
  //     //   break;
  //     default:
  //       break;
  //   }
  // }

  return (
    <Fragment>
      <TableToolbar
        handleGetDataByPage={updateSearchParameters}
        fieldList={[
          ['Status', 'statusName', 'dropdownType'],
          ['VA_Name', 'name', 'iptType'],
          ['VA_Label', 'labels', 'dropdownType'],
          ['VA_Version', 'appVersion', 'iptType']
        ]}
        dataList={{
          VA_Label: {
            data: labelList,
            type: 'keyVal',
            id: 'codeDesc',
            val: 'codeValue'
          },
          Status: {
            data: statusList,
            type: 'keyVal',
            id: 'codeValue',
            val: 'codeDesc'
          }
        }}
      />

      {/* <TableHeaderAction headerActionSetting={headerActionSetting} handleAction={handleAction} /> */}

      <IVHTableAntd
        columns={columns}
        dataSource={mainPageList}
        rowSelection={!mode ? rowSelectionConfig : null}
        rowKey="appId"
      />

      <Pagination
        page={pageNo}
        rowsPerPage={pageSize}
        count={
          !mode
            ? enginesList && _.toNumber(enginesList.totalNum)
            : mainPageList && mainPageList.length
        }
        onChangePage={onChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
      {currentGroupId === 'a0001' || currentGroupId === userGroup ? '' : !mode && submitButton}
    </Fragment>
  );
}

export default connect(({ global, securityUserGroup, loading }) => ({
  global,
  securityUserGroup,
  loading
}))(VaEnginesTable);
