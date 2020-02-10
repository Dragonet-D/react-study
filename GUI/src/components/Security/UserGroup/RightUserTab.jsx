import React, { useState, useCallback, useEffect } from 'react';
import { I18n } from 'react-i18nify';
import { Toolbar } from '@material-ui/core';
import { IVHTable, Pagination as TablePagination, TableToolbar } from 'components/common';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  toolbarLeft: {
    flex: '0 0 auto',
    paddingLeft: '15px'
  },
  toolbarSpace: {
    flex: '1 1 100%'
  },
  toolbarStatus: {
    flex: '0 0 auto',
    paddingRight: 30
  }
};
let lastFilter = {};
function UserTab(props) {
  const {
    data,
    handleSelectAllClick,
    handleCheckboxClick,
    selected,
    oldSelected,
    totalNum,
    resetPage,
    classes
  } = props;
  const { handleGetData } = props;
  const [pageNo, setpageNo] = useState(0);
  const [pageSize, setpageSize] = useState(5);
  const columns = [
    {
      title: I18n.t('security.userGroup.userTable.userId'),
      dataIndex: 'userId'
    },
    {
      title: I18n.t('security.userGroup.userTable.fullName'),
      dataIndex: 'userFullName'
    },
    {
      title: I18n.t('security.userGroup.userTable.email'),
      dataIndex: 'userEmail'
    },
    {
      title: I18n.t('security.userGroup.userTable.phone'),
      dataIndex: 'userPhone'
    }
  ];
  const handleGetDataByPage = useCallback(
    (pageNo, pageSize, filterObj) => {
      if (filterObj) {
        lastFilter = filterObj;
      }
      handleGetData(pageNo, pageSize, lastFilter);
    },
    [handleGetData]
  );
  const handleChangePage = (event, page) => {
    setpageNo(page);
    handleGetDataByPage(page, pageSize);
  };

  const onChangeRowsPerPage = event => {
    const val = event.target.value;
    setpageNo(0);
    setpageSize(val);
    handleGetDataByPage(0, val);
  };

  useEffect(() => {
    if (resetPage) {
      setpageNo(0);
      setpageSize(5);
    }
  }, [resetPage]);

  function handleSearch(obj) {
    setpageNo(0);
    setpageSize(5);
    handleGetDataByPage(0, 5, obj);
  }

  const rowSelection = {
    onChange: handleCheckboxClick,
    selectedRowKeys: selected,
    disabledRowKeys: oldSelected
  };

  return (
    <React.Fragment>
      <Toolbar>
        <div className={classes.toolbarLeft}>
          <TableToolbar
            handleGetDataByPage={handleSearch}
            fieldList={[
              ['User_ID', 'userId', 'iptType'],
              ['FullName', 'userFullName', 'iptType'],
              ['Email', 'userEmail', 'iptType'],
              ['Phone', 'userPhone', 'iptType']
            ]}
          />
        </div>
        <div className={classes.toolbarSpace} />
        <div className={classes.toolbarStatus}>
          {`${selected.length} ${I18n.t('security.userGroup.content.selected')}`}
        </div>
      </Toolbar>
      <IVHTable
        keyId="userUuid"
        dataSource={data}
        columns={columns}
        rowSelection={rowSelection}
        handleChooseAll={handleSelectAllClick}
        disableChecked
      />
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, 50]}
        count={totalNum || 0}
        rowsPerPage={pageSize}
        page={pageNo}
        backIconButtonProps={{
          'aria-label': I18n.t('security.userGroup.pagination.previousPage')
        }}
        nextIconButtonProps={{
          'aria-label': I18n.t('security.userGroup.pagination.nextPage')
        }}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={onChangeRowsPerPage}
      />
    </React.Fragment>
  );
}

export default withStyles(styles)(UserTab);
