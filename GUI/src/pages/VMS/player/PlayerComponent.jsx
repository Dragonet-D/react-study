//  init pause play url
import React, { useCallback, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import moment from 'moment';
import { saveFile } from 'utils/fileTool';
import { DATE_FORMAT_DATE_T_TIME } from 'commons/constants/const';
import WSPlayer, { WebsocketTransport, RTSPClient } from 'libs/streamedian';

const useStyles = makeStyles(() => ({}));

function PlayerUltra(props) {
  const { url, scale, time, videoOpration, keyId, getFunction } = props;
  const classes = useStyles();
  const myCanvas = useRef(null);
  const videoWrapRef = useRef(null);
  const player = useRef(null);
  player.current = null;

  useEffect(() => {
    const snapshot = () => {
      const video = document.getElementById(`player${keyId}`);
      if (video) {
        const canvas = myCanvas.current;
        canvas.width = 869;
        canvas.height = 486;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 869, 486);
        const image = new Image();
        image.src = canvas.toDataURL('image/png');
        saveFile(image.src, `${moment().format(DATE_FORMAT_DATE_T_TIME)}playBack.png`);
      }
    };
    const videoTag = () => {
      return document.getElementById(`player${keyId}`);
    };
    const streamedianInstance = () => {
      if (player.current) {
        return player.current;
      } else {
        return null;
      }
    };
    if (getFunction) {
      getFunction({
        snapshot,
        videoTag,
        streamedianInstance
      });
    }

    return () => {
      cleanup();
    };
  }, [getFunction, keyId]);

  function cleanup() {
    if (player.current) {
      player.current.stop();
      player.current = null;
    }
  }

  const initPlayer = useCallback(
    time => {
      let videoNode = null;
      const fetchUrl = url.replace(/^streams:\/\//i, 'https://');
      fetch(fetchUrl);
      videoWrapRef.current.innerHTML =
        // eslint-disable-next-line
        "<video id='player" + keyId + "' class='centeredVideo' src='" + url + " autoPlay'></video>";
      videoNode = document.getElementById(`player${keyId}`);
      videoNode.src = url;
      videoNode.style.height = '100%';
      videoNode.style.width = '100%';
      const wsTransport = {
        constructor: WebsocketTransport,
        options: {
          socket: url.replace(/^streams:\/\//i, 'wss://')
        }
      };

      if (player.current) {
        player.current.stop();
        player.current = null;
      }

      player.current = new WSPlayer(
        videoNode,
        {
          modules: [
            {
              client: RTSPClient,
              transport: wsTransport,
              url: url.replace(/^streams:\/\//i, 'wss://')
            }
          ],
          offsetTime: time || 0
        },
        videoOpration.timeStampHandle,
        videoOpration.resetHandle
      );
      player.current.player.play();
    },
    [keyId, url, videoOpration.resetHandle, videoOpration.timeStampHandle]
  );

  useEffect(() => {
    initPlayer(time);
  }, [url, scale, initPlayer, time]);

  return (
    <div className={classes.videoT}>
      <div id={`videoWrap-${keyId}`} className={classes.wrapVideo} ref={videoWrapRef}>
        <canvas
          ref={myCanvas}
          style={{
            display: 'contents'
          }}
        />
      </div>
    </div>
  );
}

PlayerUltra.defaultProps = {
  time: 0,
  videoOpration: {
    timeStampHandle: () => {},
    resetHandle: () => {}
  }
};
PlayerUltra.propTypes = {
  url: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  keyId: PropTypes.string.isRequired,
  time: PropTypes.number,
  videoOpration: PropTypes.object
};

export default PlayerUltra;
