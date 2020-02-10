import React, { memo } from 'react';
import _ from 'lodash';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ListItemPreview from './ListItemPreview';

const FormatJSONShow = memo(({ dataSource }) => {
  if (_.isEmpty(dataSource)) {
    return '';
  }
  const data = _.isObject(dataSource) ? dataSource : JSON.parse(dataSource);
  const keys = Object.keys(data);
  return (
    <>
      {keys.map(item => (
        <ExpansionPanel key={item}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{item}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography component="div" style={{ width: '100%' }}>
              {(() => {
                const tempData = data[item];
                if (!_.isObject(tempData)) {
                  return tempData;
                }
                return Object.keys(tempData).map(itemInner => {
                  if (!_.isObject(tempData[itemInner])) {
                    return (
                      <ListItemPreview
                        key={itemInner}
                        dataSource={{ [itemInner]: tempData[itemInner] }}
                      />
                    );
                  } else if (_.isObject(tempData[itemInner])) {
                    return (
                      <FormatJSONShow
                        key={itemInner}
                        dataSource={{ [itemInner]: tempData[itemInner] }}
                      />
                    );
                  } else {
                    return '';
                  }
                });
              })()}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  );
});

FormatJSONShow.defaultProps = {
  dataSource: ''
};

FormatJSONShow.propTypes = {
  dataSource: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};

export default FormatJSONShow;
