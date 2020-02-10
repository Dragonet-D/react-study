import React, { memo, useState, useCallback, useEffect } from 'react';
import { Dialog, SingleSelect } from 'components/common';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { I18n } from 'react-i18nify';
import { connect } from 'dva';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';
import userHelper from 'utils/userHelper';

const useStyles = makeStyles(() => {
  return {
    dialog_size: {
      width: '500px'
    }
  };
});

const Settings = memo(props => {
  const classes = useStyles();
  const { messageCenter, dispatch, global, ...reset } = props;
  const { wsMessageCenter } = messageCenter;
  const { theme } = global;
  const [wsMuteChecked, setWsMuteChecked] = useState(wsMessageCenter.wsMute);

  useEffect(() => {
    setWsMuteChecked(wsMessageCenter.wsMute);
  }, [wsMessageCenter]);

  const handleWsMute = e => {
    const { checked } = e.target;
    dispatch({
      type: `messageCenter/muteWsMessage`,
      payload: checked
    });
  };

  const invokeThemeChange = useCallback(
    e => {
      dispatch({
        type: 'global/changeTheme',
        payload: e
      });
    },
    [dispatch]
  );

  const handleSave = () => {
    userHelper.settingSet(JSON.stringify({ wsMute: wsMuteChecked, theme }));
    reset.handleClose();
  };
  return (
    <Dialog dialogSize={classes.dialog_size} handleSave={handleSave} {...reset}>
      <FormControlLabel
        control={<Checkbox onChange={handleWsMute} checked={wsMuteChecked} />}
        label={I18n.t('global.messageCenter.muteNotification')}
      />
      <SingleSelect
        label={I18n.t('global.remindInformation.changeTheme')}
        value={theme}
        selectOptions={[
          'Violet.DARK_THEME',
          'Violet.LIGHT_THEME',
          'Cyan.DARK_THEME',
          'Cyan.LIGHT_THEME',
          'Red.DARK_THEME',
          'Red.LIGHT_THEME',
          'Blue.DARK_THEME',
          'Blue.LIGHT_THEME'
        ]}
        onSelect={invokeThemeChange}
      />
    </Dialog>
  );
});

Settings.defaultProps = {
  handleClose: () => {}
};

Settings.propTypes = {
  handleClose: PropTypes.func
};

export default connect(({ messageCenter, global }) => ({ messageCenter, global }))(Settings);
