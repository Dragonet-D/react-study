import React, { memo } from 'react';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { IconButton, Tooltip } from '@material-ui/core';
import _ from 'lodash';
import { exportExcel } from 'xlsx-oc';
import { dateTimeTypeForExportExcel } from 'utils/dateHelper';
import { I18n } from 'react-i18nify';

const ExportFixedListData = memo(({ dataSource, name, className }) => {
  function getHeaders(dataList) {
    const headerList = [];
    Object.keys(dataList[0]).forEach(key => {
      const header = { k: String(key), v: String(key) };
      headerList.push(header);
    });
    return headerList;
  }

  function handleExport() {
    if (_.isEmpty(dataSource)) return;
    const dataTemp = _.cloneDeep(dataSource);
    const data = dataTemp.map(item => {
      for (const key in item) {
        if (item.hasOwnProperty(key)) {
          if (!item[key]) {
            delete item[key];
          } else if (!_.isString(item[key])) {
            item[key] = JSON.stringify(item[key]);
          }
        }
      }
      return item;
    });
    let headers = [];
    if (data && data.length > 0) {
      headers = getHeaders(data);
    }
    exportExcel(headers, data, `${name}_${dateTimeTypeForExportExcel(new Date())}.xlsx`);
  }
  return (
    <Tooltip title={I18n.t('component.button.export')}>
      <IconButton onClick={handleExport} className={className}>
        <SaveAltIcon />
      </IconButton>
    </Tooltip>
  );
});

ExportFixedListData.defaultProps = {
  className: ''
};

export default ExportFixedListData;
