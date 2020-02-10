import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import msg from 'utils/messageCenter';
import { ToolTip, TableToolbar, ConfirmPage, IVHTable } from 'components/common';
import Paper from '@material-ui/core/Paper';
import { LibraryAdd, Delete } from '@material-ui/icons';
import { isSuccess } from 'utils/helpers';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import TablePagination from '@material-ui/core/TablePagination';
import {
  VADETaskTypeCreateOrUpdate as CreateOrUpdate,
  VADETaskTypeDetailPage as DetailPage
} from 'components/VADE';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';

const msgTitle = 'VADE Task Type';
class VADETaskType extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      checkedIds: [],
      operationType: '',
      openDialog: false,
      itemData: {},
      pageNo: PAGE_NUMBER,
      pageSize: PAGE_SIZE,
      isConfirmPageOpen: false,
      openDetailDialog: false
    };
    this.searchComponent = null;
    this.searchObj = {};
  }

  componentWillReceiveProps(nextProps) {
    const { vadeTaskType } = this.props;
    const { taskTypeList } = vadeTaskType;
    if (!_.isEqual(nextProps.vadeTaskType.taskTypeList, taskTypeList)) {
      this.setState({
        openDialog: false
      });
    }
  }

  openConfirm = () => {
    this.setState({ isConfirmPageOpen: true });
  };

  closeConfirm = () => {
    this.setState({ isConfirmPageOpen: false });
  };

  openDetail = itemData => {
    this.setState({ openDetailDialog: true, itemData });
  };

  onCloseDetailPage = () => {
    this.setState({ openDetailDialog: false });
  };

  handleBatchDel = () => {
    const { dispatch, global } = this.props;
    const { checkedIds, pageSize } = this.state;
    dispatch({
      type: 'vadeTaskType/delTaskType',
      payload: {
        ids: checkedIds.toString(),
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Deleted Task Type Successfully', msgTitle);
        this.setState({ pageNo: PAGE_NUMBER });
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
      } else {
        msg.error(res.message, msgTitle);
      }
      this.closeConfirm();
      this.clean();
    });
  };

  handleCheckboxClick = (item, event) => {
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const targetId = item.uuid;
    const newSelected = checkedIds;
    const valueIndex = newSelected.indexOf(targetId);

    if (checked && valueIndex === -1) {
      newSelected.push(targetId);
    }
    if (!checked && valueIndex !== -1) {
      newSelected.splice(valueIndex, 1);
    }
    this.setState({ checkedIds: newSelected });
  };

  handleSelectAllClick = event => {
    const { vadeTaskType } = this.props;
    const { taskTypeList } = vadeTaskType;
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const curPageIds = taskTypeList.items.map(item => item.uuid);
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
    this.setState({
      checkedIds: []
      // operationType: ""
    });
  };

  handleSubmit = obj => {
    const { dispatch, global } = this.props;
    const newObj = obj;
    newObj.createUserId = global.userId;
    dispatch({
      type: 'vadeTaskType/saveTaskType',
      payload: newObj
    }).then(res => {
      if (res && isSuccess(res)) {
        msg.success('Saved Task Type Successfully', msgTitle);
        this.searchComponent.clean();
        this.CreateOrUpdateComponent.clean();
        this.searchObj = {};
        const { pageSize } = this.state;
        this.setState({ pageNo: PAGE_NUMBER });
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
      } else {
        msg.error(res.message, msgTitle);
      }
    });
  };

  columns = [
    {
      title: I18n.t('vade.config.taskTypeName'),
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
      title: I18n.t('vade.config.taskTypeCategory'),
      dataIndex: 'category'
    },
    {
      title: I18n.t('vade.config.taskTypeDescription'),
      dataIndex: 'desc'
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

  handleGetDataByPage = (pageNo, pageSize, obj) => {
    const { dispatch, global } = this.props;
    if (obj) {
      this.searchObj = obj;
    }
    dispatch({
      type: 'vadeTaskType/getTaskTypeList',
      payload: {
        pageNo,
        pageSize,
        // name: this.searchObj && this.searchObj.name ? this.searchObj.name : '',
        // category: this.searchObj && this.searchObj.category ? this.searchObj.category : '',
        createUserId: global.userId,
        ...this.searchObj
      }
    });
  };

  componentDidMount() {
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
  }

  render() {
    const { vadeTaskType } = this.props;
    const { taskTypeList } = vadeTaskType;
    const {
      checkedIds,
      openDialog,
      operationType,
      itemData,
      isConfirmPageOpen,
      pageNo,
      pageSize,
      clearAll,
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
              ['TaskTypeName', 'name', 'iptType'],
              ['TaskTypeCategory', 'category', 'dropdownType']
            ]}
            dataList={{
              TaskTypeCategory: { data: ['training', 'prediction', 'evaluation'], type: 'normal' }
            }}
            clearAll={clearAll}
          >
            <div style={{ marginLeft: 'auto' }}>
              {checkedIds.length > 0 ? (
                <ToolTip title="Delete">
                  <IconButton aria-label="Delete" onClick={this.openConfirm}>
                    <Delete />
                  </IconButton>
                </ToolTip>
              ) : (
                <ToolTip title="Create Task Type">
                  <IconButton
                    onClick={() =>
                      this.setState({ openDialog: true, operationType: 'create', itemData: {} })
                    }
                  >
                    <LibraryAdd />
                  </IconButton>
                </ToolTip>
              )}
            </div>
          </TableToolbar>
        </Paper>
        <IVHTable
          dataSource={(taskTypeList && taskTypeList.items) || []}
          columns={this.columns}
          rowSelection={rowSelection}
          handleChooseAll={this.handleSelectAllClick}
          tableMaxHeight="calc(100% - 160px)"
          keyId="uuid"
        />
        <TablePagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(taskTypeList && taskTypeList.totalNum) || 0}
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
        <CreateOrUpdate
          openDialog={openDialog}
          closeDialog={() => {
            this.setState({ openDialog: false });
            this.clean();
          }}
          handleSubmit={this.handleSubmit}
          operationType={operationType}
          itemData={itemData}
          getChild={child => {
            this.CreateOrUpdateComponent = child;
          }}
        />
        {openDetailDialog && <DetailPage itemData={itemData} onClose={this.onCloseDetailPage} />}
        <ConfirmPage
          message={I18n.t('vade.config.deleteTaskTypeConfirm')}
          messageTitle={I18n.t('vade.config.deleteTaskType')}
          isConfirmPageOpen={isConfirmPageOpen}
          hanldeConfirmMessage={this.handleBatchDel}
          handleConfirmPageClose={this.closeConfirm}
        />
      </>
    );
  }
}
export default connect(({ vadeTaskType, global }) => ({ vadeTaskType, global }))(VADETaskType);
