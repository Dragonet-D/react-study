/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useReducer } from 'react';
import _ from 'lodash';
import { I18n } from 'react-i18nify';
import { DATE_FORMAT_DD_MM_YYYY } from 'commons/constants/const';
import { TextField, SingleSelect, DatePicker, Button } from 'components/common';
import { VapReportToolbar } from 'components/UVAP';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  itemsStyle: {
    width: '300px'
  },
  itemsRow: {
    marginBottom: '15px'
  }
}));

function LicenseFilterToolbar(props) {
  const classes = useStyles();
  const { enginesList, handleGetLicenseList, params, buttonRender } = props;

  return (
    <VapReportToolbar buttonRender={buttonRender}>
      <Grid container spacing={4} alignItems="center" className={classes.itemsRow}>
        <Grid item className={classes.itemsStyle}>
          <SingleSelect
            label={I18n.t('vap.toolbar.license.app')}
            selectOptions={enginesList}
            onSelect={handleGetLicenseList}
            value={params.engineId || ''}
            fullWidth
            required
            keyValue
            dataIndex={{ name: 'name', value: 'id', key: 'id' }}
          />
        </Grid>
      </Grid>
    </VapReportToolbar>
  );
}

LicenseFilterToolbar.defaultProps = {
  enginesList: [],
  params: {},
  buttonRender: () => {}
};
LicenseFilterToolbar.propTypes = {
  enginesList: PropTypes.array,
  params: PropTypes.object,
  buttonRender: PropTypes.func
};

export default LicenseFilterToolbar;
