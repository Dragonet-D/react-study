import React, { Fragment, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Pagination, TextField, SingleSelect, IVHTableAntd } from 'components/common';
import Collapse from '@material-ui/core/Collapse';
import { handleInitCheckedList, handleGetChannelNode } from '../util';

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

function LiveVaInstanceSourceBox(props) {
  const classes = useStyles();
  const {
    sourceList,
    sourceDetails,
    dispatchSourceDetails,
    dispatchChannelPage,
    channelPage,
    channelList,
    dispatchArgument,
    argument,
    editDialogType,
    setChannelNode,
    validation,
    setMultipleDeivceItems,
    multipleDeivceItems
  } = props;

  const [sourceData, setSourceData] = useState([]);

  function handleSourceProvider(val) {
    dispatchSourceDetails({ type: '', data: { provider: val, deviceProviderId: 'uvms' } });
  }

  function onChangePage(e, page) {
    dispatchChannelPage({ type: 'pageNo', data: page });
  }
  function onChangeRowsPerPage(e) {
    const { value } = e.target;
    dispatchChannelPage({ type: 'pageSize', data: value });
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

  function handleSelectStreamType(val) {
    dispatchArgument({ type: 'stream-type', data: val });
    dispatchArgument({ type: 'live', data: true });
  }

  // deivce table config
  const [rowSelectItems, setRowSelectItems] = useState([]);
  useEffect(() => {
    setSourceData(
      handleInitCheckedList(sourceDetails.deviceChannelId, channelList.items || [], 'channelId') ||
        []
    );
    if (!_.isNil(sourceDetails.deviceChannelId) && sourceDetails.deviceChannelId !== '') {
      setChannelNode(handleGetChannelNode(sourceDetails.deviceChannelId, channelList, 'live'));
    }

    if (editDialogType === 'update') {
      setRowSelectItems(rowSelectItems => {
        rowSelectItems.push(sourceDetails.deviceChannelId);
        return rowSelectItems;
      });
    }
  }, [channelList, editDialogType, setChannelNode, sourceDetails.deviceChannelId]);

  function handleDeviceRowSelection(ids, items) {
    // For table checkbox render
    setRowSelectItems(ids);

    // Clear repeat options, Merge different paging options
    const newMultipleDeivceItems = _.unionWith(multipleDeivceItems, items, _.isEqual).filter(
      item => _.indexOf(ids, item.channelId) >= 0
    );

    // For player drag list
    setChannelNode(newMultipleDeivceItems.map(item => ({ ...item, name: item.channelName })));
    setMultipleDeivceItems(newMultipleDeivceItems);
  }

  const rowDeviceSelectionConfig = {
    selectedRowKeys: rowSelectItems,
    onChange: handleDeviceRowSelection,
    type: 'radio',
    getCheckboxProps() {
      return {
        disabled: editDialogType === 'update'
      };
    }
  };
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
              <Collapse
                in={validation.deviceChannelId && editDialogType === 'create'}
                timeout="auto"
              >
                {/* {validation.deviceChannelId && editDialogType === 'create' && ( */}
                <div style={{ color: 'red' }}>
                  {`* ${I18n.t('vap.dialog.instance.common.channelErrorMsg')}`}
                </div>
              </Collapse>
              {/* )} */}
              <IVHTableAntd
                columns={columns}
                dataSource={sourceData || []}
                rowSelection={rowDeviceSelectionConfig}
                rowKey="channelId"
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
        </div>
      </div>
    </div>
  );
}

LiveVaInstanceSourceBox.defaultProps = {
  sourceList: [],
  sourceDetails: {},
  dispatchSourceDetails: () => {},
  dispatchChannelPage: () => {},
  dispatchArgument: () => {},
  channelPage: {},
  channelList: {},
  argument: {},
  editDialogType: '',
  validation: {},
  multipleDeivceItems: [],
  setMultipleDeivceItems: () => {}
};

LiveVaInstanceSourceBox.propTypes = {
  sourceList: PropTypes.array,
  sourceDetails: PropTypes.object,
  dispatchSourceDetails: PropTypes.func,
  dispatchChannelPage: PropTypes.func,
  dispatchArgument: PropTypes.func,
  channelPage: PropTypes.object,
  channelList: PropTypes.object,
  argument: PropTypes.object,
  editDialogType: PropTypes.string,
  validation: PropTypes.object,
  multipleDeivceItems: PropTypes.array,
  setMultipleDeivceItems: PropTypes.func
};

export default LiveVaInstanceSourceBox;
