import React from 'react';
import { Paper, Button, makeStyles, Typography } from '@material-ui/core';
import { router } from 'dva';
import PropTyps from 'prop-types';
import userLoginInfo from 'utils/userHelper';
import bg403 from './images/403.svg';
import bg404 from './images/404.svg';
import bg500 from './images/500.svg';

const { Link } = router;

const useStyles = makeStyles(theme => {
  return {
    wrapper: {
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    not_found: {
      fontSize: theme.typography.h1.fontSize
    },
    remind: {
      fontSize: theme.typography.h5.fontSize,
      paddingBottom: '20px'
    },
    img_container: {
      marginTop: '-200px',
      width: '100%',
      maxWidth: '430px',
      height: '360px'
    },
    img: {
      width: '100%',
      height: '100%'
    },
    remind_container: {
      marginTop: '-200px',
      marginLeft: '100px'
    }
  };
});
const bgs = {
  403: bg403,
  404: bg404,
  500: bg500
};

function Exception(props) {
  const { title, remind, type, backText } = props;
  const classes = useStyles();
  const isLogged = !!userLoginInfo.get();
  return (
    <Paper className={classes.wrapper}>
      <section className={classes.img_container}>
        <img className={classes.img} src={bgs[type]} alt="" />
      </section>
      <section className={classes.remind_container}>
        <h2 className={classes.not_found}>{title}</h2>
        <Typography className={classes.remind}>{remind}</Typography>
        <Link to={isLogged ? '/' : '/user'}>
          <Button variant="contained" color="secondary" href="">
            {backText}
          </Button>
        </Link>
      </section>
    </Paper>
  );
}

Exception.defaultProps = {
  title: '404',
  remind: 'Sorry, the page you visited does not exist',
  type: 404,
  backText: 'Back to home'
};
Exception.propTypes = {
  title: PropTyps.any,
  remind: PropTyps.string,
  type: PropTyps.number,
  backText: PropTyps.string
};

export default Exception;
