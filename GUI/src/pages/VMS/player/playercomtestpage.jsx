import React, { useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core';
import moment from 'moment';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { TextField, Button } from 'components/common';
import { DATE_FORMAT_HH_MM_SS } from 'commons/constants/const';
import Player from './PlayerComponent';

const useStyles = makeStyles(theme => {
  return {
    paperInput: {
      backgroundColor: theme.palette.background.default,
      margin: theme.spacing(4),
      padding: theme.spacing(2)
    },
    paperVideo: {
      backgroundColor: theme.palette.background.default,
      height: '360px',
      width: '640px'
    }
  };
});

export default function PlayerTest() {
  const classes = useStyles();
  const ts = useRef();
  const getSnapshot = useRef();
  const getVideoTag = useRef();
  const getStreamedianInstance = useRef();
  const [playSet, setplaySet] = useState([]);
  const [tsPresent, settsPresent] = useState(0);
  const [formValue, setformValue] = React.useState({
    url: undefined,
    scale: 1,
    key: 'abc',
    time: undefined
  });
  ts.current = 0;

  function onCreate() {
    settsPresent(0);
    const player = createPlayer(
      formValue.url,
      formValue.scale,
      formValue.key,
      formValue.time,
      {
        timeStampHandle,
        resetHandle
      },
      getFunction
    );

    setplaySet([player]);
  }

  function onSnapshot() {
    getSnapshot.current();
    console.log(getVideoTag.current(), getStreamedianInstance.current());
  }

  function getFunction(e) {
    const { snapshot, videoTag, streamedianInstance } = e;
    getSnapshot.current = snapshot;
    getVideoTag.current = videoTag;
    getStreamedianInstance.current = streamedianInstance;
  }

  function timeStampHandle(e) {
    if (e - ts.current > 1000) {
      settsPresent(e);
      ts.current = e;
    }
  }

  function resetHandle() {
    // initPlayer(time)
  }

  function createPlayer(url, _scale, keyId, _time, videoOpration, getFunction) {
    const scale = parseInt(_scale, 10);
    const time = parseInt(_time, 10);
    if (url && scale && keyId) {
      return (
        <Player
          url={url}
          scale={scale}
          keyId={keyId}
          time={time}
          videoOpration={videoOpration}
          getFunction={getFunction}
        />
      );
    }
  }

  const handleChange = name => event => {
    setformValue({ ...formValue, [name]: event.target.value });
  };

  return (
    <>
      <Paper className={classes.paperInput}>
        <TextField
          fullWidth
          label="url"
          onChange={handleChange('url')}
          value={formValue.url}
          margin="dense"
        />
        <TextField
          fullWidth
          label="scale"
          onChange={handleChange('scale')}
          value={formValue.scale}
          margin="dense"
        />
        <TextField
          fullWidth
          label="key"
          onChange={handleChange('key')}
          value={formValue.key}
          margin="dense"
        />
        <TextField
          fullWidth
          label="time"
          onChange={handleChange('time')}
          value={formValue.time}
          margin="dense"
        />
        <Button onClick={onCreate} color="primary">
          Create
        </Button>
        <Button
          onClick={() => {
            onSnapshot();
          }}
          color="primary"
        >
          Snapshot
        </Button>
      </Paper>

      <Container
        maxWidth="lg"
        style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
      >
        <Typography variant="h6" component="h6">
          {moment(tsPresent).format(DATE_FORMAT_HH_MM_SS)}
        </Typography>
        <Paper className={classes.paperVideo}>
          {playSet}
          {/* player  */}
        </Paper>
      </Container>
    </>
  );
}
