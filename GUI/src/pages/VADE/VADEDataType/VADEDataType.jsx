import React, { Component } from 'react';
import { connect } from 'dva';
import _ from 'lodash';
import { ToolTip, TableToolbar, ConfirmPage, IVHTable } from 'components/common';
import { LibraryAdd, Delete } from '@material-ui/icons';
import { IconButton, Link, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { isSuccess } from 'utils/helpers';
import msg from 'utils/messageCenter';
import {
  VADEDataTypeCreateOrUpdate as CreateOrUpdate,
  VADEDataTypeDetailPage as DetailPage
} from 'components/VADE';
import { I18n } from 'react-i18nify';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import TablePagination from '@material-ui/core/TablePagination';

const msgTitle = 'VADE Data Type';
class VADEDataType extends Component {
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
    this.CreateOrUpdateComponent = '';
    this.searchMapObj = {};
    this.searchComponent = null;
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
      type: 'vadeDataType/delDataType',
      payload: {
        ids: checkedIds.toString(),
        createUserId: global.userId
      }
    }).then(res => {
      if (!res) return;
      if (isSuccess(res)) {
        msg.success('Deleted Data Type Successfully', msgTitle);
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
    event.nativeEvent.stopPropagation(); // check
    event.stopPropagation();
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
    const { vadeDataType } = this.props;
    const { checkedIds } = this.state;
    const { checked } = event.target;
    const curPageIds = vadeDataType.dataTypeList.items.map(item => item.uuid);
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
    const { pageNo, pageSize } = this.state;
    const newObj = obj;
    newObj.createUserId = global.userId;
    newObj.pageNo = pageNo;
    newObj.pageSize = pageSize;
    dispatch({
      type: 'vadeDataType/saveDataType',
      payload: newObj
    }).then(res => {
      if (isSuccess(res)) {
        msg.success('Saved Data Type Successfully', msgTitle);
        this.searchMapObj = {};
        this.handleGetDataByPage(PAGE_NUMBER, pageSize);
        this.setState(
          {
            openDialog: false,
            pageNo: PAGE_NUMBER
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
    const { pageSize } = this.state;
    // this.setState({ pageNo: PAGE_NUMBER });
    this.handleGetDataByPage(PAGE_NUMBER, pageSize, obj);
  };

  columns = [
    {
      title: I18n.t('vade.config.dataTypeName'),
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
      title: I18n.t('vade.config.description'),
      dataIndex: 'desc'
    },
    {
      title: I18n.t('vade.config.entry'),
      dataIndex: 'entry'
    }
  ];

  // rowSelection = {
  //   onChange: itemData => {
  //     this.setState({
  //       openDialog: true,
  //       operationType: 'detail',
  //       itemData
  //     });
  //   }
  // };

  handleGetDataByPage = (pageNo, pageSize, obj) => {
    const { dispatch, global } = this.props;
    if (obj) {
      this.searchMapObj = obj;
    }
    this.setState(
      {
        pageNo,
        pageSize
      },
      () => {
        dispatch({
          type: 'vadeDataType/getDataTypeList',
          payload: {
            pageNo,
            pageSize,
            createUserId: global.userId,
            ...this.searchMapObj
          }
        });
      }
    );
  };

  componentDidMount() {
    this.handleGetDataByPage(PAGE_NUMBER, PAGE_SIZE);
    const { dispatch } = this.props;
    dispatch({
      type: 'vadeDataType/getEntryList',
      payload: { category: 'data' }
    });
  }

  render() {
    const { vadeDataType } = this.props;
    const { dataTypeList, entryList } = vadeDataType;
    const {
      checkedIds,
      openDialog,
      itemData,
      operationType,
      isConfirmPageOpen,
      pageNo,
      pageSize,
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
            fieldList={[['DataTypeName', 'name', 'iptType'], ['Entry', 'entry', 'dropdownType']]}
            dataList={{
              Entry: { data: entryList.map(item => item.entry) || [], type: 'normal' }
            }}
          >
            <div style={{ marginLeft: 'auto' }}>
              {checkedIds.length > 0 ? (
                <ToolTip title="Delete">
                  <IconButton aria-label="Delete" onClick={this.openConfirm}>
                    <Delete />
                  </IconButton>
                </ToolTip>
              ) : (
                <ToolTip
                  title="Create Data Type"
                  onClick={() =>
                    this.setState({
                      openDialog: true,
                      operationType: 'create',
                      itemData: []
                    })
                  }
                >
                  <IconButton>
                    <LibraryAdd />
                  </IconButton>
                </ToolTip>
              )}
            </div>
          </TableToolbar>
        </Paper>

        <IVHTable
          dataSource={(dataTypeList && dataTypeList.items) || []}
          columns={this.columns}
          rowSelection={rowSelection}
          handleChooseAll={this.handleSelectAllClick}
          tableMaxHeight="calc(100% - 160px)"
          keyId="uuid"
        />
        <TablePagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(dataTypeList && dataTypeList.totalNum) || 0}
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
          getChild={child => {
            this.CreateOrUpdateComponent = child;
          }}
          openDialog={openDialog}
          closeDialog={() => {
            this.setState({ openDialog: false });
            this.clean();
          }}
          handleSubmit={this.handleSubmit}
          entryList={entryList}
          itemData={itemData}
          operationType={operationType}
        />
        {openDetailDialog && <DetailPage itemData={itemData} onClose={this.onCloseDetailPage} />}
        <ConfirmPage
          message={I18n.t('vade.config.deleteDataTypeConfirm')}
          messageTitle={I18n.t('vade.config.deleteDataType')}
          isConfirmPageOpen={isConfirmPageOpen}
          hanldeConfirmMessage={this.handleBatchDel}
          handleConfirmPageClose={this.closeConfirm}
        />
      </>
    );
  }
}
export default connect(({ vadeDataType, global }) => ({ vadeDataType, global }))(VADEDataType);
