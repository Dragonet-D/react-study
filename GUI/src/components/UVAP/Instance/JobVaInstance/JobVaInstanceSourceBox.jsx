import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Pagination, IVHTable, TextField, SingleSelect, DatePicker } from 'components/common';
import Collapse from '@material-ui/core/Collapse';
import {
  handleCheckedChannelItem,
  handleCheckedFileItem,
  handleInitCheckedList,
  handleGetChannelNode
} from '../util';

const useStyles = makeStyles(theme => {
  return {
    listContainer: {
      // height: '100%',
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
    }
  };
});

function JobVaInstanceSourceBox(props) {
  const classes = useStyles();
  const {
    sourceList,
    sourceDetails,
    dispatchSourceDetails,
    dispatchChannelPage,
    channelPage,
    channelList,
    fileList,
    dispatchArgument,
    argument,
    filePage,
    dispatchFilePage,
    recordingList,
    editDialogType,
    setChannelNode,
    validation
  } = props;

  const [sourceData, setSourceData] = useState([]);
  useEffect(() => {
    setSourceData(
      handleInitCheckedList(sourceDetails.deviceChannelId, channelList.items || [], 'channelId') ||
        []
    );
    if (!_.isNil(sourceDetails.deviceChannelId) && sourceDetails.deviceChannelId !== '') {
      setChannelNode(handleGetChannelNode(sourceDetails.deviceChannelId, channelList));
    }
  }, [channelList, setChannelNode, sourceDetails.deviceChannelId]);
  const [sourceFile, setSourceFile] = useState([]);
  useEffect(() => {
    setSourceFile(handleInitCheckedList(sourceDetails.fileId, fileList.items || [], 'id') || []);
  }, [fileList, sourceDetails.fileId]);

  function handleSourceProvider(val) {
    // dispatchSourceDetails({ type: 'provider', data: val });
    // dispatchSourceDetails({ type: 'deviceProviderId', data: 'uvms' });
    dispatchSourceDetails({ type: '', data: { provider: val, deviceProviderId: 'uvms' } });
  }

  function onChangePage(e, page) {
    dispatchChannelPage({ type: 'pageNo', data: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchChannelPage({ type: 'pageSize', data: value });
  }
  function onChangeFilePage(e, page) {
    dispatchFilePage({ type: 'pageNo', data: page });
  }
  function onChangeRowsPerFilePage(e) {
    const { value } = e.target;
    dispatchFilePage({ type: 'pageSize', data: value });
  }
  // table columns setting
  const columns = [
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.name'),
      dataIndex: 'channelName'
    },
    {
      title: I18n.t('uvms.channelGroup.detailsBox.table.status'),
      dataIndex: 'vmsStatus'
    }
  ];

  // file table columns setting
  const columnsFile = [
    {
      title: I18n.t('vap.table.files.name'),
      dataIndex: 'name'
    },
    {
      title: I18n.t('vap.table.files.type'),
      dataIndex: 'mimeType'
    },
    {
      title: I18n.t('vap.table.files.length'),
      dataIndex: 'length',
      render: text => <span>{`${_.floor(text / 1024 / 1024, 2)} MB`}</span>
    }
  ];
  // rowSelection setting
  const rowSelection = {
    onChange: handleRowSelection
  };
  const fileRowSelection = {
    onChange: handleFileRowSelection
  };
  function handleFileRowSelection(item, event) {
    const { checked } = event.target;
    const { id } = item;
    setSourceFile(sourceFile => {
      const data = handleCheckedFileItem(sourceFile, id, checked);
      // setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
    dispatchSourceDetails({ type: 'fileId', data: id });
    // // after changing engine, need to revert the arguments
    dispatchArgument({ type: '', data: {} });
  }

  function handleRowSelection(item, event) {
    const { checked } = event.target;
    const { channelId } = item;
    item.name = item.channelName;
    setChannelNode(item);
    setSourceData(sourceData => {
      const data = handleCheckedChannelItem(sourceData, channelId, checked);
      // setRowSelectItems(data.filter(item => !!item.checked));
      return data;
    });
    dispatchSourceDetails({ type: 'deviceChannelId', data: item.channelId });
    dispatchSourceDetails({ type: 'deviceId', data: item.deviceId });
    // // after changing engine, need to revert the arguments
    dispatchArgument({ type: '', data: {} });
  }

  function handleSelectStreamType(val) {
    dispatchArgument({ type: 'stream-type', data: val });
    dispatchArgument({ type: 'live', data: false });
  }
  function handleSelectTime(val) {
    const dataList = _.split(val, '-');
    dispatchArgument({ type: 'from', data: _.toNumber(dataList[0]) });
    dispatchArgument({ type: 'to', data: _.toNumber(dataList[1]) });
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
          <Typography component="h5">{I18n.t('vap.dialog.instance.common.sourceTilte')}</Typography>
          {/* <IconButton
            className={classes.toolbar_button}
            onClick={() => console.log(I18n.t('vap.dialog.instance.common.sourceTilte'))}
          >
            <PlayArrow />
          </IconButton> */}
        </div>

        <div className={classes.detailsBox}>
          <div className={classes.inputBox}>
            <SingleSelect
              label={I18n.t('vap.dialog.instance.common.sourceProvider')}
              selectOptions={sourceList}
              keyValue
              dataIndex={{ name: 'name', value: 'provider', key: 'provider' }}
              onSelect={val => handleSourceProvider(val)}
              value={sourceDetails.provider || ''}
              className={classes.textField_details}
              error={validation.provider}
              errorMessage={
                validation.provider
                  ? I18n.t('vap.dialog.instance.common.sourceProviderErrorMsg')
                  : ''
              }
              fullWidth
              required
              disabled={editDialogType === 'update'}
            />
          </div>
          <Collapse in={sourceDetails.provider === 'vap_device_stream'} timeout="auto">
            <Fragment>
              {validation.deviceChannelId && (
                <div style={{ color: 'red' }}>
                  {`* ${I18n.t('vap.dialog.instance.common.channelErrorMsg')}`}
                </div>
              )}
              <IVHTable
                rowSelection={rowSelection}
                keyId="id"
                columns={columns}
                dataSource={sourceData || []}
                disabled={editDialogType === 'update'}
              />
              {editDialogType !== 'update' && (
                <Pagination
                  page={channelPage.pageNo}
                  rowsPerPage={channelPage.pageSize}
                  count={_.parseInt(channelList.totalNum) || 0}
                  onChangePage={onChangePage}
                  onChangeRowsPerPage={onChangeRowsPerPage}
                />
              )}
            </Fragment>
          </Collapse>
          <Collapse in={sourceDetails.provider === 'vap_storage_file'} timeout="auto">
            <Fragment>
              {validation.fileId && (
                <div style={{ color: 'red' }}>
                  {`* ${I18n.t('vap.dialog.instance.common.fileIdErrorMsg')}`}
                </div>
              )}
              <IVHTable
                rowSelection={fileRowSelection}
                keyId="id"
                columns={columnsFile}
                dataSource={sourceFile || []}
                disabled={editDialogType === 'update'}
              />
              {editDialogType !== 'update' && (
                <Pagination
                  page={filePage.pageNo}
                  rowsPerPage={filePage.pageSize}
                  count={_.parseInt(fileList.totalCount) || 0}
                  onChangePage={onChangeFilePage}
                  onChangeRowsPerPage={onChangeRowsPerFilePage}
                />
              )}
            </Fragment>
          </Collapse>
          <Collapse in={sourceDetails.provider === 'url'} timeout="auto">
            <div className={classes.inputBox}>
              <TextField
                label={I18n.t('vap.dialog.instance.common.url')}
                fullWidth
                required
                placeholder={I18n.t('vap.dialog.instance.common.urlPlaceholder')}
                value={sourceDetails.url || ''}
                onChange={e => {
                  dispatchSourceDetails({ type: 'url', data: e.target.value });
                }}
                className={classes.textField_details}
                error={validation.url}
                errorMessage={
                  validation.url ? I18n.t('vap.dialog.instance.common.urlErrorMsg') : ''
                }
                disabled={editDialogType === 'update'}
              />
            </div>
          </Collapse>
          <Collapse
            in={sourceDetails.provider === 'vap_device_stream' && sourceDetails.deviceChannelId}
            timeout="auto"
          >
            <div className={classes.inputBox}>
              <SingleSelect
                label={I18n.t('vap.dialog.instance.common.streamType')}
                selectOptions={['rtsp/h264']}
                onSelect={handleSelectStreamType}
                value={argument['stream-type'] || ''}
                className={classes.textField_details}
                error={validation.streamType}
                errorMessage={
                  validation.streamType
                    ? I18n.t('vap.dialog.instance.common.streamTypeErrorMsg')
                    : ''
                }
                fullWidth
                required
                disabled={editDialogType === 'update'}
              />
            </div>

            <div className={classes.inputBox}>
              <DatePicker
                value={argument.from}
                handleChange={val => dispatchArgument({ type: 'from', data: val.valueOf() })}
                label="From"
                maxDate={argument.to || new Date()}
                className={classes.textField_details}
                disabled={editDialogType === 'update'}
              />
              <DatePicker
                value={argument.to}
                handleChange={val => dispatchArgument({ type: 'to', data: val.valueOf() })}
                label="To"
                minDate={argument.from || new Date()}
                className={classes.textField_details}
                disabled={editDialogType === 'update'}
              />
            </div>

            <div className={classes.inputBox}>
              <SingleSelect
                label={I18n.t('vap.dialog.instance.common.recordingList')}
                selectOptions={recordingList}
                onSelect={handleSelectTime}
                value={`${argument.from}-${argument.to}`}
                className={classes.textField_details}
                fullWidth
                keyValue
                dataIndex={{ name: 'name', value: 'value', key: 'id' }}
                disabled={editDialogType === 'update'}
              />
            </div>
          </Collapse>
        </div>
      </div>
    </div>
  );
}

JobVaInstanceSourceBox.defaultProps = {
  sourceList: [],
  sourceDetails: {},
  dispatchSourceDetails: () => {},
  dispatchChannelPage: () => {},
  dispatchArgument: () => {},
  channelPage: {},
  channelList: {},
  argument: {},
  fileList: {},
  dispatchFilePage: () => {},
  filePage: {},
  recordingList: [],
  editDialogType: '',
  validation: {}
};

JobVaInstanceSourceBox.propTypes = {
  sourceList: PropTypes.array,
  sourceDetails: PropTypes.object,
  dispatchSourceDetails: PropTypes.func,
  dispatchChannelPage: PropTypes.func,
  dispatchArgument: PropTypes.func,
  channelPage: PropTypes.object,
  channelList: PropTypes.object,
  argument: PropTypes.object,
  fileList: PropTypes.object,
  dispatchFilePage: PropTypes.func,
  filePage: PropTypes.object,
  recordingList: PropTypes.array,
  editDialogType: PropTypes.string,
  validation: PropTypes.object
};

export default JobVaInstanceSourceBox;
