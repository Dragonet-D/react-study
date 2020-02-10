/* eslint-disable no-unused-vars */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { TextField } from 'components/common';
import { MultipleLibraryParam, LibraryParam } from 'components/UVAP';

const useStyles = makeStyles(theme => {
  return {
    listContainer: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      padding: '0px',
      marginBottom: theme.spacing(2),
      color: theme.palette.text.primary,
      border: `1px solid ${theme.palette.primary.light}`,
      paddingBottom: theme.spacing(1)
    },
    detailsBox: {
      height: '93%',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      position: 'relative'
    },
    toolbar_button: {
      marginLeft: 'auto',
      marginRight: theme.spacing(2)
    },
    inputBox: {
      display: 'flex',
      alignItems: 'center'
    },
    textField_details: {
      flex: 1,
      marginBottom: theme.spacing(2)
    }
  };
});

function JobVaInstanceConfigBox(props) {
  const classes = useStyles();
  const {
    availableOptions,
    setParameters,
    parameters,
    frsGroups,
    getFrsGroups,
    currentAppInfo
  } = props;
  function handleSetParameters(params, option, val) {
    let hasParam = '';
    _.forEach(params, param => {
      if (param.name === option.name) {
        hasParam = true;
      }
      return param.name !== option.name;
    });
    if (hasParam) {
      _.forEach(params, param => {
        if (param.name === option.name) {
          param.value = val;
        }
      });
    } else {
      params.push({ keep: true, name: option.name, value: val, scope: option.scope });
    }
    return _.cloneDeep(params);
  }
  function handleGetParameterValue(name) {
    const param = parameters.filter(param => param.name === name);
    return param[0] ? param[0].value : '';
  }

  const handleSetParams = React.useCallback(
    (parameters, option, val) => {
      setParameters(handleSetParameters(parameters, option, val));
    },
    [setParameters]
  );

  return (
    <div className={classes.listContainer}>
      <div style={{ height: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: '15px'
          }}
        >
          <Typography component="h5">{I18n.t('vap.dialog.instance.common.configTitle')}</Typography>
          {/* <IconButton
            className={classes.toolbar_button}
            onClick={() => console.log(I18n.t('vap.dialog.instance.common.configTitle'))}
          >
            <LibraryAddIcon />
          </IconButton> */}
        </div>

        <div className={classes.detailsBox}>
          {availableOptions.map(option => {
            const paramValue = handleGetParameterValue(option.name);
            if (option.name === 'libraries') {
              return (
                <MultipleLibraryParam
                  frsGroups={frsGroups}
                  getFrsGroups={getFrsGroups}
                  handleSetData={val => handleSetParams(parameters, option, val)}
                  value={paramValue || '[]'}
                  appId={currentAppInfo.appId}
                  required={option.required}
                />
              );
            } else if (option.name === 'library') {
              return (
                <LibraryParam
                  frsGroups={frsGroups}
                  getFrsGroups={getFrsGroups}
                  handleSetData={val => handleSetParams(parameters, option, val)}
                  value={paramValue || ''}
                  appId={currentAppInfo.appId}
                  required={option.required}
                />
              );
            } else {
              return (
                <div className={classes.inputBox}>
                  <TextField
                    key={option.name}
                    label={option.name}
                    fullWidth
                    required={option.required}
                    placeholder={option.description}
                    value={paramValue || ''}
                    onChange={e => {
                      handleSetParams(parameters, option, e.target.value);
                    }}
                    className={classes.textField_details}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

JobVaInstanceConfigBox.defaultProps = {
  availableOptions: [],
  setParameters: () => {},
  parameters: [],
  frsGroups: [],
  getFrsGroups: () => {},
  currentAppInfo: {}
};

JobVaInstanceConfigBox.propTypes = {
  availableOptions: PropTypes.array,
  setParameters: PropTypes.func,
  parameters: PropTypes.array,
  frsGroups: PropTypes.array,
  getFrsGroups: PropTypes.func,
  currentAppInfo: PropTypes.object
};

export default JobVaInstanceConfigBox;
