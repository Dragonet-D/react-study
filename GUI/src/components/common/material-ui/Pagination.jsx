import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TablePagination from '@material-ui/core/TablePagination';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      backgroundColor: theme.palette.background.paper
    }
  };
});

function Pagination(props) {
  const classes = useStyles();
  const isHidePagination = true;
  const {
    count,
    rowsPerPage,
    page,
    rowsPerPageOptions,
    onChangePage,
    onChangeRowsPerPage,
    backIconButtonProps,
    nextIconButtonProps,
    ...rest
  } = props;
  const [pageSize, setPageSize] = useState(rowsPerPage);

  function handleChangeRowsPerPage(e) {
    const { value } = e.target;
    if (value !== pageSize) {
      const temp = {};
      onChangeRowsPerPage(_.set(temp, 'target.value', value));
      setPageSize(value);
    }
  }

  if (isHidePagination && _.toNumber(count || 0) === 0) {
    return null;
  }

  return (
    <TablePagination
      className={classes.wrapper}
      component="div"
      count={_.toNumber(count || 0)}
      rowsPerPage={pageSize}
      page={page}
      rowsPerPageOptions={rowsPerPageOptions}
      backIconButtonProps={backIconButtonProps}
      nextIconButtonProps={nextIconButtonProps}
      onChangePage={onChangePage}
      labelRowsPerPage={I18n.t('global.pagination.remind')}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      {...rest}
    />
  );
}

Pagination.defaultProps = {
  rowsPerPageOptions: [5, 10, 25, 50],
  onChangePage: () => {},
  onChangeRowsPerPage: () => {},
  count: 0,
  backIconButtonProps: {
    'aria-label': I18n.t('global.pagination.previousPage')
  },
  nextIconButtonProps: {
    'aria-label': I18n.t('global.pagination.nextPage')
  },
  rowsPerPage: 5,
  page: 0
};

Pagination.propTypes = {
  rowsPerPageOptions: PropTypes.array,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  count: PropTypes.any,
  backIconButtonProps: PropTypes.object,
  nextIconButtonProps: PropTypes.object,
  rowsPerPage: PropTypes.any,
  page: PropTypes.any
};

export default Pagination;
