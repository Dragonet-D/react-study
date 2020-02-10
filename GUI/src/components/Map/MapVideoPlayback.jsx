/*
 * @Description: Play back
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-04-08 00:21:58
 * @LastEditTime: 2019-08-18 13:28:58
 */

/* jshint esversion: 6 */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { view as ResizableWindow } from 'modules/others/dragAndResizeWindow';
import PlayBackPlayer from 'commons/components/player/PlayBackSimplePlayer';

import 'react-html5video/dist/styles.css';

const ChannelPlayBack = ({ channel, handleCloseWindowClickEvent }) => {
  const channelItem = {
    deviceId: channel.$sourceId.deviceId,
    channelId: channel.$sourceId.channelId
  };
  const playStart = moment(channel.time)
    .format('YYYY-MM-DD hh:mm:ss')
    .split(' ')
    .join('T');
  const $playEnd = new Date(channel.time).getTime() + 5 * 1000;

  const tempTiem = moment($playEnd).format('YYYY-MM-DD hh:mm:ss');
  const playEnd = tempTiem.split(' ').join('T');
  return (
    <ResizableWindow
      height="50%"
      width="40%"
      top="15px"
      left="25%"
      title={(channel.$data.deviceInfo && `${channel.$data.deviceInfo.name}----${playStart}`) || ''}
      hideIconClose
      handleCloseWindowClick={() => handleCloseWindowClickEvent(channel.time)}
    >
      <div type="tool-bar" />

      <div type="window-body">
        <PlayBackPlayer startTime={playStart} endTime={playEnd} itemData={channelItem} />
      </div>
    </ResizableWindow>
  );
};

ChannelPlayBack.propTypes = {
  channel: PropTypes.object.isRequired,
  handleCloseWindowClickEvent: PropTypes.func.isRequired
};

export default ChannelPlayBack;
