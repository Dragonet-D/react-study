import React, { memo } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles(theme => {
  return {
    root: {
      padding: 0,
      width: '100%'
    },
    primary: {
      display: 'block',
      color: theme.palette.text.secondary,
      flex: flex => flex.key,
      whiteSpace: 'nowrap',
      paddingRight: '8px'
    },
    secondary: {
      wordBreak: 'break-all',
      color: 'inherit',
      flex: flex => flex.value
    },
    item_list: {
      padding: 0
    },
    item_text: {
      display: 'flex',
      alignItems: 'center'
    }
  };
});

const ListItemPreview = memo(({ dataSource, className, flex }) => {
  const classes = useStyles(flex);
  const dataKeys = Object.keys(dataSource);
  return (
    <List classes={{ root: classes.root }} className={className}>
      {dataKeys.length > 0 &&
        dataKeys.map(item => {
          return (
            <ListItem classes={{ root: classes.item_list }} key={item}>
              <ListItemText
                classes={{
                  root: classes.item_text,
                  primary: classes.primary,
                  secondary: classes.secondary
                }}
                primary={item}
                secondary={dataSource[item]}
              />
            </ListItem>
          );
        })}
    </List>
  );
});

ListItemPreview.defaultProps = {
  dataSource: {},
  className: '',
  flex: {
    key: 1,
    value: 2
  }
};

export default ListItemPreview;
