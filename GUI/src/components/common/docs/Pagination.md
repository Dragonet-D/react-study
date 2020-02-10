# Pagination

```js
import { Pagination } from 'components/common';

export function Test() {
  function handlePageNoChange(e) {}

  function handlePageSizeChange(e) {}
  return (
    <Pagination
      count={0}
      rowsPerPage={pageSize}
      page={pageNo}
      onChangePage={handlePageNoChange}
      onChangeRowsPerPage={handlePageSizeChange}
    />
  )
}

Pagination.defaultProps = {
  rowsPerPageOptions: [5, 10, 25, 50],
  onChangePage: () => {},
  onChangeRowsPerPage: () => {},
  count: 0,
  backIconButtonProps: {
    'aria-label': 'Previous Page'
  },
  nextIconButtonProps: {
    'aria-label': 'Next Page'
  }
};

Pagination.propTypes = {
  rowsPerPageOptions: PropTypes.array,
  onChangePage: PropTypes.func,
  onChangeRowsPerPage: PropTypes.func,
  count: PropTypes.number,
  backIconButtonProps: PropTypes.object,
  nextIconButtonProps: PropTypes.object
};
```
