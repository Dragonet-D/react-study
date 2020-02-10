import React, { useCallback, useState } from 'react';
import C from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import { PreviewImage } from 'components/common';
import styles from './FaceShow.module.less';

const useStyles = makeStyles(theme => {
  return {
    handle: {
      color: theme.palette.text.secondary
    },
    media: {
      width: '100%',
      height: '104px'
    },
    name: {
      textAlign: 'center',
      width: '99.99%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '4px'
    }
  };
});

function FaceShow(props) {
  const { image, name, index, onDelete, isDeleteNeed, className, isNameNeed } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handleDelete = useCallback(
    index => () => {
      onDelete(index);
    },
    [onDelete]
  );

  const handlePreview = useCallback(
    image => () => {
      setPreviewImage(image);
      setOpen(true);
    },
    []
  );

  const previewClose = useCallback(() => {
    setOpen(false);
  }, []);
  return (
    <>
      <Card className={C(styles.wrapper, className)}>
        <div className={styles.card}>
          {image && (
            <div className={styles.mask}>
              <IconButton size="small" onClick={handlePreview(image)}>
                <VisibilityIcon className={classes.handle} />
              </IconButton>
              {isDeleteNeed && (
                <IconButton size="small" onClick={handleDelete(index)}>
                  <DeleteIcon className={classes.handle} />
                </IconButton>
              )}
            </div>
          )}
          {image ? (
            <CardMedia classes={{ root: classes.media }} image={image} />
          ) : (
            <div className={classes.media} />
          )}
          {isNameNeed && <div className={classes.name}>{name}</div>}
        </div>
      </Card>
      <PreviewImage open={open} onClose={previewClose} name={name} image={previewImage} />
    </>
  );
}

FaceShow.defaultProps = {
  index: -1,
  onDelete: () => {},
  name: '',
  image: '',
  isDeleteNeed: false,
  className: '',
  isNameNeed: false
};

FaceShow.propTypes = {
  index: PropTypes.any,
  onDelete: PropTypes.func,
  name: PropTypes.string,
  image: PropTypes.string,
  isDeleteNeed: PropTypes.bool,
  className: PropTypes.string,
  isNameNeed: PropTypes.bool
};

export default FaceShow;
