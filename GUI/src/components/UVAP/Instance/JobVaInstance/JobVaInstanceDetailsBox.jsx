import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import { Pagination, IVHTable, TextField, SingleSelect } from 'components/common';
import PropTypes from 'prop-types';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Collapse from '@material-ui/core/Collapse';
import { handleCheckedItem, handleInitCheckedItems, handleInitCheckedList } from '../util';

const useStyles = makeStyles(theme => {
  return {
    listContainer: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginBottom: theme.spacing(2),
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`,
      paddingBottom: theme.spacing(1)
    },
    detailsBox: {
      height: '93%',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      position: 'relative'
    },
    toolbar_button: {
      marginLeft: 'auto',
      marginRight: theme.spacing(2)
    },
    inputBox: {
      display: 'flex',
      alignItems: 'center'
    },
    textField_details: {
      flex: 1,
      marginBottom: theme.spacing(2)
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
const pageInfoReducer = (pageInfo, action) => {
  switch (action.type) {
    case 'pageNo':
      return { ...pageInfo, pageNo: action.data };
    case 'pageSize':
      return { pageNo: PAGE_NUMBER, pageSize: action.data };
    default:
      throw new Error();
  }
};

function JobVaInstanceDetailsBox(props) {
  const classes = useStyles();
  const {
    instanceInfo,
    dispatchInstanceInfo,
    dispatchSourceDetails,
    engineList,
    getEngineList,
    dispatchArgument,
    editDialogType,
    validation,
    priorityList,
    engineStatusList
  } = props;
  // page info
  const [pageInfo, dispatchPageInfo] = useReducer(pageInfoReducer, {
    pageNo: PAGE_NUMBER,
    pageSize: PAGE_SIZE
  });
  // page func
  function onChangePage(e, page) {
    dispatchPageInfo({ type: 'pageNo', data: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchPageInfo({ type: 'pageSize', data: value });
  }
  // table list init
  const [dataSource, setDataSource] = useState([]);

  const [rowSelectItems, setRowSelectItems] = useState([]);
  useEffect(() => {
    if (editDialogType === 'create') {
      getEngineList(pageInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEngineList, pageInfo]);

  useEffect(() => {
    if (editDialogType === 'update' && instanceInfo.appId !== '' && !_.isNil(instanceInfo.appId)) {
      getEngineList({ appId: instanceInfo.appId, ...pageInfo });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getEngineList, instanceInfo.appId]);

  useEffect(() => {
    setDataSource(handleInitCheckedList(instanceInfo.appId, engineList.items, 'appId'));
    setRowSelectItems(handleInitCheckedItems(instanceInfo.appId, engineList.items));
  }, [engineList, instanceInfo.appId]);

  // table columns setting
  const columns = [
    {
      title: I18n.t('vap.table.engines.vaEngineName'),
      dataIndex: 'name'
    },
    {
      title: I18n.t('vap.table.engines.status'),
      dataIndex: 'status',
      tooltipTitle: 'status.message',
      render: status => (
        <div className={classes.statusTab}>
          <span>
            {_.findIndex(engineStatusList, { codeValue: status.name }) >= 0
              ? engineStatusList[_.findIndex(engineStatusList, { codeValue: status.name })].codeDesc
              : ''}
          </span>
          {status.message ? <span className={classes.messageTab}>{status.message}</span> : ''}
        </div>
      )
    },
    {
      title: I18n.t('vap.table.engines.version'),
      dataIndex: 'providerAppInfo.version'
    }
  ];

  // rowSelection setting
  const rowSelection = {
    onChange: handleRowSelection
  };

  function handleRowSelection(item, event) {
    const { checked } = event.target;
    const { appId } = item;
    setDataSource(dataSource => {
      const data = handleCheckedItem(dataSource, appId, checked);
      setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
    dispatchInstanceInfo({ type: 'appId', data: appId });
    // after changing engine, need to revert the source details
    dispatchSourceDetails({ type: '', data: {} });
    dispatchArgument({ type: '' });
  }

  return (
    <div className={classes.listContainer}>
      <div style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '15px'
          }}
        >
          <Typography component="h5">{I18n.t('vap.dialog.instance.common.infoTitle')}</Typography>
          {/* <IconButton
            className={classes.toolbar_button}
            onClick={() => console.log(I18n.t('vap.dialog.instance.common.infoTitle'))}
          >
            <LibraryAddIcon />
          </IconButton> */}
        </div>

        <div className={classes.detailsBox}>
          <div className={classes.inputBox}>
            <TextField
              label={I18n.t('vap.dialog.instance.common.name')}
              fullWidth
              required
              placeholder={I18n.t('vap.dialog.instance.common.namePlaceholder')}
              value={instanceInfo.name || ''}
              onChange={e => {
                dispatchInstanceInfo({ type: 'name', data: e.target.value });
              }}
              className={classes.textField_details}
              helperText={validation.name ? I18n.t('vap.dialog.instance.common.nameErrorMsg') : ''}
              error={validation.name}
            />
            <SingleSelect
              label={I18n.t('vap.dialog.instance.common.priority')}
              selectOptions={priorityList}
              onSelect={val => dispatchInstanceInfo({ type: 'priority', data: val })}
              value={instanceInfo.priority || ''}
              className={classes.textField_details}
              error={validation.priority}
              errorMessage={
                validation.priority ? I18n.t('vap.dialog.instance.common.priorityErrorMsg') : ''
              }
              fullWidth
              required
              disabled={editDialogType === 'update'}
              keyValue
              dataIndex={{ name: 'codeDesc', value: 'codeValue', key: 'codeUuid' }}
            />
          </div>

          <Collapse in={validation.appId} timeout="auto">
            <div style={{ color: 'red' }}>
              {`* ${I18n.t('vap.dialog.instance.common.engineErrorMsg')}`}
            </div>
          </Collapse>
          <IVHTable
            tableMaxHeight={rowSelectItems.length > 0 ? 'calc(100% - 196px)' : 'calc(100% - 160px)'}
            // handleChooseAll={handleChooseAll}
            // handleChooseAll={console.log}
            rowSelection={rowSelection}
            keyId="appId"
            columns={columns}
            dataSource={dataSource}
            disabled={editDialogType === 'update'}
          />
          {editDialogType !== 'update' && (
            <Pagination
              page={pageInfo.pageNo}
              rowsPerPage={pageInfo.pageSize}
              count={_.parseInt(engineList.totalNum) || 0}
              onChangePage={onChangePage}
              onChangeRowsPerPage={onChangeRowsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

JobVaInstanceDetailsBox.defaultProps = {
  engineList: {},
  getEngineList: () => {},
  dispatchInstanceInfo: () => {},
  dispatchSourceDetails: () => {},
  dispatchArgument: () => {},
  editDialogType: '',
  validation: {},
  priorityList: [],
  engineStatusList: []
};

JobVaInstanceDetailsBox.propTypes = {
  engineList: PropTypes.object,
  getEngineList: PropTypes.func,
  dispatchInstanceInfo: PropTypes.func,
  dispatchSourceDetails: PropTypes.func,
  dispatchArgument: PropTypes.func,
  editDialogType: PropTypes.string,
  validation: PropTypes.object,
  priorityList: PropTypes.array,
  engineStatusList: PropTypes.array
};

export default JobVaInstanceDetailsBox;
