import React, { memo, useCallback, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { Translate } from 'react-i18nify';
import Slider from '@material-ui/core/Slider';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import C from 'classnames';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      paddingBottom: theme.spacing(2),
      paddingLeft: theme.spacing(1),
      width: '100%'
    },
    slider_wrapper: {
      display: 'flex'
    },
    slider_label: {
      color: theme.palette.text.secondary,
      marginLeft: `-${theme.spacing(1)}px`
    },
    slider_value: {
      maxWidth: theme.spacing(5),
      width: theme.spacing(5),
      textAlign: 'center',
      lineHeight: `${theme.spacing(3)}px`,
      height: theme.spacing(3),
      paddingLeft: theme.spacing(1)
    },
    slider: {
      marginBottom: `-${theme.spacing(1)}px`,
      flex: 1
    }
  };
});

const ConfidenceScore = memo(props => {
  const classes = useStyles();
  const { label, className, defaultValue, getValue } = props;
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  const handleSliderChange = useCallback(
    (e, value) => {
      setValue(value);
      getValue(value);
    },
    [getValue]
  );

  const marks = [
    {
      value: 0,
      label: '0'
    },
    {
      value: 0.1,
      label: '0.1'
    },
    {
      value: 0.2,
      label: '0.2'
    },
    {
      value: 0.3,
      label: '0.3'
    },
    {
      value: 0.4,
      label: '0.4'
    },
    {
      value: 0.5,
      label: '0.5'
    },
    {
      value: 0.6,
      label: '0.6'
    },
    {
      value: 0.7,
      label: '0.7'
    },
    {
      value: 0.8,
      label: '0.8'
    },
    {
      value: 0.9,
      label: '0.9'
    },
    {
      value: 1,
      label: '1'
    }
  ];

  return (
    <div className={C(className, classes.wrapper)}>
      <Typography className={classes.slider_label} variant="body2">
        <Translate value={label} />
      </Typography>
      <div className={classes.slider_wrapper}>
        <Slider
          aria-labelledby="discrete-slider-always"
          step={0.1}
          value={_.toNumber(value)}
          max={1}
          marks={marks}
          onChange={handleSliderChange}
          classes={{
            root: classes.slider
          }}
        />
        <Typography component="div" variant="h6" className={classes.slider_value}>
          {_.toNumber(value)}
        </Typography>
      </div>
    </div>
  );
});

ConfidenceScore.defaultProps = {
  label: 'vap.face.faceEnrollment.pictureRecognitionThreshold',
  className: '',
  defaultValue: 0.5,
  getValue: () => {}
};

ConfidenceScore.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  defaultValue: PropTypes.any,
  getValue: PropTypes.func
};

export default ConfidenceScore;
