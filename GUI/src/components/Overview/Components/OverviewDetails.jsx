import React, { useCallback, useState } from 'react';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { IVHTable, Pagination, Button, TableToolbar } from 'components/common';
import { PAGE_NUMBER, PAGE_SIZE } from 'commons/constants/const';
import {
  cameraColumns,
  userColumns,
  licenseColumns,
  instanceOverviewColumns,
  vaIRUColumns
  // crowdDetectionColumns
} from '../config';

function ShowDetails(props) {
  const { onBack, detailTitle, dataSource, tableInfo, targetChart, handleGetDataByPage } = props;
  const [pageNo, setpageNo] = useState(PAGE_NUMBER);
  const [pageSize, setpageSize] = useState(PAGE_SIZE);
  const handleBack = useCallback(() => {
    onBack();
  }, [onBack]);

  const onChangePage = (e, page) => {
    setpageNo(page);
    handleGetDataByPage(page, pageSize);
  };

  function handleSearch(obj) {
    setpageNo(PAGE_NUMBER);
    handleGetDataByPage(PAGE_NUMBER, pageSize, obj);
  }

  const onChangeRowsPerPage = e => {
    const { value } = e.target;
    setpageNo(PAGE_NUMBER);
    setpageSize(value);
    handleGetDataByPage(PAGE_NUMBER, value);
  };

  const disconnectExtraCell = {
    columns: [
      {
        title: I18n.t('overview.title.actions'),
        dataIndex: ''
      }
    ],
    components: [
      {
        component: item =>
          (item.status === 'Online' || item.userStatus === 'Online') && (
            <Button
              size="medium"
              color="default"
              onClick={() => tableInfo.extraMethod(item[tableInfo.extraParam])}
            >
              {I18n.t('overview.button.disconnect')}
            </Button>
          ),
        key: '12'
      }
    ]
  };
  const columns = target => {
    switch (target) {
      case 'cameraColumns':
        return cameraColumns;
      case 'userColumns':
        return userColumns;
      case 'licenseColumns':
        return licenseColumns;
      case 'instanceOverviewColumns':
        return instanceOverviewColumns;
      case 'vaIRUColumns':
        return vaIRUColumns;
      // case 'crowdDetectionColumns':
      //   return crowdDetectionColumns;
      default:
        break;
    }
  };
  const extraCell = target => {
    switch (target) {
      case 'cameraExtraCell':
        return disconnectExtraCell;
      case 'userExtraCell':
        return disconnectExtraCell;
      default:
        break;
    }
  };
  return (
    <>
      <div>
        <Typography color="textSecondary" variant="h6" style={{ display: 'inline' }}>
          {detailTitle}
        </Typography>
        <Button size="small" color="primary" onClick={handleBack} style={{ float: 'right' }}>
          {I18n.t('overview.button.backToOverview')}
        </Button>
      </div>
      <Paper elevation={0}>{targetChart}</Paper>
      <Paper elevation={0}>
        <TableToolbar
          handleGetDataByPage={handleSearch}
          fieldList={tableInfo.fieldList || []}
          dataList={tableInfo.dataList || {}}
        />
        <IVHTable
          dataSource={(dataSource && dataSource.items) || []}
          columns={columns(tableInfo.columns)}
          extraCell={extraCell(tableInfo.extraCell)}
          keyId={tableInfo.keyId}
        />
        <Pagination
          page={pageNo}
          rowsPerPage={pageSize}
          count={(dataSource && dataSource.totalNum) || 0}
          onChangePage={onChangePage}
          onChangeRowsPerPage={onChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

ShowDetails.defaultProps = {
  onBack: () => {},
  handleGetDataByPage: () => {}
};

ShowDetails.propTypes = {
  onBack: PropTypes.func,
  handleGetDataByPage: PropTypes.func
};

export default ShowDetails;
