import React from 'react';
import C from 'classnames';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import { Upload } from 'components/common';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { getBase64 } from 'utils/utils';

const useStyles = makeStyles(theme => {
  return {
    upload_btn: {
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      display: 'block',
      padding: `4px 8px`
    },
    media: {
      height: '100%'
    }
  };
});

function UploadSingleImage({ getImage, className, color, variant }) {
  const classes = useStyles();

  async function handleUploadChange(e) {
    const { name, type } = e.file;
    if (!type.includes('image')) {
      return;
    }
    const image = await getBase64(e.file);
    getImage(image, name);
  }

  return (
    <>
      <IconButton color={color} variant={variant} className={C(className, classes.upload_wrapper)}>
        <Upload
          name="picture"
          showUploadList={false}
          action=""
          multiple={false}
          beforeUpload={() => false}
          onChange={handleUploadChange}
        >
          <AddIcon />
        </Upload>
      </IconButton>
    </>
  );
}

UploadSingleImage.defaultProps = {
  getImage: () => {},
  className: '',
  color: 'secondary',
  variant: 'text'
};

UploadSingleImage.propTypes = {
  getImage: PropTypes.func,
  className: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string
};

export default UploadSingleImage;
