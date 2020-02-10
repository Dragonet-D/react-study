import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ToolTip } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { exportExcel } from 'xlsx-oc';
import { dateTimeTypeForExportExcel } from 'utils/dateHelper';
import { I18n } from 'react-i18nify';

const useToolbarStyles = makeStyles(theme => ({
  root: {
    height: theme.spacing(7),
    minHeight: theme.spacing(7),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper
  },
  highlight: {
    backgroundColor: theme.palette.background.default
  },
  spacer: {
    flex: '1 1 100%'
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: '0 0 auto'
  },
  selected: {
    marginRight: theme.spacing(1)
  }
}));

const AuditTrailSelectExport = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const isNumSelected = numSelected.length > 0;

  const getHeaders = dataList => {
    const headerList = [];
    Object.keys(dataList[0]).forEach(key => {
      const header = { k: String(key), v: String(key) };
      headerList.push(header);
    });
    return headerList;
  };

  let headers = [];
  if (numSelected && numSelected.length > 0) {
    headers = getHeaders(numSelected);
  }
  function handleExport() {
    exportExcel(headers, numSelected, `ActivityLog_${dateTimeTypeForExportExcel(new Date())}.xlsx`);
  }
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: isNumSelected
      })}
    >
      <div className={classes.title}>
        <Typography color="inherit" variant="subtitle1">
          <Typography color="textSecondary" component="span" className={classes.selected}>
            {numSelected.length}
          </Typography>
          {I18n.t('global.remindInformation.selected')}
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <ToolTip title="Export Selected">
          <IconButton aria-label="Export Selected" onClick={handleExport}>
            <SaveAltIcon />
          </IconButton>
        </ToolTip>
      </div>
    </Toolbar>
  );
};

AuditTrailSelectExport.propTypes = {
  numSelected: PropTypes.array.isRequired
};

export default AuditTrailSelectExport;
