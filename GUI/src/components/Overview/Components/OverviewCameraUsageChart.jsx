import React from 'react';
import { I18n } from 'react-i18nify';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Shop from '@material-ui/icons/Shop';
import Duo from '@material-ui/icons/Duo';
import PieChart from '../Chart/PieChart';

function CameraUsage(props) {
  const { dataSource, title, isTitleNeeded, callShowDetails, caseOfSwitch, theme } = props;
  const { idleCamera, occupiedCamera, totalCamera, totalDevice } = dataSource;
  const targetOption = {
    legend: {
      data: ['Cameras With Streams Requested', 'Cameras With Streams Not Requested']
    },
    series: {
      data: [
        { value: occupiedCamera || 0, name: 'Cameras With Streams Requested' },
        { value: idleCamera || 0, name: 'Cameras With Streams Not Requested' }
      ],
      color: ['#61a0a8', '#749f83']
    }
  };
  return (
    <PieChart
      targetOption={targetOption}
      title={title}
      isTitleNeeded={isTitleNeeded}
      callShowDetails={callShowDetails}
      caseOfSwitch={caseOfSwitch}
    >
      <div
        style={{
          position: 'absolute',
          right: '10%',
          top: '30%'
        }}
      >
        <Card
          style={{
            backgroundColor: theme.palette.background.default
          }}
        >
          <CardHeader
            avatar={<Shop fontSize="large" color="primary" />}
            title={
              <Typography variant="subtitle2" color="primary" component="p">
                {I18n.t('overview.title.totalCamera')}
              </Typography>
            }
            subheader={
              <Typography variant="caption" color="primary" component="p">
                {totalCamera || 0}
              </Typography>
            }
          />
        </Card>
        <Card
          style={{
            backgroundColor: theme.palette.background.default,
            marginTop: 5
          }}
        >
          <CardHeader
            avatar={<Duo fontSize="large" color="primary" />}
            title={
              <Typography variant="subtitle2" color="primary" component="p">
                {I18n.t('overview.title.totalDevice')}
              </Typography>
            }
            subheader={
              <Typography variant="caption" color="primary" component="p">
                {totalDevice || 0}
              </Typography>
            }
          />
        </Card>
      </div>
    </PieChart>
  );
}

CameraUsage.defaultProps = {
  dataSource: {},
  callShowDetails: () => {},
  isTitleNeeded: true
};

CameraUsage.propTypes = {
  dataSource: PropTypes.object,
  callShowDetails: PropTypes.func,
  isTitleNeeded: PropTypes.bool
};

export default CameraUsage;
