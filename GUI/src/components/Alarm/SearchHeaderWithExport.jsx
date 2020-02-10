import React from 'react';
import { makeStyles } from '@material-ui/core';
import { TableToolbar, Download, Permission } from 'components/common';
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

function SearchHeaderWithExport(props) {
  const {
    handleSearch,
    fieldList,
    dataList,
    handleExport,
    children,
    exportData,
    downloadMaterialKey
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

SearchHeaderWithExport.defaultProps = {
  handleSearch: () => {},
  fieldList: [],
  dataList: {},
  handleExport: () => {},
  exportData: null
};

SearchHeaderWithExport.propTypes = {
  handleSearch: PropTypes.func,
  fieldList: PropTypes.array,
  dataList: PropTypes.object,
  handleExport: PropTypes.func,
  exportData: PropTypes.any,
  downloadMaterialKey: PropTypes.string.isRequired
};

export default SearchHeaderWithExport;
