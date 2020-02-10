import React, { Fragment, useState } from 'react';
import { DatePicker } from 'components/common';
import { getStartTime, getEndTime } from 'utils/dateHelper';
import { DATE_FORMAT } from 'commons/constants/const';

function AlarmDatePicker({ onAccept }) {
  const [startTime, setStartTime] = useState(getStartTime());
  const [endTime, setEndTime] = useState(getEndTime());

  const handleDateSubmit = time => value => {
    onAccept(time, value);
    if (time === 'startTime') {
      setStartTime(value);
    } else if (time === 'endTime') {
      setEndTime(value);
    }
  };

  const handleDataChange = time => value => {
    if (time === 'startTime') {
      setStartTime(value);
    } else if (time === 'endTime') {
      setEndTime(value);
    }
  };
  return (
    <Fragment>
      <DatePicker
        label="From"
        format={DATE_FORMAT}
        maxDate={endTime}
        value={startTime}
        onAccept={handleDateSubmit('startTime')}
        handleChange={handleDataChange('startTime')}
      />
      <DatePicker
        label="To"
        format={DATE_FORMAT}
        minDate={startTime}
        value={endTime}
        onAccept={handleDateSubmit('endTime')}
        handleChange={handleDataChange('endTime')}
      />
    </Fragment>
  );
}

export default AlarmDatePicker;
