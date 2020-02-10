import React from 'react';
import { FormatJSONShow, ListItemPreview } from 'components/common';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { I18n } from 'react-i18nify';
import _ from 'lodash';
import AlarmDialog from './AlarmDialog';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      width: 600,
      maxWidth: 600
    }
  };
});

function DataView(props) {
  const classes = useStyles();
  const { dataSource, title, ...rest } = props;
  const isOneLevelJSON = _.isString(dataSource)
    ? isOneLevel(dataSource)
    : isOneLevel(JSON.stringify(dataSource));
  function isOneLevel(data) {
    return data.indexOf('{', 1) === -1;
  }
  return (
    <AlarmDialog
      dialogWidth={classes.dialog}
      isActionNeeded={false}
      title={I18n.t(title)}
      open
      {...rest}
    >
      {isOneLevelJSON ? (
        <ListItemPreview flex={{ key: 1, value: 1 }} dataSource={dataSource} />
      ) : (
        <FormatJSONShow dataSource={dataSource} />
      )}
    </AlarmDialog>
  );
}

DataView.defaultProps = {
  title: 'alarm.config.eventDetails'
};

export default DataView;
