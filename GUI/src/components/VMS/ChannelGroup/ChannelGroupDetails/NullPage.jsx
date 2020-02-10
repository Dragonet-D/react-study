import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => {
  return {
    detailsContainer: {
      height: '100%',
      width: '80%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      color: theme.palette.text.primary,
      overflow: 'hidden',
      border: `1px solid ${theme.palette.primary.light}`,
      overflowY: 'auto'
    },
    boxTitle: { fontSize: '0.8vw' },
    contentTitle: {
      flex: '1',
      fontSize: '20px',
      textAlign: 'center'
    },
    detailsContent: {
      height: '100%',
      display: 'flex',
      alignItems: 'center'
    }
  };
});

function NullPage() {
  const classes = useStyles();

  return (
    <div className={classes.detailsContainer}>
      <div className={classes.detailsContent}>
        <Typography className={classes.contentTitle}>
          {I18n.t('uvms.channelGroup.detailsBox.nullPageTitle')}
        </Typography>
      </div>
    </div>
  );
}

export default NullPage;
