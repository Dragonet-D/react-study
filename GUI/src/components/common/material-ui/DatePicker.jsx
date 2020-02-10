import React, { useState, useEffect } from 'react';
import 'date-fns';
import DateMomentUtils from '@date-io/moment';
import {
  KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
  KeyboardTimePicker
} from '@material-ui/pickers';
import PropTypes from 'prop-types';
import { DATE_FORMAT_DATE_PICKER } from 'commons/constants/const';

function DatePicker(props) {
  const { label, format, onAccept, value, handleChange, type, ...rest } = props;
  const [selectedDate, setSelectedDate] = useState(value);

  useEffect(() => {
    setSelectedDate(value);
  }, [value]);

  function onChange(data) {
    setSelectedDate(data);
    handleChange(data);
  }
  if (type === 'date') {
    return (
      <MuiPickersUtilsProvider utils={DateMomentUtils}>
        <KeyboardDatePicker
          value={selectedDate}
          onChange={onChange}
          format={format}
          label={label}
          onAccept={onAccept}
          {...rest}
        />
      </MuiPickersUtilsProvider>
    );
  }
  if (type === 'time') {
    return (
      <MuiPickersUtilsProvider utils={DateMomentUtils}>
        <KeyboardTimePicker
          value={selectedDate}
          onChange={onChange}
          format={format}
          label={label}
          onAccept={onAccept}
          {...rest}
        />
      </MuiPickersUtilsProvider>
    );
  }
  return (
    <MuiPickersUtilsProvider utils={DateMomentUtils}>
      <KeyboardDateTimePicker
        value={selectedDate}
        onChange={onChange}
        format={format}
        label={label}
        onAccept={onAccept}
        {...rest}
      />
    </MuiPickersUtilsProvider>
  );
}

DatePicker.defaultProps = {
  format: DATE_FORMAT_DATE_PICKER,
  handleChange: () => {},
  onAccept: () => {},
  type: 'dateTime'
};

DatePicker.propTypes = {
  format: PropTypes.string,
  handleChange: PropTypes.func,
  onAccept: PropTypes.func,
  type: PropTypes.string
};

export default DatePicker;
