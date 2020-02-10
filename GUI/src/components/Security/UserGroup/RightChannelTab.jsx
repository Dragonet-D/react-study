import React, { useState, useCallback } from 'react';
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
function ChannelTab(props) {
  const {
    data,
    handleSelectAllClick,
    handleCheckboxClick,
    selected,
    // totalNum,
    classes,
    modelsList,
    mode
  } = props;
  const { handleGetData } = props;
  const [pageNo, setpageNo] = useState(0);
  const [pageSize, setpageSize] = useState(5);

  const columns = [
    {
      title: I18n.t('uvms.channel.channelName'),
      dataIndex: 'channelName'
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

  function handleSearch(obj) {
    setpageNo(0);
    setpageSize(5);
    handleGetDataByPage(0, 5, obj);
  }

  const rowSelection = {
    onChange: handleCheckboxClick,
    selectedRowKeys: selected
  };
  // const dataSource =
  //   data &&
  //   data.slice(pageNo * pageSize, pageNo * pageSize + pageSize).map(item => {
  //     return {
  //       ...item,
  //       disabled: isAssigned(item.userUuid)
  //     };
  //   });

  return (
    <React.Fragment>
      <Toolbar>
        <div className={classes.toolbarLeft}>
          <TableToolbar
            handleGetDataByPage={handleSearch}
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
                data: modelsList && modelsList.map(item => item.name)
              },
              Status: {
                data: ['active', 'unavailable', 'disconnected']
              }
            }}
          />
        </div>
        <div className={classes.toolbarSpace} />
        <div className={classes.toolbarStatus}>
          {`${selected.length} ${I18n.t('security.userGroup.content.selected')}`}
        </div>
      </Toolbar>
      <IVHTable
        keyId="channelId"
        dataSource={data}
        columns={columns}
        rowSelection={!mode ? rowSelection : null}
        handleChooseAll={handleSelectAllClick}
      />
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25, 50]}
        count={data.length || 0}
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

export default withStyles(styles)(ChannelTab);
