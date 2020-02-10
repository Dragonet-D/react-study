import React, { Component } from 'react';
import { connect } from 'dva';
import msg from 'utils/messageCenter';
import _ from 'lodash';
import { ToolTip, TableToolbar, ConfirmPage, IVHTable, Download } from 'components/common';
import { isSuccess } from 'utils/helpers';
import {
  VADETaskTypeCreateOrUpdate as CreateTaskTypeDialog,
  VADEProgramCreateOrUpdate as CreateOrUpdate,
  VADEProgramDetailPage as DetailPage
} from 'components/VADE';
import Paper from '@material-ui/core/Paper';
import { LibraryAdd, Delete, CloudDownload } from '@material-ui/icons';
import { IconButton, Link } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import TablePagination from '@material-ui/core/TablePagination';
// import moment from 'moment';

const msgTitle = 'VADE Program';
class VADEProgram extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      checkedIds: [],
      operationType: '',
      openDialog: false,
      itemData: {},
      programEntryList: [],
      dataEntryList: [],
      isConfirmPageOpen: false,
      openCreateTaskTypeDialog: false,
      downloadResult: '',
      openDetailDialog: false,
      pageNo: PAGE_NUMBER,
      pageSize: PAGE_SIZE
    };
    this.searchMapObj = {};
    this.flag_openCreate = false;
    this.searchComponent = null;
  }

  componentWillReceiveProps(nextProps) {
    const { vadeProgram: props } = nextProps;
    const { vadeProgram: preProps } = this.props;
    if (!_.isEqual(props.entryList, preProps.entryList)) {
      this.setState({
        programEntryList: props.entryList
          .filter(item => item.category === 'program')
          .map(item => item.entry),
        dataEntryList: props.entryList
          .filter(item => item.category === 'data')
          .map(item => item.entry)
      });
    }
    if (!_.isEqual(props.taskTypeList, preProps.taskTypeList)) {
      this.setState({ openCreateTaskTypeDialog: false });
      this.flag_openCreate = false;
    }
  }

  openConfirm = () => {
    this.setState({ isConfirmPageOpen: true });
  };

  closeConfirm = () => {
    this.setState({ isConfirmPageOpen: false });
  };

  recordSelectedData = [];

  handleCheckboxClick = (item, event) => {
    const { checked } = event.target;
    const { checkedIds } = this.state;
    const { uuid } = item;

    const newSelected = checkedIds.slice();
    const valueIndex = newSelected.indexOf(uuid);

    if (checked && valueIndex === -1) {
      newSelected.push(uuid);
    }
    if (!checked && valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
    }
    this.setState({ checkedIds: newSelected });
  };

  handleSelectAllClick = event => {
    const { vadeProgram } = this.props;
    const { programList } = vadeProgram;
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const curPageIds = programList.items.map(item => item.uuid);
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

  isSelected = id => {
    const { checkedIds } = this.state;
    return checkedIds.indexOf(id) !== -1;
  };

  clean = () => {
    this.recordSelectedData = [];
    this.setState({
      checkedIds: [],
      operationType: ''
    });
  };

  handleSubmit = () => {
    // const { dispatch, global } = this.props;
    // const newObj = info;
    // newObj.createUserId = global.userId;
    // newObj.category = 'program';
    // dispatch({
    //   type: 'vadeProgram/saveProgram',
    //   payload: newObj
    // }).then(res => {
    //   if (isSuccess(res)) {
    //     msg.success('Saved Program Successfully', msgTitle);
    const { pageSize } = this.state;
    this.setState({ pageNo: PAGE_NUMBER });
    this.searchComponent.clean();
    this.searchMapObj = {};
    this.handleGetDataByPage(PAGE_NUMBER, pageSize);
    //     this.setState(
    //       {
    //         openDialog: false
    //       },
    //       () => {
    //         this.CreateOrUpdateComponent.handleCloseDialog();
    //       }
    //     );
    //   } else {
    //     msg.error(res.message, msgTitle);
    //   }
    // });
  };

  downloadFile = () => {
    const { dispatch } = this.props;
    const { checkedIds } = this.state;
    dispatch({
      type: 'vadeProgram/downloadFile',
      payload: { checkedIds }
    }).then(() => {
      // if (res) {
      //   this.setState({ downloadResult: res });
      //   msg.success('Download File Successfully', msgTitle);
      this.clean();
      // } else {
      //   msg.error('Download File Failure', msgTitle);
      // }
    });
  };

  openCreateDialog = () => {
    this.setState({ openDialog: true, operationType: 'create', itemData: {} });
  };

  onCloseAddOrUpdateDialog = () => {
    this.setState({ openDialog: false });
    this.clean();
  };

  openDetail = itemData => {
    this.setState({ openDetailDialog: true, itemData });
  };

  onCloseDetailPage = () => {
    this.setState({ openDetailDialog: false });
  };

  handleAddTaskType = obj => {
    const { dispatch, global } = this.props;
    const newObj = obj;
    newObj.createUserId = global.userId;
    dispatch({
      type: 'vadeProgram/saveTaskType',
      payload: newObj
    }).then(res => {
      if (isSuccess(res)) {
        msg.success('Saved Task Type Successfully', msgTitle);
        dispatch({
          type: 'vadeProgram/getTaskTypeList',
          payload: { createUserId: global.userId }
        });
        this.setState(
          {
            openCreateTaskTypeDialog: false
          },
          () => {
            this.CreateTaskTypeComponent.clean();
          }
        );
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  };

  columns = [
    {
      title: I18n.t('vade.config.programName'),
      dataIndex: 'fileName',
      renderItem: item => (
        <Link
          onClick={() => {
            this.openDetail(item);
          }}
        >
          <Typography color="secondary" component="span">
            {item.fileName}
          </Typography>
        </Link>
      )
    },
    {
      title: I18n.t('vade.config.taskType'),
      dataIndex: 'taskTypeName'
    },
    {
      title: I18n.t('vade.config.entry'),
      dataIndex: 'entry'
    },
    {
      title: I18n.t('vade.config.createBy'),
      dataIndex: 'createUserId'
    },
    {
      title: I18n.t('vade.config.createDate'),
      dataIndex: 'uploadTime'
      // render: text => moment(text).format(DATE_FORMAT)
    }
  ];

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
    const { pageSize } = this.state;
    this.setState({ pageNo: PAGE_NUMBER });
    this.handleGetDataByPage(PAGE_NUMBER, pageSize, obj);
  };

  handleBatchDel = () => {
    const { dispatch, global } = this.props;
    const { checkedIds, pageSize } = this.state;
    dispatch({
      type: 'vadeProgram/delProgram',
      payload: {
        ids: checkedIds, // checkedIds.toString()
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Deleted Program Successfully', msgTitle);
        this.setState({ pageNo: PAGE_NUMBER });
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
      } else {
        msg.error(res.message, msgTitle);
      }
      this.closeConfirm();
      this.clean();
    });
  };

  handleGetDataByPage = (pageNo = PAGE_NUMBER, pageSize = PAGE_SIZE, searchMapObj) => {
    if (searchMapObj && !_.isEqual(searchMapObj, {})) {
      this.searchMapObj = searchMapObj;
    }
    const { dispatch, global } = this.props;
    dispatch({
      type: 'vadeProgram/getProgramList',
      payload: {
        pageNo,
        pageSize,
        category: 'program',
        createUserId: global.userId,
        ...this.searchMapObj
      }
    });
  };

  componentDidMount() {
    const { dispatch, global } = this.props;
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
    dispatch({
      type: 'vadeProgram/getEntryList',
      payload: {}
    });
    dispatch({
      type: 'vadeProgram/getFileTypeList',
      payload: { category: 'program', createUserId: global.userId }
    });
    dispatch({
      type: 'vadeProgram/getTaskTypeList',
      payload: { createUserId: global.userId }
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'vadeProgram/clearAll'
    });
  }

  render() {
    const { vadeProgram, global } = this.props;
    const { programList, taskTypeList } = vadeProgram;
    const {
      checkedIds,
      programEntryList,
      dataEntryList,
      openDialog,
      operationType,
      isConfirmPageOpen,
      openCreateTaskTypeDialog,
      itemData,
      pageNo,
      pageSize,
      downloadResult,
      openDetailDialog
    } = this.state;
    const rowSelection = {
      onChange: this.handleCheckboxClick,
      selectedRowKeys: checkedIds
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
              ['ProgramName', 'fileName', 'iptType'],
              ['TaskType', 'taskTypeName', 'dropdownType'],
              ['Entry', 'entry', 'dropdownType']
            ]}
            dataList={{
              TaskType: {
                data: taskTypeList ? taskTypeList.map(item => item.name) : [],
                type: 'normal'
              },
              Entry: { data: programEntryList, type: 'normal' }
            }}
          >
            <div style={{ marginLeft: 'auto' }}>
              {checkedIds.length > 0 ? (
                <div style={{ width: checkedIds.length > 1 ? 'unset' : 100 }}>
                  <ToolTip
                    title="Download"
                    style={{ display: checkedIds.length > 1 ? 'none' : 'inline-flex' }}
                  >
                    <IconButton aria-label="Download" onClick={this.downloadFile}>
                      <CloudDownload />
                    </IconButton>
                  </ToolTip>
                  <ToolTip title="Delete">
                    <IconButton aria-label="Delete" onClick={this.openConfirm}>
                      <Delete />
                    </IconButton>
                  </ToolTip>
                </div>
              ) : (
                <ToolTip title="Create Program">
                  <IconButton aria-label="Create Program" onClick={this.openCreateDialog}>
                    <LibraryAdd />
                  </IconButton>
                </ToolTip>
              )}
            </div>
          </TableToolbar>
        </Paper>
        <IVHTable
          dataSource={(programList && programList.items) || []}
          columns={this.columns}
          rowSelection={rowSelection}
          handleChooseAll={this.handleSelectAllClick}
          tableMaxHeight="calc(100% - 160px)"
          keyId="uuid"
        />
        <TablePagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(programList && programList.totalNum) || 0}
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
        <Download exportData={downloadResult} />
        {openDialog && (
          <CreateOrUpdate
            closeDialog={this.onCloseAddOrUpdateDialog}
            handleSubmit={this.handleSubmit}
            operationType={operationType}
            dataEntryList={dataEntryList}
            programEntryList={programEntryList}
            taskTypeList={taskTypeList}
            itemData={operationType === 'create' ? [] : itemData}
            openCreateTaskTypeDialog={category => {
              this.setState({ openCreateTaskTypeDialog: true });
              this.flag_openCreate = true;
              this.categoryOfCreateTaskType = category;
            }}
            flag_openCreate={this.flag_openCreate}
            userId={global.userId}
            getChild={child => {
              this.CreateOrUpdateComponent = child;
            }}
          />
        )}
        {openDetailDialog && <DetailPage itemData={itemData} onClose={this.onCloseDetailPage} />}
        {openCreateTaskTypeDialog && (
          <CreateTaskTypeDialog
            getChild={child => {
              this.CreateTaskTypeComponent = child;
            }}
            openDialog={openCreateTaskTypeDialog}
            closeDialog={() => {
              this.setState({ openCreateTaskTypeDialog: false }, () => {
                this.flag_openCreate = false;
              });
            }}
            handleSubmit={this.handleAddTaskType}
            operationType="create"
            categoryOfCreateTaskType={this.categoryOfCreateTaskType}
          />
        )}
        <ConfirmPage
          message={I18n.t('vade.config.deleteProgramConfirm')}
          messageTitle={I18n.t('vade.config.deleteProgram')}
          isConfirmPageOpen={isConfirmPageOpen}
          hanldeConfirmMessage={this.handleBatchDel}
          handleConfirmPageClose={this.closeConfirm}
        />
      </>
    );
  }
}
export default connect(({ vadeProgram, global }) => ({ vadeProgram, global }))(VADEProgram);
