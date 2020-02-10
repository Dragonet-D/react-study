import React from 'react';
import { I18n } from 'react-i18nify';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

const styles = {
  buttonBottom: {
    marginBottom: '12px'
  }
};

class ButtonToolbar extends React.Component {
  render() {
    const { classes, handleSave, data } = this.props;
    return (
      <div>
        {
          <Grid container spacing={8} style={{ display: data.length > 0 ? 'block' : 'none' }}>
            <Grid item className={classes.buttonBottom}>
              <Button color="primary" onClick={handleSave}>
                {I18n.t('security.userGroup.button.save')}
              </Button>
            </Grid>
          </Grid>
        }
      </div>
    );
  }
}

ButtonToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonToolbar);
