import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Toolbar, InputAdornment } from '@material-ui/core';
import { Input } from 'components/common';
import { ButtonSmall as Button } from 'components/common/IVHTable/CellWithTooltip';
import { Search } from '@material-ui/icons';
import classNames from 'classnames';

const styles = {
  toolbarPadding: {
    padding: '0px'
  },
  toolbarFlex: {
    flex: '0 0 auto'
  },
  inputWidth: {
    width: '200px'
  }
};

class ListToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: ''
    };
  }

  handleSearchChange = event => {
    this.setState({
      key: event.target.value
    });
  };

  render() {
    const { classes, handleIsAdd } = this.props;
    const { key } = this.state;
    return (
      <Toolbar className={classNames(classes.toolbarPadding)}>
        <div className={classNames(classes.toolbarFlex)}>
          {
            <Grid container spacing={8}>
              <Grid item className="lonIpt">
                <Input
                  className={classes.inputWidth}
                  onChange={event => this.handleSearchChange(event)}
                  id="adornment-amount"
                  placeholder="Group Name"
                  value={key}
                  startAdornment={
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  }
                />
              </Grid>

              <Grid item>
                <Button size="small" color="default" variant="contained" onClick={handleIsAdd}>
                  Add
                </Button>
              </Grid>
            </Grid>
          }
        </div>
      </Toolbar>
    );
  }
}

ListToolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ListToolbar);
