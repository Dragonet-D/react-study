import React, { memo } from 'react';
import { I18n } from 'react-i18nify';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import C from 'classnames';

const useStyles = makeStyles(theme => {
  return {
    no_data: {
      padding: theme.spacing(1),
      textAlign: 'center'
    }
  };
});

const NoData = memo(({ className, pureText }) => {
  const classes = useStyles();
  return pureText ? (
    I18n.t('global.remindInformation.noData')
  ) : (
    <Typography className={C(classes.no_data, className)} component="div" color="textPrimary">
      {I18n.t('global.remindInformation.noData')}
    </Typography>
  );
});

NoData.defaultProps = {
  className: '',
  pureText: false
};

NoData.propTypes = {
  className: PropTypes.string,
  pureText: PropTypes.bool
};

export default NoData;
