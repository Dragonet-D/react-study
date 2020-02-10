import React, { useState, useEffect, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import { Pagination, IVHTable, TextField } from 'components/common';
import PropTypes from 'prop-types';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
// import { VAP_COMMON } from 'commons/constants/commonConstant';
import {
  handleCheckedItem,
  handleJoinCheckedItem,
  handleInitCheckedItems,
  handleInitCheckedList
} from '../util';

const useStyles = makeStyles(theme => {
  return {
    listContainer: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginRight: '6px',
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`
    },
    detailsBox: { height: '93%', marginLeft: '15px', marginRight: '15px', position: 'relative' },
    toolbar_button: {
      marginLeft: 'auto',
      marginRight: '8px'
    },
    inputBox: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px'
    },
    textField_details: {
      flex: 1,
      marginRight: '15px'
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

function ServiceVaInstanceDetailsBox(props) {
  const classes = useStyles();
  const {
    instanceInfo,
    dispatchInstanceInfo,
    engineList,
    getEngineList,
    editDialogType,
    validation,
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
  useEffect(() => {
    dispatchInstanceInfo({ type: 'appId', data: handleJoinCheckedItem(rowSelectItems) });
  }, [dispatchInstanceInfo, rowSelectItems]);

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
  }

  // function handleChooseAll(e) {
  //   const { checked } = e.target;
  //   setDataSource(dataSource => {
  //     const data = dataSource.map(item => ({ ...item, checked }));
  //     setRowSelectItems(checked ? data : []);
  //     return data;
  //   });
  // }

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
            {/* <SingleSelect
              label={I18n.t('vap.dialog.instance.common.priority')}
              selectOptions={VAP_COMMON.priority}
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
            /> */}
          </div>

          {validation.appId && (
            <div style={{ color: 'red' }}>
              {`* ${I18n.t('vap.dialog.instance.common.engineErrorMsg')}`}
            </div>
          )}
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

ServiceVaInstanceDetailsBox.defaultProps = {
  engineList: {},
  getEngineList: () => {},
  dispatchInstanceInfo: () => {},
  editDialogType: '',
  validation: {},
  engineStatusList: []
};

ServiceVaInstanceDetailsBox.propTypes = {
  engineList: PropTypes.object,
  getEngineList: PropTypes.func,
  dispatchInstanceInfo: PropTypes.func,
  editDialogType: PropTypes.string,
  validation: PropTypes.object,
  engineStatusList: PropTypes.array
};

export default ServiceVaInstanceDetailsBox;
