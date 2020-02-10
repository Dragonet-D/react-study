import React, { useCallback } from 'react';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import { Button } from 'components/common';
import PropTypes from 'prop-types';
import { Translate } from 'react-i18nify';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    wrapper: {
      flex: '0 0 calc(50% - 16px)',
      margin: 8
    },
    title: {
      display: 'flex'
    },
    btn: {
      marginLeft: 'auto'
    }
  };
});

function ContainerChart(props) {
  const { children, title, onShowDetails, isTitleNeeded, caseOfSwitch } = props;
  const classes = useStyles(props);
  const handleShowDetails = useCallback(() => {
    onShowDetails(caseOfSwitch);
  }, [onShowDetails, caseOfSwitch]);
  return (
    <Card className={classes.wrapper}>
      <CardContent style={{ position: 'relative' }}>
        {isTitleNeeded && (
          <Typography component="h5" variant="h5" className={classes.title}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            <Button
              size="small"
              color="primary"
              className={classes.btn}
              onClick={handleShowDetails}
            >
              <Translate value="global.button.showDetails" />
            </Button>
          </Typography>
        )}
        {children}
      </CardContent>
    </Card>
  );
}

ContainerChart.defaultProps = {
  title: '',
  // onShowDetails: () => {},
  isTitleNeeded: true
};

ContainerChart.propTypes = {
  title: PropTypes.string,
  // onShowDetails: PropTypes.func,
  isTitleNeeded: PropTypes.bool
};

export default ContainerChart;
