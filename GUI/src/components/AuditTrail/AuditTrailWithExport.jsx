import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Download, Permission, TableToolbar } from 'components/common';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
  return {
    date_wrapper: {
      display: 'flex',
      paddingLeft: theme.spacing(1)
    },
    export_btn: {
      marginLeft: 'auto',
      marginRight: theme.spacing(1)
    }
  };
});

function AuditTrailWithExport(props) {
  const {
    handleExport,
    exportData,
    downloadMaterialKey,
    handleSearch,
    fieldList,
    dataList,
    children
  } = props;
  const classes = useStyles();
  return (
    <TableToolbar
      handleGetDataByPage={obj => handleSearch(obj)}
      fieldList={fieldList}
      dataList={dataList}
      undeletableRange
    >
      {
        <>
          {children}
          <Permission materialKey={downloadMaterialKey}>
            <Download
              handleExport={() => handleExport()}
              className={classes.export_btn}
              exportData={exportData}
              isIconNeeded
            />
          </Permission>
        </>
      }
    </TableToolbar>
  );
}

AuditTrailWithExport.defaultProps = {
  handleExport: () => {},
  handleSearch: () => {},
  exportData: null,
  fieldList: [],
  dataList: {}
};

AuditTrailWithExport.propTypes = {
  handleExport: PropTypes.func,
  handleSearch: PropTypes.func,
  exportData: PropTypes.any,
  downloadMaterialKey: PropTypes.string.isRequired,
  fieldList: PropTypes.array,
  dataList: PropTypes.object
};

export default AuditTrailWithExport;
