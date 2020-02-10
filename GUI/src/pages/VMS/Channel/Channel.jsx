import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import {
  ToolTip,
  TableToolbar,
  Permission,
  ConfirmPage,
  IVHTable,
  Pagination
} from 'components/common';
import msg from 'utils/messageCenter';
import materialKeys from 'utils/materialKeys';
import { I18n } from 'react-i18nify';
import { isSuccess } from 'utils/helpers';
import Paper from '@material-ui/core/Paper';
import Delete from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import {
  ChannelDetailDialog as DetailDialog,
  ChannelStorageDialog as StorageDialog
} from 'components/VMS/Channel';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

class VMSChannel extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      checkedIds: [],
      operationType: '',
      openDetailDialog: false,
      itemData: {},
      scheduleItem: {},
      scheduleList: [],
      isConfirmPageOpen: false,
      // deleteMappingItem: {},
      delType: '',
      scheduleId: '',
      pageNo: PAGE_NUMBER,
      pageSize: PAGE_SIZE,
      openStorageDialog: false,
      modelList: []
    };
    // when del Schedule will update channelList,not close detail dialog
    // this.isDelSchedule = false;
    this.filterObj = {};
    this.extraSchedule = '';
  }

  columns = [
    {
      title: I18n.t('uvms.channel.channelName'),
      dataIndex: 'channelName',
      renderItem: item => (
        <Link onClick={() => this.openDetailDialog(item)}>
          <Typography color="secondary" component="span">
            {item.channelName}
          </Typography>
        </Link>
      )
    },
    {
      title: I18n.t('uvms.channel.parentDevice'),
      dataIndex: 'parentDevice'
    },
    {
      title: I18n.t('uvms.channel.uri'),
      dataIndex: 'deviceUri'
    },
    {
      title: I18n.t('uvms.channel.groupName'),
      dataIndex: 'groupName'
    },
    {
      title: I18n.t('uvms.channel.recordingSchedule'),
      dataIndex: 'scheduleName',
      renderItem: item => <>{(item.schedule && item.schedule.name) || ''}</>
    },
    {
      title: I18n.t('uvms.channel.model'),
      dataIndex: 'modelId'
    },
    {
      title: I18n.t('uvms.channel.status'),
      dataIndex: 'vmsStatus'
    }
  ];

  handleDeleteChannel = () => {
    const { dispatch, global } = this.props;
    const { checkedIds, pageNo, pageSize } = this.state;
    this.filterObj = {};
    dispatch({
      type: 'vmsChannel/delChannel',
      payload: {
        channelIds: checkedIds,
        userId: global.userId,
        descriptionFields: {
          'User Id': global.userId
        }
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Delete Channel Successfully', 'Channel');
        this.setState({ pageNo: PAGE_NUMBER });
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
      } else if (res) {
        msg.error(res.message, 'Channel');
      }
      this.setState({ isConfirmPageOpen: false });
      this.clean();
    });
  };

  handleCheckboxClick = (item, event) => {
    const { checked } = event.target;
    const { checkedIds } = this.state;
    const { channelId } = item;
    const valueIndex = checkedIds.indexOf(channelId);

    if (checked && valueIndex === -1) {
      checkedIds.push(channelId);
    }
    if (!checked && valueIndex !== -1) {
      checkedIds.splice(valueIndex, 1);
    }
    this.setState({ checkedIds });
  };

  handleSelectAllClick = event => {
    const { vmsChannel } = this.props;
    const { channelList } = vmsChannel;
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const curPageIds = channelList.items.map(item => item.channelId);
    if (checked) {
      const allPageCheckedIds = checkedIds.concat(curPageIds);
      const result = _.uniq(allPageCheckedIds);
      this.setState({
        checkedIds: result
      });
    } else {
      for (const i in curPageIds) {
        checkedIds.splice(checkedIds.indexOf(curPageIds[i]), 1);
      }
      this.setState({ checkedIds });
    }
  };

  closeDetailDialog = () => {
    this.extraSchedule = '';
    this.setState({ openDetailDialog: false, itemData: {} });
  };

  clean = () => {
    this.setState({
      checkedIds: []
    });
  };

  handleSubmit = groupId => {
    const { dispatch, global, vmsChannel } = this.props;
    const { channelList } = vmsChannel;
    const cIdAndDId = [];
    const { checkedIds } = this.state;
    for (let i = 0; i < checkedIds.length; i++) {
      cIdAndDId.push(channelList.items.filter(item => item.channelId === checkedIds[i])[0]);
    }

    const channelsToGroup = {};
    channelsToGroup.channelId = cIdAndDId.map(item => [item.channelId, item.deviceId]);
    channelsToGroup.groupId = groupId;
    channelsToGroup.createdId = global.userId;
    channelsToGroup.lastUpdatedId = global.userId;
    channelsToGroup.pageNo = PAGE_NUMBER;
    channelsToGroup.pageSize = PAGE_SIZE;
    channelsToGroup.userId = global.userId;
    dispatch({
      type: 'vmsChannel/updateGroupMappingRequest',
      payload: {
        channelsToGroup // checked
      }
    });
  };

  handleSubmitDetail = detail => {
    const { dispatch, global } = this.props;
    detail.createdId = global.userId;
    detail.lastUpdatedId = global.userId;
    detail.pageNo = PAGE_NUMBER;
    detail.pageSize = PAGE_SIZE;
    detail.filterObj = this.filterObj;
    detail.userId = global.userId;
    dispatch({
      type: 'vmsChannel/saveChannel',
      payload: detail
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Save Channel Detail Successfully', 'Channel');
        const { pageSize } = this.state;
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
        this.setState({ openDetailDialog: false, scheduleItem: {}, pageNo: PAGE_NUMBER });
      } else if (res) {
        msg.error(res.message, 'Channel');
      }
    });
    this.extraSchedule = '';
  };

  handleSubmitStorage = schedule => {
    const { dispatch, global } = this.props;
    // schedule.timeZone = 'Singapore';
    schedule.createdId = global.userId;
    schedule.lastUpdatedId = global.userId;
    if (schedule.scheduleId) {
      dispatch({
        type: 'vmsChannel/saveSchedule',
        payload: schedule
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Update Schedule Successfully', 'Channel');
          this.setState({ scheduleItem: {}, openStorageDialog: false });
          this.getSchedule();
        } else if (res) {
          msg.error(res.message, 'channel');
        }
      });
    } else {
      dispatch({
        type: 'vmsChannel/saveSchedule',
        payload: {
          ...schedule,
          key: 'M5-2'
        }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Create Schedule Successfully', 'Channel');
          this.setState({ scheduleItem: {}, openStorageDialog: false });
          this.getSchedule();
        } else if (res) {
          msg.error(res.message, 'Channel');
        }
      });
    }
  };

  handleSaveGroup = (group, type) => {
    const { dispatch, global } = this.props;
    if (type === 'update') {
      dispatch({
        type: 'vmsChannel/updateGroup',
        payload: {
          createdId: global.userId,
          lastUpdatedId: global.userId,
          ...group
        }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Update Channel Group Successfully', 'Channel');
        } else if (res) {
          msg.error(res.message, 'Channel');
        }
      });
    } else {
      dispatch({
        type: 'vmsChannel/createGroup',
        payload: {
          createdId: global.userId,
          lastUpdatedId: global.userId,
          ...group
        }
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Create Channel Group Successfully', 'Channel');
        } else if (res) {
          msg.error(res.message, 'Channel');
        }
      });
    }
  };

  handleOpenStorageDialog = (operationType, scheduleItem) => {
    this.setState({
      openStorageDialog: true,
      operationType,
      scheduleItem
    });
  };

  handleDeleteGroup = obj => {
    const { onDeleteGroupById } = this.props;
    onDeleteGroupById(obj);
  };

  handleDeleteSchedule = () => {
    const { dispatch, global } = this.props;
    const { delType, scheduleId } = this.state;
    if (delType === 'deleteSchedule') {
      const obj = {
        scheduleId,
        userId: global.userId,
        pageNo: PAGE_NUMBER,
        pageSize: 50
      };
      dispatch({
        type: 'vmsChannel/delSchedule',
        payload: obj
      }).then(res => {
        if (!res) return;
        if (isSuccess(res)) {
          msg.success('Delete Schedule Successfully', 'Channel');
          this.getSchedule(false);
          this.setState({
            isConfirmPageOpen: false,
            openStorageDialog: false
          });
        } else if (res) {
          msg.error(res.message, 'Channel');
        }
      });
    }
  };

  deleteMappingClose = () => {
    this.setState({
      deleteMappingItem: {},
      isConfirmPageOpen: false
    });
  };

  openDelConfirm = (type, id) => {
    this.setState({
      // deleteMappingItem: item,
      isConfirmPageOpen: true,
      scheduleId: id,
      delType: type
    });
    if (id) {
      this.setState({
        scheduleId: id
      });
    }
  };

  getSchedule = isGetExtra => {
    const { dispatch, global } = this.props;
    dispatch({
      type: 'vmsChannel/getSchedules',
      payload: {
        pageNo: PAGE_NUMBER,
        pageSize: 50,
        userId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        const scheduleList = res.data;
        this.setState(
          {
            scheduleList
            // scheduleItem: {}
          },
          () => {
            const { itemData } = this.state;
            // when open detail, get extra schedule
            if (itemData.schedule && itemData.schedule.scheduleId) {
              const ids = scheduleList.map(item => item.scheduleId);
              // if scheduleList not included cur schedule
              if (isGetExtra !== undefined && !isGetExtra) return;
              if (ids.indexOf(itemData.schedule.scheduleId) < PAGE_NUMBER) {
                const { dispatch } = this.props;
                dispatch({
                  type: 'vmsChannel/getExtraSchedules',
                  payload: {
                    id: itemData.schedule.scheduleId
                  }
                }).then(res => {
                  if (!res) return;
                  if (isSuccess(res)) {
                    this.extraSchedule = res.data;
                    // const newScheduleList = scheduleList;
                    this.extraSchedule.scheduleReadOnly = true;
                    scheduleList.unshift(this.extraSchedule);
                    this.setState({
                      scheduleList
                    });
                  } else if (res) {
                    msg.error(res.message, 'Channel');
                  }
                });
              } else {
                this.extraSchedule = {};
              }
            }
          }
        );
      } else if (res) {
        msg.error(res.message, 'Channel');
      }
    });
  };

  // delSchedule = obj => {
  //   const { dispatch, global } = this.props;
  //   dispatch({
  //     type: 'vmsChannel/delSchedule',
  //     payload: {
  //       pageNo: PAGE_NUMBER,
  //       pageSize: 50,
  //       userId: global.userId,
  //       ...obj
  //     }
  //   });
  //   this.setState({ delType: 'schedule' });
  //   // this.isDelSchedule = true;
  // };

  openDetailDialog = item => {
    this.getSchedule();
    this.setState({ openDetailDialog: true, itemData: item });
  };

  onChangePage = (e, page) => {
    const { pageSize } = this.state;
    this.setState({ pageNo: page });
    this.handleGetDataByPage(page, pageSize);
  };

  onChangeRowsPerPage = e => {
    const { value } = e.target;
    // const { pageNo } = this.state;
    this.setState({ pageSize: value, pageNo: PAGE_NUMBER });
    this.handleGetDataByPage(PAGE_NUMBER, value);
  };

  handleSearch = obj => {
    const { pageSize } = this.state;
    this.setState({ pageNo: PAGE_NUMBER });
    this.handleGetDataByPage(PAGE_NUMBER, pageSize, obj);
  };

  handleGetDataByPage = (pageNo = PAGE_NUMBER, pageSize = PAGE_SIZE, filterObj) => {
    const { dispatch, global } = this.props;
    if (filterObj && !_.isEqual(filterObj, {})) {
      this.filterObj = filterObj;
    }
    dispatch({
      type: 'vmsChannel/getChannelList',
      payload: {
        pageNo,
        pageSize,
        userId: global.userId,
        ...this.filterObj
      }
    });
  };

  componentDidMount() {
    const { global, dispatch } = this.props;
    const obj = {};
    obj.pageNo = PAGE_NUMBER;
    obj.pageSize = 50;
    obj.userId = global.userId;
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
    this.getSchedule();
    // dispatch({
    //   type: 'vmsChannel/getGroupsList',
    //   payload: obj
    // });
    // dispatch({
    //   type: 'vmsChannel/getParentGroupList',
    //   payload: obj
    // });
    // for search 'model'
    dispatch({
      type: 'vmsChannel/getModelList',
      payload: { pageNo: PAGE_NUMBER, pageSize: 20 }
    });
  }

  render() {
    const { vmsChannel, dispatch } = this.props;
    const { channelList, modelList } = vmsChannel; // , groupList
    const {
      checkedIds,
      openDetailDialog,
      isConfirmPageOpen,
      itemData,
      pageNo,
      pageSize,
      delType,
      openStorageDialog,
      scheduleList,
      scheduleItem,
      operationType
    } = this.state;
    const rowSelection = {
      onChange: this.handleCheckboxClick,
      selectedRowKeys: checkedIds
    };
    return (
      <>
        <Paper
          elevation={0}
          style={{
            display: 'flex',
            paddingLeft: '8px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <TableToolbar
              checkedIds={checkedIds}
              handleGetDataByPage={this.handleSearch}
              fieldList={[
                ['ChannelName', 'channelName', 'iptType'],
                ['ParentDevice', 'deviceName', 'iptType'],
                ['URI_', 'deviceUri', 'iptType'],
                ['GroupName', 'groupName', 'iptType'],
                ['RecordingSchedule', 'scheduleName', 'iptType'],
                ['Model', 'modelId', 'dropdownType'],
                ['Status', 'vmsStatus', 'dropdownType']
              ]}
              dataList={{
                Model: {
                  data: modelList && modelList.map(item => item.name)
                  // type: 'keyVal',
                  // id: 'name',
                  // val: 'name'
                },
                Status: {
                  data: ['active', 'unavailable', 'disconnected']
                }
              }}
            />
          </div>

          <div
            style={{
              marginLeft: 'auto',
              width: '4%',
              display: 'flex',
              paddingLeft: '8px',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            hidden={!checkedIds.length}
          >
            {checkedIds.length > 0 ? (
              <Permission materialKey={materialKeys['M4-117']}>
                <ToolTip title="Delete channel">
                  <IconButton
                    aria-label="Delete channel"
                    onClick={() => this.openDelConfirm('delChannel')}
                  >
                    <Delete />
                  </IconButton>
                </ToolTip>
              </Permission>
            ) : (
              ''
            )}
          </div>
        </Paper>
        <IVHTable
          tableMaxHeight="calc(100% - 190px)"
          dataSource={(channelList && channelList.items) || []}
          handleChooseAll={this.handleSelectAllClick}
          columns={this.columns}
          rowSelection={rowSelection}
          rowSelectionClick={this.openDetailDialog}
          keyId="channelId"
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(channelList && channelList.totalNum) || 0}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
        />
        {openDetailDialog && (
          <DetailDialog
            itemData={itemData}
            openDialog={openDetailDialog}
            closeDialog={this.closeDetailDialog}
            openStorageDialog={this.handleOpenStorageDialog}
            scheduleList={scheduleList}
            handleSubmit={this.handleSubmitDetail}
            dispatch={dispatch}
            // isDelSchedule={this.isDelSchedule}
          />
        )}
        {openStorageDialog && (
          <StorageDialog
            scheduleItemData={scheduleItem}
            openDialog={openStorageDialog}
            closeDialog={() => {
              this.setState({
                openStorageDialog: false,
                scheduleItem: {}
              });
            }}
            openDelConfirm={this.openDelConfirm}
            handleSubmit={this.handleSubmitStorage}
            operationType={operationType}
          />
        )}

        <ConfirmPage
          message={
            delType === 'deleteSchedule'
              ? I18n.t('uvms.channel.confirmExecutingThisOperationtion')
              : I18n.t('uvms.channel.deleteChannelConfirm')
          }
          messageTitle={
            delType === 'deleteSchedule'
              ? I18n.t('uvms.channel.deleteSchedule')
              : I18n.t('uvms.channel.deleteChannel')
          }
          isConfirmPageOpen={isConfirmPageOpen}
          hanldeConfirmMessage={() => {
            if (delType === 'delChannel') {
              this.handleDeleteChannel();
            } else {
              this.handleDeleteSchedule();
            }
          }}
          handleConfirmPageClose={this.deleteMappingClose}
        />
      </>
    );
  }
}

export default connect(({ vmsChannel, global }) => ({ vmsChannel, global }))(VMSChannel);
