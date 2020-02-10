import React, { useState, useEffect, useCallback, memo } from 'react';
import classNames from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import InitialCell from '@material-ui/core/TableCell';
import Divider from '@material-ui/core/Divider';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Loading } from 'components/Loading';
import { Radio } from '@material-ui/core';
import { I18n } from 'react-i18nify';
import { CellWithTooltip as TableCell } from './CellWithTooltip';
import TableTh from './TableTh';
import ToolTip from './ToolTip';
// import ScrollBar from '../OtherComponents/ScrollBar';
import NoData from '../OtherComponents/NoData';
import { getActiveData } from './utils';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      position: 'relative'
    },
    no_data: {
      padding: `${theme.spacing(2)}px 0`,
      textAlign: 'center'
    },
    header_cell: {
      padding: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
      height: '46px'
    },
    header_with_icon: {
      display: 'flex',
      alignItems: 'center'
    },
    header_no_checkbox: {
      padding: `${theme.spacing(0)}px 0`
    },
    table_row: {
      cursor: 'pointer',
      '&$selected': {
        backgroundColor: theme.palette.table.selected
      },
      '&:hover': {
        backgroundColor: `${theme.palette.table.selected}!important`
      }
    },
    selected: {},
    no_padding: {
      padding: 0,
      textAlign: 'center'
    },
    table_header: {
      minHeight: '42px',
      overflow: 'hidden',
      borderBottom: props => {
        if (_.isEmpty(props.dataSource)) {
          return `1px solid ${theme.palette.divider}`;
        } else {
          return 'none';
        }
      }
    },
    initial_cell: {
      position: 'sticky',
      backgroundColor: theme.palette.background.paper,
      zIndex: 1,
      top: 0
    }
  };
});

const IVHTable = memo(props => {
  const {
    columns,
    dataSource,
    extraCell,
    extraCellPrev,
    rowSelection,
    handleChooseAll,
    handleItemClick,
    handleSortChange,
    keyId,
    rowSelectionType,
    rowSelectionClick,
    rowSelectionDoubleClick,
    isRadio,
    handleRoleSelected,
    selectedRadio,
    tableMaxHeight,
    disabled,
    disableChecked,
    loading,
    classCustom
  } = props;
  const isLength = !!dataSource.length;
  const classes = useStyles(props);

  const [order, setOrder] = useState('desc');
  const [activeSort, setActiveSort] = useState(getActiveData(columns));
  const [data, setData] = useState(dataSource);
  const [activeRow, setActiveRow] = useState(-1);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  const handleItem = useCallback(
    item => e => {
      handleItemClick(item, e);
    },
    [handleItemClick]
  );

  const handleSort = useCallback(
    (item, sorter) => () => {
      setOrder(() => {
        const sort = sorter === 'asc' ? 'desc' : 'asc';
        handleSortChange({
          data: item,
          sort
        });
        return sort;
      });
      setActiveSort(item.title);
    },
    [handleSortChange]
  );

  const handleRowClick = useCallback(
    item => () => {
      const isSame = activeRow === item[keyId];
      if (rowSelectionType === 'single') {
        setActiveRow(isSame ? -1 : item[keyId]);
        rowSelectionClick(isSame ? {} : item);
      } else if (rowSelectionType === 'multiple') {
        setActiveRow(-1);
      }
    },
    [activeRow, keyId, rowSelectionClick, rowSelectionType]
  );

  const onChooseAll = useCallback(
    e => {
      if (_.isFunction(handleChooseAll)) {
        handleChooseAll(e);
      }
    },
    [handleChooseAll]
  );

  const isChooseAll = useCallback(
    selectedRowKeys => {
      if (!selectedRowKeys) return;
      return selectedRowKeys
        ? selectedRowKeys.length >= dataSource.length &&
            dataSource.every(itemData => {
              return !!selectedRowKeys.find(item => itemData[keyId] === item);
            })
        : dataSource.every(item => item.checked);
    },
    [dataSource, keyId]
  );

  const handleTitleToolTip = useCallback(title => {
    if (_.isObject(title)) {
      return (
        <ToolTip title={title.tooltip}>
          <span>{title.title}</span>
        </ToolTip>
      );
    }
    return title;
  }, []);

  const handleRowDoubleClick = item => () => {
    rowSelectionDoubleClick(item);
  };
  return (
    <div
      className={classes.wrapper}
      style={{ maxHeight: tableMaxHeight || 'auto', overflowY: 'scroll' }}
    >
      {loading && <Loading />}
      <Divider />
      <Table>
        <TableHead>
          <TableRow>
            {isRadio && (
              <TableTh className={classes.no_padding} style={{ width: 40 }}>
                {I18n.t('security.userManagement.roleTable.option')}
              </TableTh>
            )}
            {isLength &&
              rowSelection &&
              rowSelection.type !== 'radio' &&
              (() => {
                const { selectedRowKeys } = rowSelection;
                return (
                  <InitialCell
                    className={classNames(classes.no_padding, classes.initial_cell)}
                    style={{ width: 40 }}
                  >
                    <Checkbox
                      color="primary"
                      checked={isChooseAll(selectedRowKeys)}
                      onClick={onChooseAll}
                      disabled={disabled || !_.isFunction(handleChooseAll)}
                      style={{
                        visibility:
                          disabled || !_.isFunction(handleChooseAll) ? 'hidden' : 'visible'
                      }}
                    />
                  </InitialCell>
                );
              })()}
            {extraCellPrev.columns.map(item => {
              if (item.show === false) {
                return null;
              }
              return (
                <TableTh
                  className={classNames(
                    rowSelection && isLength ? classes.header_no_checkbox : classes.header_cell,
                    classCustom && classCustom.tableHead
                  )}
                  width={item.width || 100}
                  key={item.title}
                >
                  {item.title}
                </TableTh>
              );
            })}
            {columns.map(item => {
              const key = _.isObject(item.title) ? _.get(item.title, 'title', '') : item.title;
              return (
                <TableTh
                  className={classNames(
                    rowSelection && isLength ? classes.header_no_checkbox : classes.header_cell,
                    classCustom && classCustom.tableHead
                  )}
                  key={key}
                  width={item.width || 100}
                >
                  {item.sorter ? (
                    <TableSortLabel
                      active={item.title === activeSort}
                      direction={order}
                      onClick={handleSort(item, order)}
                    >
                      {handleTitleToolTip(item.title)}
                    </TableSortLabel>
                  ) : item.icon ? (
                    <div className={classes.header_with_icon}>
                      {handleTitleToolTip(item.title)}
                      {item.icon}
                    </div>
                  ) : (
                    handleTitleToolTip(item.title)
                  )}
                </TableTh>
              );
            })}
            {extraCell.columns.map(item => {
              if (item.show === false) {
                return null;
              }
              return (
                <TableTh width={item.width || 100} key={item.title}>
                  {item.title}
                </TableTh>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLength ? (
            data.map((item, index) => {
              return (
                <TableRow
                  key={item[keyId] || item.id || index}
                  hover
                  selected={activeRow === item[keyId]}
                  className={classes.table_row}
                  classes={{ selected: classes.selected }}
                  onClick={handleRowClick(item)}
                  onDoubleClick={handleRowDoubleClick(item)}
                >
                  {isRadio && (
                    <InitialCell className={classes.no_padding} style={{ width: 40 }}>
                      <Radio
                        color="primary"
                        checked={selectedRadio === item[keyId]}
                        onChange={event => handleRoleSelected(event)}
                        value={item[keyId]}
                      />
                    </InitialCell>
                  )}
                  {rowSelection &&
                    (() => {
                      const { selectedRowKeys, disabledRowKeys } = rowSelection;
                      return (
                        <InitialCell className={classes.no_padding} style={{ width: 40 }}>
                          <Checkbox
                            color="primary"
                            checked={
                              selectedRowKeys
                                ? selectedRowKeys.includes(item[keyId])
                                : !!item.checked
                            }
                            disabled={
                              disabled ||
                              !!item.disabled ||
                              (disabledRowKeys &&
                                disabledRowKeys.includes(item[keyId]) &&
                                disableChecked)
                            }
                            onClick={e => rowSelection.onChange(item, e)}
                            value={item}
                          />
                        </InitialCell>
                      );
                    })()}
                  {extraCellPrev.components.map(extraItem => {
                    if (extraItem.show === false) {
                      return null;
                    }
                    return (
                      <TableCell
                        width={extraItem.width || 100}
                        isPadding={!rowSelection}
                        key={extraItem.key}
                      >
                        {extraItem.component(item)}
                      </TableCell>
                    );
                  })}
                  {columns.map(itemRow => {
                    // if itemContent is undefined, need render
                    const itemContent = _.get(item, itemRow.dataIndex, '');
                    const { renderItem, render } = itemRow;
                    // add tooltipTitle in itemRow by anke
                    const tooltipTitle = _.get(item, itemRow.tooltipTitle);
                    const titleMsg =
                      tooltipTitle ||
                      (!itemRow.noTooltip
                        ? itemRow.render
                          ? itemRow.render(itemContent)
                          : itemContent
                        : '');
                    return (
                      <TableCell
                        width={itemRow.width || 100}
                        key={itemRow.dataIndex}
                        onClick={itemRow.render && handleItem(item)}
                        isPadding={!rowSelection}
                        // if itemContent is undefined, need render
                        titleMsg={titleMsg}
                      >
                        {(() => {
                          if (_.isFunction(renderItem)) {
                            return renderItem(item);
                          } else if (_.isFunction(render)) {
                            return render(itemContent);
                          }
                          return itemContent;
                        })()}
                      </TableCell>
                    );
                  })}
                  {extraCell.components.map(extraItem => {
                    if (extraItem.show === false) {
                      return null;
                    }
                    return (
                      <TableCell
                        width={extraItem.width || 100}
                        isPadding={false}
                        key={extraItem.key}
                      >
                        {extraItem.component(item)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan="10" className={classes.no_data}>
                <NoData pureText />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});

IVHTable.defaultProps = {
  handleChooseAll: undefined,
  rowSelection: null,
  extraCell: {
    columns: [],
    components: []
  },
  extraCellPrev: {
    columns: [],
    components: []
  },
  dataSource: [],
  columns: [],
  handleItemClick: () => {},
  handleSortChange: () => {},
  keyId: '',
  rowSelectionType: '',
  rowSelectionClick: () => {},
  rowSelectionDoubleClick: () => {},
  tableMaxHeight: '',
  disabled: false,
  loading: false
};

IVHTable.propTypes = {
  handleChooseAll: PropTypes.func,
  rowSelection: PropTypes.object,
  extraCell: PropTypes.object,
  extraCellPrev: PropTypes.object,
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  handleItemClick: PropTypes.func,
  handleSortChange: PropTypes.func,
  keyId: PropTypes.string,
  rowSelectionType: PropTypes.oneOf(['single', 'multiple', '']),
  rowSelectionClick: PropTypes.func,
  rowSelectionDoubleClick: PropTypes.func,
  tableMaxHeight: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool
};

export default IVHTable;
