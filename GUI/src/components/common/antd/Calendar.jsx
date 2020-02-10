import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Calendar } from 'antd';

const useStyles = makeStyles(theme => {
  const selectedBackgroundColor = theme.palette.background.paper;
  const mainTextColor = theme.palette.text.primary;

  return {
    '@global': {
      '.ant-select': {
        color: mainTextColor
      },
      '.ant-select-selection': {
        backgroundColor: selectedBackgroundColor,
        border: `1px solid ${theme.palette.primary.main}`
      },
      '.ant-select-arrow': {
        color: mainTextColor
      },
      '.ant-radio-button-wrapper-checked': {
        background: `${theme.palette.primary.main} !important`,
        color: mainTextColor,
        borderColor: `${theme.palette.primary.main} !important`
      },
      '.ant-radio-button-wrapper': {
        background: selectedBackgroundColor,
        color: mainTextColor,
        borderColor: `${theme.palette.primary.main} !important`
      },
      '.ant-fullcalendar': {
        color: mainTextColor
      },
      '.ant-fullcalendar-value': {
        color: mainTextColor,
        lineHeight: '25px'
      },
      '.ant-fullcalendar-fullscreen .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-date': {
        background: `${theme.palette.background.default}88`
      },
      '.ant-fullcalendar-fullscreen .ant-fullcalendar-today .ant-fullcalendar-value': {
        color: theme.palette.text.secondary
      },
      '.ant-fullcalendar-fullscreen .ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-month, .ant-fullcalendar-fullscreen .ant-fullcalendar-today .ant-fullcalendar-date': {
        borderTopColor: theme.palette.primary.main
      },
      '.ant-select-dropdown': {
        backgroundColor: theme.palette.background.paper
      },
      '.ant-select-dropdown-menu-item': {
        color: mainTextColor
      },
      '.ant-select-dropdown-menu-item:hover:not(.ant-select-dropdown-menu-item-disabled)': {
        backgroundColor: `${theme.palette.primary.main}77 !important`
      },
      '.ant-select-dropdown-menu-item-selected': {
        color: mainTextColor,
        backgroundColor: `${theme.palette.primary.main} !important`
      },
      '.ant-fullcalendar-fullscreen .ant-fullcalendar-month:hover, .ant-fullcalendar-fullscreen .ant-fullcalendar-date:hover': {
        background: `${theme.palette.primary.main}77 !important`
      },
      '.ant-fullcalendar-fullscreen .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value, .ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-value': {
        color: theme.palette.text.secondary
      },
      '.ant-radio-button-wrapper-checked::before': {
        backgroundColor: `${theme.palette.primary.main} !important`,
        opacity: '1'
      },
      '.ant-radio-button-wrapper:hover': {
        color: theme.palette.primary.dark
      },
      '.ant-select-selection:hover': {
        color: theme.palette.primary.dark
      },
      '.ant-fullcalendar-selected-day .ant-fullcalendar-value, .ant-fullcalendar-month-panel-selected-cell .ant-fullcalendar-value': {
        background: `${theme.palette.primary.main} !important`,
        color: mainTextColor
      },
      '.ant-fullcalendar-today .ant-fullcalendar-value, .ant-fullcalendar-month-panel-current-cell .ant-fullcalendar-value': {
        boxShadow: `0 0 0 1px ${theme.palette.primary.main} inset`
      },
      '.ant-fullcalendar-value:active': {
        background: `${theme.palette.primary.main} !important`,
        color: mainTextColor
      },
      '.ant-fullcalendar-value:hover': {
        background: `${theme.palette.primary.main}77 !important`
      }
    },
    wrapper: {
      padding: theme.spacing(1)
    }
  };
});

function IVHcalendar(props) {
  const classes = useStyles(props);
  return (
    <div className={classes.wrapper}>
      <Calendar {...props} />
    </div>
  );
}

export default IVHcalendar;
