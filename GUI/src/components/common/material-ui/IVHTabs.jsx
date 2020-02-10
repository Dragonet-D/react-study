import { withStyles } from '@material-ui/core';
import Tabs from '@material-ui/core/Tabs';

const IVHTabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.text.secondary
  },
  root: {
    display: 'flex',
    alignItems: 'center'
  }
}))(Tabs);

export default IVHTabs;
