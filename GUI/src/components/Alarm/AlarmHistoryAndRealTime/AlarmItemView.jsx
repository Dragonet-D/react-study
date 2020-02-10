import React, { memo } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { I18n } from 'react-i18nify';
import { ListItemPreview, Button } from '../../common';
import AlarmDialog from '../AlarmDialog';

const useStyles = makeStyles(() => {
  return {
    dialog: {
      maxWidth: 500
    }
  };
});

const AlarmItemView = memo(props => {
  const classes = useStyles();
  const { dataSource, invokeDownload, ...rest } = props;
  return (
    <AlarmDialog
      action={
        <Button disabled={!dataSource['File Name']} onClick={() => invokeDownload()}>
          {I18n.t('alarm.history.download')}
        </Button>
      }
      isActionNeeded={false}
      dialogWidth={classes.dialog}
      {...rest}
    >
      <ListItemPreview dataSource={dataSource} />
    </AlarmDialog>
  );
});

AlarmItemView.defaultProps = {
  invokeDownload: () => {}
};

AlarmItemView.propTypes = {
  dataSource: PropTypes.object.isRequired,
  invokeDownload: PropTypes.func
};

export default AlarmItemView;
