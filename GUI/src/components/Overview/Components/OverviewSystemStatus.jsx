import React from 'react';
import { I18n } from 'react-i18nify';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { DATE_FORMAT } from 'commons/constants/const';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import ContainerChart from '../ContainerChart';

const useStyles = makeStyles(() => ({
  dialog: {
    width: '960px',
    maxWidth: '960px',
    maxHeight: 'calc(100% - 300px)'
  },
  alarm_name: {
    margin: 0
  },
  vms_search: {
    flex: 1
  }
}));
function OverviewdataSource(props) {
  const { dataSource } = props;
  const classes = useStyles();

  return (
    <>
      <ContainerChart title={I18n.t('overview.title.dataSource')} isTitleNeeded={false}>
        <Grid container justify="flex-start" spacing={4}>
          <Grid item>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h5" style={{ float: 'left' }}>
                  {I18n.t('overview.title.ummi')}
                  <Switch
                    className={classes.switch}
                    checked
                    disabled
                    classes={{
                      disabled:
                        dataSource.IVH === 'A' ? classes.colorChecked : classes.colordisconect,
                      bar:
                        dataSource.IVH === 'A' ? classes.barColorChecked : classes.barColordisconect
                    }}
                  />
                </Typography>
                <Typography component="p" style={{ fontWeight: 'bold' }}>
                  {`${I18n.t('overview.title.lastRunTime')} : `}
                </Typography>
                <Typography component="p">
                  {moment(dataSource.lastRunTime).format(DATE_FORMAT)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item>
            <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h5" style={{ float: 'left' }}>
                  {I18n.t('overview.title.uvms')}
                  <Switch
                    className={classes.switch}
                    checked
                    disabled
                    classes={{
                      disabled:
                        dataSource.VMS === 'A' ? classes.colorChecked : classes.colordisconect,
                      bar:
                        dataSource.VMS === 'A' ? classes.barColorChecked : classes.barColordisconect
                    }}
                  />
                </Typography>
                <Typography component="p" style={{ fontWeight: 'bold' }}>
                  {`${I18n.t('overview.title.lastRunTime')} : `}
                </Typography>
                {moment(dataSource.lastRunTime).format(DATE_FORMAT)}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </ContainerChart>
    </>
  );
}

export default OverviewdataSource;
