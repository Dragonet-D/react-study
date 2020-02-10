import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ToolTip, isPermissionHas } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import { exportExcel } from 'xlsx-oc';
import { I18n } from 'react-i18nify';
import { dateTimeTypeForExportExcel } from 'utils/dateHelper';

const icons = {
  export: SaveAltIcon,
  delete: DeleteIcon
};

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    minHeight: theme.spacing(7),
    height: theme.spacing(7)
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

const AlarmHandleSelected = props => {
  const classes = useStyles();
  const { numSelected, iconInfo, handleDelete, materialKey } = props;
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
    if (iconInfo.icon === 'export') {
      exportExcel(
        headers,
        numSelected,
        `EventDetails_${dateTimeTypeForExportExcel(new Date())}.xlsx`
      );
    } else {
      handleDelete();
    }
  }
  const Icon = icons[iconInfo.icon];
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
      {isPermissionHas(materialKey) && (
        <div className={classes.actions}>
          <ToolTip title={iconInfo.label}>
            <IconButton aria-label={iconInfo.label} onClick={handleExport}>
              <Icon />
            </IconButton>
          </ToolTip>
        </div>
      )}
    </Toolbar>
  );
};

AlarmHandleSelected.defaultProps = {
  iconInfo: {
    icon: 'export',
    label: I18n.t('alarm.remindInformation.exportSelected')
  },
  handleDelete: () => {},
  materialKey: ''
};

AlarmHandleSelected.propTypes = {
  numSelected: PropTypes.array.isRequired,
  iconInfo: PropTypes.object,
  handleDelete: PropTypes.func,
  materialKey: PropTypes.string
};

export default AlarmHandleSelected;
