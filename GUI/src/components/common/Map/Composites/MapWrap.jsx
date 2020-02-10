import React from 'react';
import { Provider } from 'utils/createContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fafafa'
  }
}));

const highlight = {
  store: [],
  set(item) {
    if (!item) return;
    this.store = [...this.store, ...item];
  },
  clear() {
    const op = this.store;
    if (op.length > 0) {
      for (let i = 0, len = op.length; i < len; i++) {
        const item = op.shift();
        item.highlight.remove();
      }
    }
  },
  getAll() {
    return this.store;
  },
  replace(items) {
    if (!items) return;
    this.store = [...items];
  }
};

export default function MapWrap(props) {
  const { children } = props;
  const classes = useStyles();
  const context = {
    highlight
  };
  return (
    <Provider value={context}>
      <div id="COMPONENT_MAP" className={classes.root}>
        {children}
      </div>
    </Provider>
  );
}
