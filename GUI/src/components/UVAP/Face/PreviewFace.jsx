import React, { memo } from 'react';
import Dialog from '@material-ui/core/Dialog';
import makeStyles from '@material-ui/core/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => {
  return {
    name: {
      textAlign: 'center',
      width: '99.99%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '8px'
    },
    avatar: {
      width: '100%'
    }
  };
});

const PreviewFace = memo(props => {
  const classes = useStyles();
  const { image, name, open, onClose } = props;
  const previewClose = () => {
    onClose();
  };
  return (
    <Dialog open={open} onClose={previewClose}>
      <img alt="Avatar" className={classes.avatar} src={image} />
      {!!name && <div className={classes.name}>{name}</div>}
    </Dialog>
  );
});

PreviewFace.defaultProps = {
  image: '',
  name: '',
  open: false,
  onClose: () => {}
};

PreviewFace.propTypes = {
  image: PropTypes.string,
  open: PropTypes.bool,
  name: PropTypes.string,
  onClose: PropTypes.func
};

export default PreviewFace;
