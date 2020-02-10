import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { ToolTip } from 'components/common';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import { exportExcel } from 'xlsx-oc';
import { dateTimeTypeForExportExcel } from 'utils/dateHelper';

const icons = {
  export: SaveAltIcon,
  delete: DeleteIcon
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    minHeight: '50px',
    height: '100%'
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
  }
}));

const DeleteHeader = props => {
  const classes = useToolbarStyles();
  const { numSelected, iconInfo, handleDelete } = props;
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
          {numSelected.length}
          selected
        </Typography>
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        <ToolTip title={iconInfo.label}>
          <IconButton aria-label={iconInfo.label} onClick={handleExport}>
            <Icon />
          </IconButton>
        </ToolTip>
      </div>
    </Toolbar>
  );
};

DeleteHeader.defaultProps = {
  iconInfo: {
    icon: 'export',
    label: 'Export Selected'
  },
  handleDelete: () => {}
};

DeleteHeader.propTypes = {
  numSelected: PropTypes.array.isRequired,
  iconInfo: PropTypes.object,
  handleDelete: PropTypes.func
};

export default DeleteHeader;
