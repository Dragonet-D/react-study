import React from 'react';
import { DatePicker } from 'components/common';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import { getEndTime } from 'utils/dateHelper';

function SearchDatePicker({ handleDateAccept, startTime, endTime, handleDataChange }) {
  const handleDateSubmit = time => value => {
    handleDateAccept(time, value);
  };

  return (
    <>
      <DatePicker
        label={I18n.t('vap.label.from')}
        maxDate={endTime}
        value={startTime}
        onAccept={handleDateSubmit('startTime')}
        handleChange={handleDataChange('startTime')}
      />
      <DatePicker
        label={I18n.t('vap.label.to')}
        minDate={startTime}
        value={endTime}
        maxDate={getEndTime()}
        onAccept={handleDateSubmit('endTime')}
        handleChange={handleDataChange('endTime')}
      />
    </>
  );
}

SearchDatePicker.defaultProps = {
  handleDateAccept: () => {}
};

SearchDatePicker.propTypes = {
  handleDateAccept: PropTypes.func
};

export default SearchDatePicker;
