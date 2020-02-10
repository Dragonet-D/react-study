import React, { Component } from 'react';
import { connect } from 'dva';
import msg from 'utils/messageCenter';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { Download, ToolTip, TableToolbar, ConfirmPage, IVHTable } from 'components/common';
import { isSuccess } from 'utils/helpers';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Delete from '@material-ui/icons/Delete';
import LibraryAdd from '@material-ui/icons/LibraryAdd';
import {
  VADETaskTypeCreateOrUpdate as CreateTaskTypeDialog,
  VADETaskCreateOrUpdate as CreateDialog,
  VADETaskTaskLog as TaskLog,
  VADETaskOperationCell as ExtraCell,
  VADETaskDetailPage as DetailPage
} from 'components/VADE';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import Autorenew from '@material-ui/icons/Autorenew';
// import moment from 'moment';

const msgTitle = 'VADE Task';
class VADETask extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      programFileData: [],
      datasetFileData: [],
      checkedIds: [],
      operationType: '',
      openCreateDialog: false,
      itemData: {},
      pageNo: PAGE_NUMBER,
      pageSize: PAGE_SIZE,
      openConfirm: false,
      openLogDialog: false,
      taskInfo: {},
      openCreateTaskTypeDialog: false,
      downloadResult: '',
      categoryOfCreateTaskType: false,
      openDetailDialog: false
    };
    this.flag_openCreate = false;
    this.searchComponent = null;
  }

  columns = [
    {
      title: I18n.t('vade.config.taskName'),
      dataIndex: 'name',
      renderItem: item => (
        <Link
          onClick={() => {
            this.openDetail(item);
          }}
        >
          <Typography color="secondary" component="span">
            {item.name}
          </Typography>
        </Link>
      )
    },
    {
      title: I18n.t('vade.config.taskType'),
      dataIndex: 'taskTypeName'
    },
    {
      title: I18n.t('vade.config.submittedBy'),
      dataIndex: 'createUserId'
    },
    {
      title: I18n.t('vade.config.submittedDate'),
      dataIndex: 'createTime'
      // render: text => moment(new Date(text)).format(DATE_FORMAT)
    },
    {
      title: I18n.t('vade.config.status'),
      dataIndex: 'taskStatus',
      icon: (
        <Tooltip title="Refresh">
          <IconButton
            aria-label="Refresh"
            style={{ padding: 4 }}
            onClick={() => {
              const { pageNo, pageSize } = this.state;
              this.handleGetDataByPage(pageNo, pageSize, this.searchMapObj);
            }}
          >
            <Autorenew />
          </IconButton>
        </Tooltip>
      )
    }
  ];

  handleCheckedItem(data, id, checked) {
    return data.map(item => {
      if (item.uuid === id) {
        return {
          ...item,
          checked
        };
      }
      return item;
    });
  }

  handleCheckboxClick = (item, event) => {
    const { checked } = event.target;
    const { checkedIds } = this.state;
    const { uuid } = item;
    const valueIndex = checkedIds.indexOf(uuid);

    if (checked && valueIndex === -1) {
      checkedIds.push(uuid);
    }
    if (!checked && valueIndex !== -1) {
      checkedIds.splice(valueIndex, 1);
    }
    this.setState({ checkedIds });
  };

  handleSelectAllClick = event => {
    const { vadeTask } = this.props;
    const { taskList } = vadeTask;
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const curPageIds = taskList.items.map(item => item.uuid);
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

  handleBatchDel = () => {
    const { checkedIds, pageSize } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'vadeTask/deleteTask',
      payload: {
        ids: checkedIds.toString()
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Deleted Task Successfully', msgTitle);
        this.setState({ pageNo: PAGE_NUMBER });
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
      } else {
        msg.error(res.message, msgTitle);
      }
    });
    this.clean();
  };

  clean = () => {
    this.setState({
      checkedIds: [],
      openConfirm: false
    });
  };

  openLogPage = item => {
    this.setState({
      openLogDialog: true,
      taskInfo: { taskId: item.uuid, flag: true, name: item.name }
    });
  };

  handleSubmit = obj => {
    const { dispatch, global } = this.props;
    const newObj = obj;
    newObj.createUserId = global.userId;
    dispatch({
      type: 'vadeTask/saveTask',
      payload: newObj
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        const { pageSize } = this.state;
        msg.success('Saved Task Successfully', msgTitle);
        this.searchMapObj = {};
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
        this.setState(
          {
            pageNo: PAGE_NUMBER,
            openCreateDialog: false
          },
          () => {
            this.searchComponent.clean();
            this.CreateOrUpdateComponent.clean();
          }
        );
      } else {
        msg.error(res.message, msgTitle);
      }
    });
    this.clean();
  };

  openCreateDialog = () => {
    this.setState({ operationType: 'create', openCreateDialog: true });
  };

  openEditPage = item => {
    this.setState({
      operationType: 'update',
      itemData: item,
      openCreateDialog: true
    });
  };

  openDetail = itemData => {
    this.setState({ openDetailDialog: true, itemData });
  };

  onCloseDetailPage = () => {
    this.setState({ openDetailDialog: false });
  };

  downloadLiveLog = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'vadeTask/downloadLiveLog',
      payload: { id }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Download File Successfully', msgTitle);
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  };

  handleDoTask = itemData => {
    const { dispatch, global } = this.props;
    const { pageNo, pageSize } = this.state;
    dispatch({
      type: 'vadeTask/doTask',
      payload: {
        taskId: itemData.uuid,
        flag: itemData.taskStatus !== 'Running',
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        this.handleGetDataByPage(pageNo, pageSize);
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  };

  downloadFile = itemData => {
    const { dispatch } = this.props;
    if (!itemData.logFileId) {
      msg.error('Download Log Failure! No logFileId!', msgTitle);
      return;
    }
    dispatch({
      type: 'vadeTask/downloadLiveLog',
      payload: { id: itemData.logFileId }
    });
    // .then(res => {
    //   if (!res) return;
    //   if (res) {
    //     this.setState({ downloadResult: res });
    //     msg.success('Download Log Successfully', msgTitle);
    //     this.clean();
    //   } else {
    //     msg.error('Download Log Failure', msgTitle);
    //   }
    // });
  };

  handleAddTaskType = obj => {
    const { dispatch, global } = this.props;
    const newObj = obj;
    newObj.createUserId = global.userId;
    dispatch({
      type: 'vadeTask/createTaskType',
      payload: newObj
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Saved Task Type Successfully', msgTitle);
        this.handleGetTaskTypes();
        this.setState({
          openCreateTaskTypeDialog: false,
          categoryOfCreateTaskType: ''
        });
        this.CreateTaskTypeComponent.clean();
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  };

  handleGetTaskTypes = () => {
    const { dispatch, global } = this.props;
    dispatch({
      type: 'vadeTask/getTaskTypeList',
      payload: { createUserId: global.userId }
    });
  };

  onChangePage = (e, page) => {
    const { pageSize } = this.state;
    this.setState({ pageNo: page });
    this.handleGetDataByPage(page, pageSize);
  };

  onChangeRowsPerPage = e => {
    const { value } = e.target;
    this.setState({ pageNo: PAGE_NUMBER, pageSize: value });
    this.handleGetDataByPage(PAGE_NUMBER, value);
  };

  handleSearch = obj => {
    this.setState({ pageNo: PAGE_NUMBER, pageSize: PAGE_SIZE });
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE, obj);
  };

  handleGetDataByPage = (pageNo, pageSize, searchMapObj) => {
    const { dispatch, global } = this.props;
    if (searchMapObj && !_.isEqual(searchMapObj, {})) {
      this.searchMapObj = searchMapObj;
    }
    dispatch({
      type: 'vadeTask/getTaskList',
      payload: {
        ...this.searchMapObj,
        pageNo,
        pageSize,
        createUserId: global.userId
      }
    });
    this.clean();
  };

  componentDidMount() {
    const { dispatch, global } = this.props;
    this.handleGetTaskTypes();
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
    dispatch({
      type: 'vadeTask/getFileList',
      payload: {
        pageNo: 0,
        pageSize: 0,
        category: 'program',
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        this.setState({
          programFileData: res.data
        });
      } else {
        msg.error(res.message, msgTitle);
      }
    });
    dispatch({
      type: 'vadeTask/getFileList',
      payload: {
        pageNo: 0,
        pageSize: 0,
        category: 'data',
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        this.setState({
          datasetFileData: res.data
        });
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  }

  render() {
    const { vadeTask } = this.props;
    const { taskList, taskTypeList } = vadeTask;
    const {
      checkedIds,
      openConfirm,
      openCreateDialog,
      openLogDialog,
      taskInfo,
      datasetFileData,
      programFileData,
      operationType,
      itemData,
      openCreateTaskTypeDialog,
      categoryOfCreateTaskType,
      pageNo,
      pageSize,
      downloadResult,
      openDetailDialog
    } = this.state;
    const rowSelection = {
      onChange: this.handleCheckboxClick,
      selectedRowKeys: checkedIds
    };

    const extraCell = {
      columns: [
        {
          title: I18n.t('vade.config.operation'),
          dataIndex: ''
        }
      ],
      components: [
        {
          component: item => (
            <ExtraCell
              itemData={item}
              handleDoTask={() => this.handleDoTask(item)}
              openEditPage={this.openEditPage}
              openLogPage={this.openLogPage}
              downloadFile={this.downloadFile}
            />
          ),
          key: '13'
        }
      ]
    };
    return (
      <>
        <Paper elevation={0}>
          <TableToolbar
            getToolBarRef={child => {
              this.searchComponent = child;
            }}
            checkedIds={checkedIds}
            handleGetDataByPage={this.handleSearch}
            fieldList={[
              ['TaskName', 'name', 'iptType'],
              // ['TaskCategory', 'category', 'dropdownType'],
              ['TaskType', 'taskTypeId', 'dropdownType'],
              ['Status', 'taskStatus', 'dropdownType']
            ]}
            dataList={{
              // TaskCategory: { data: ['training', 'prediction', 'evaluation'], type: 'normal' },
              TaskType: { data: taskTypeList, type: 'keyVal', id: 'uuid', val: 'name' },
              Status: {
                data: ['Waiting to start', 'Running', 'Error', 'Stopped', 'Completed'],
                type: 'normal'
              }
            }}
          >
            <div style={{ marginLeft: 'auto' }}>
              {checkedIds.length > 0 ? (
                <ToolTip title={I18n.t('vade.config.deleteTask')}>
                  <IconButton
                    aria-label={I18n.t('vade.config.deleteTask')}
                    onClick={() => {
                      this.setState({ openConfirm: true });
                    }}
                  >
                    <Delete />
                  </IconButton>
                </ToolTip>
              ) : (
                <ToolTip title={I18n.t('vade.config.createTask')}>
                  <IconButton
                    aria-label={I18n.t('vade.config.createTask')}
                    onClick={this.openCreateDialog}
                  >
                    <LibraryAdd />
                  </IconButton>
                </ToolTip>
              )}
            </div>
          </TableToolbar>
        </Paper>
        <IVHTable
          dataSource={(taskList && taskList.items) || []}
          columns={this.columns}
          rowSelection={rowSelection}
          handleChooseAll={this.handleSelectAllClick}
          keyId="uuid"
          extraCell={extraCell}
          tableMaxHeight="calc(100% - 160px)"
        />
        <TablePagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(taskList && taskList.totalNum) || 0}
          onChangePage={this.onChangePage}
          onChangeRowsPerPage={this.onChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          backIconButtonProps={{
            'aria-label': 'previous page'
          }}
          nextIconButtonProps={{
            'aria-label': 'next page'
          }}
        />
        <CreateDialog
          openDialog={openCreateDialog}
          closeDialog={() => {
            this.setState({ openCreateDialog: false, itemData: [] });
            this.clean();
          }}
          taskTypeList={taskTypeList}
          programFileData={programFileData && programFileData.items ? programFileData.items : []}
          datasetFileData={datasetFileData && datasetFileData.items ? datasetFileData.items : []}
          handleSubmit={this.handleSubmit}
          operationType={operationType}
          itemData={operationType === 'create' ? [] : itemData}
          openCreateTaskTypeDialog={category => {
            this.setState({ openCreateTaskTypeDialog: true, categoryOfCreateTaskType: category });
            this.flag_openCreate = true;
          }}
          flag_openCreate={this.flag_openCreate}
          getChild={child => {
            this.CreateOrUpdateComponent = child;
          }}
        />
        {openDetailDialog && <DetailPage itemData={itemData} onClose={this.onCloseDetailPage} />}
        <CreateTaskTypeDialog
          openDialog={openCreateTaskTypeDialog}
          closeDialog={() => {
            this.setState({ openCreateTaskTypeDialog: false, categoryOfCreateTaskType: '' }, () => {
              this.flag_openCreate = false;
            });
          }}
          handleSubmit={this.handleAddTaskType}
          operationType="create"
          categoryOfCreateTaskType={categoryOfCreateTaskType}
          getChild={child => {
            this.CreateTaskTypeComponent = child;
          }}
        />
        <TaskLog
          openDialog={openLogDialog}
          taskInfo={taskInfo}
          closeDialog={() => {
            this.setState({ openLogDialog: false, taskInfo: {} });
          }}
        />
        <ConfirmPage
          message={I18n.t('vade.config.deleteTaskConfirm')}
          messageTitle={I18n.t('vade.config.deleteTask')}
          isConfirmPageOpen={openConfirm}
          hanldeConfirmMessage={this.handleBatchDel}
          handleConfirmPageClose={() => {
            this.setState({ openConfirm: false });
          }}
        />
        <Download exportData={downloadResult} />
      </>
    );
  }
}

export default connect(({ vadeTask, global }) => ({ vadeTask, global }))(VADETask);
