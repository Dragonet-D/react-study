/**
 * @description common table
 * @exports {ButtonSmall, Th, Cell}
 * @author Wang Bai Shi <baishi.wang@ncsi.com.cn> on 11-13-2018
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import TableCell from '@material-ui/core/TableCell';
import _ from 'lodash';
import { Tooltip } from 'antd';

const thStyles = () => ({
  th: {
    fontWeight: 'bold',
    fontSize: '14px',
    textAlign: 'left',
    verticalAlign: 'middle',
    maxWidth: '100px',
    width: '100px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
});

const TableTh = ({ classes, className, ...rest }) => {
  return <TableCell className={classNames(className, classes.th)} {...rest} />;
};

TableTh.propTypes = {
  classes: PropTypes.object.isRequired
};

export const Th = withStyles(thStyles)(TableTh);

/**
 *
 * TableCell
 */

const cellStyles = {
  ellipsis: {
    fontSize: '14px',
    textAlign: 'left',
    verticalAlign: 'middle',
    maxWidth: '100px',
    width: '100px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
};

const TableCellEllipsis = ({ classes, className, ...rest }) => (
  <TableCell className={classNames(classes.ellipsis, className)} {...rest} />
);

TableCellEllipsis.propTypes = {
  classes: PropTypes.object.isRequired
};

export const Cell = withStyles(cellStyles)(TableCellEllipsis);

/**
 *
 * TableCell with Tooltip
 * add by Anke
 */

const CellWithTooltipStyles = theme => {
  return {
    ellipsis: {
      textAlign: 'left',
      verticalAlign: 'middle',
      maxWidth: '100px',
      width: '100px',
      lineHeight: 1,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    },
    tooltipCnfig: {
      wordWrap: 'break-word'
    },
    need_padding: {
      padding: `${theme.spacing(0)}px ${theme.spacing(1)}px`,
      height: theme.spacing(5)
    },
    no_padding: {
      padding: 0
    }
  };
};

const TableCellTooltip = ({ classes, className, titleMsg, isPadding, width, ...rest }) => {
  let title = '';
  if (rest.children && rest.children && rest.children.type === 'u') {
    title = rest.children.props.children;
  } else if (typeof rest.children !== 'object' && rest.children !== undefined) {
    title = rest.children;
  }
  if (_.isEmpty(titleMsg || title)) {
    return (
      <TableCell
        style={{ width, maxWidth: width }}
        className={classNames(
          classes.ellipsis,
          className,
          isPadding ? classes.need_padding : classes.no_padding
        )}
        {...rest}
      />
    );
  }
  return (
    <Tooltip title={titleMsg || title} placement="bottomLeft">
      <TableCell
        style={{ width, maxWidth: width }}
        className={classNames(
          classes.ellipsis,
          className,
          isPadding ? classes.need_padding : classes.no_padding
        )}
        {...rest}
      />
    </Tooltip>
  );
};

TableCellTooltip.defaultProps = {
  isPadding: true,
  width: 100
};

TableCellTooltip.propTypes = {
  classes: PropTypes.object.isRequired,
  isPadding: PropTypes.bool,
  width: PropTypes.number
};

export const CellWithTooltip = withStyles(CellWithTooltipStyles)(TableCellTooltip);

/**
 *
 *  small button
 */
const btnStyles = {
  root: {
    padding: 0,
    minWidth: '50px',
    minHeight: '20px',
    fontSize: '10px'
  }
};

const ButtonStylesOne = ({ classes, className, ...rest }) => (
  <Button className={classNames(classes.root, className)} {...rest} />
);

ButtonStylesOne.propTypes = {
  classes: PropTypes.object.isRequired
};

export const ButtonSmall = withStyles(btnStyles)(ButtonStylesOne);
