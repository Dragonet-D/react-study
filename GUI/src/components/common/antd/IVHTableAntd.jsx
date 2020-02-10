import React from 'react';
import { Table } from 'antd';
import C from 'classnames';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => {
  const textSecondary = theme.palette.text.secondary;
  const textPrimary = theme.palette.text.primary;
  const backgroundPaper = theme.palette.background.paper;
  return {
    table: {
      color: textPrimary
    },
    '@global': {
      '.ant-table': {
        color: textPrimary
      },
      '.ant-table-thead': {
        borderTop: `1px solid ${theme.palette.divider}`
      },
      '.ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td': {
        background: theme.palette.table.selected
      },
      '.ant-table-tbody > tr.ant-table-row-selected td': {
        background: backgroundPaper
      },
      '.ant-checkbox-inner': {
        background: 'transparent',
        border: `2px solid ${textSecondary}`
      },
      '.ant-checkbox-checked .ant-checkbox-inner': {
        backgroundColor: textSecondary,
        borderColor: textSecondary
      },
      '.ant-checkbox-wrapper:hover .ant-checkbox-inner, .ant-checkbox:hover .ant-checkbox-inner, .ant-checkbox-input:focus + .ant-checkbox-inner': {
        borderColor: textSecondary
      },
      '.ant-checkbox-checked .ant-checkbox-inner::after': {
        borderColor: backgroundPaper,
        left: '2px'
      },
      '.ant-checkbox-indeterminate .ant-checkbox-inner::after': {
        backgroundColor: backgroundPaper
      },
      '.ant-checkbox-indeterminate .ant-checkbox-inner': {
        backgroundColor: 'transparent',
        borderColor: textSecondary
      },
      '.ant-table-thead > tr > th, .ant-table-tbody > tr > td': {
        padding: '0 8px',
        textAlign: 'left',
        verticalAlign: 'middle',
        maxWidth: '250px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: theme.spacing(5)
      },
      '.ant-table-thead > tr > th': {
        background: backgroundPaper,
        color: textSecondary,
        fontWeight: 'bold',
        fontSize: theme.typography.subtitle2.fontSize,
        height: `${theme.spacing(6)}px!important`
      },
      '.ant-spin-container::after': {
        background: 'transparent'
      },
      '.ant-table-placeholder': {
        background: 'transparent'
      },
      '.ant-empty-normal': {
        color: textPrimary
      },
      '.ant-checkbox-disabled .ant-checkbox-inner': {
        backgroundColor: theme.palette.text.disabled,
        borderColor: `${theme.palette.text.disabled}!important`
      },
      '.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after': {
        borderColor: backgroundPaper
      },
      '.ant-checkbox-disabled .ant-checkbox-inner::after': {
        borderColor: backgroundPaper
      },
      '.ant-table-fixed-header > .ant-table-content > .ant-table-scroll > .ant-table-body': {
        background: backgroundPaper
      },
      '.ant-table-header': {
        background: backgroundPaper
        // overflow: 'hidden!important'
      },
      '.ant-table-fixed-header .ant-table-scroll .ant-table-header::-webkit-scrollbar': {
        border: 'none'
      },
      // radio
      '.ant-radio-inner': {
        background: 'transparent',
        border: `2px solid ${textSecondary}`
      },
      '.ant-radio-checked .ant-radio-inner': {
        backgroundColor: textSecondary,
        borderColor: textSecondary
      },
      '.ant-radio-wrapper:hover .ant-radio, .ant-radio:hover .ant-radio-inner, .ant-radio-input:focus + .ant-radio-inner': {
        borderColor: textSecondary
      },
      '.ant-radio-checked .ant-radio-inner::after': {
        borderColor: backgroundPaper,
        left: '2px'
      },
      '.ant-radio-indeterminate .ant-radio-inner::after': {
        backgroundColor: backgroundPaper
      },
      '.ant-radio-indeterminate .ant-radio-inner': {
        backgroundColor: 'transparent',
        borderColor: textSecondary
      },
      '.ant-radio-disabled .ant-radio-inner': {
        backgroundColor: theme.palette.text.disabled,
        borderColor: `${theme.palette.text.disabled}!important`
      },
      '.ant-radio-disabled.ant-radio-checked .ant-radio-inner::after': {
        borderColor: backgroundPaper,
        backgroundColor: theme.palette.text.disabled
      },
      '.ant-radio-disabled .ant-radio-inner::after': {
        borderColor: backgroundPaper
      },
      '.ant-radio-inner::after': {
        backgroundColor: textSecondary
      }
    }
  };
});

function IVHTableAntd(props) {
  const classes = useStyles();
  const { className, pagination, ...rest } = props;

  return <Table pagination={pagination} className={C(classes.table, className)} {...rest} />;
}

IVHTableAntd.defaultProps = {
  pagination: false
};

export default IVHTableAntd;
