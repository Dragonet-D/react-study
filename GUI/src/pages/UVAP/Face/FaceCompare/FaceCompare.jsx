import React, { useEffect } from 'react';
import { connect } from 'dva';
import {
  CompareSearchControl,
  CompareResult,
  getRequestImageType
} from 'components/UVAP/Face/index';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  return {
    wrapper: {}
  };
});

function FaceCompare(props) {
  const moduleName = 'faceCompare';
  const classes = useStyles();
  const { faceCompare, dispatch, global, loading } = props;
  const { userId } = global;
  const { allTheAppsData, compareResultData } = faceCompare;

  useEffect(() => {
    dispatch({
      type: `${moduleName}/getAllApps`,
      payload: userId
    });
  }, [dispatch, userId]);

  useEffect(() => {
    return () => {
      dispatch({
        type: `${moduleName}/clearFaceCompareInformation`
      });
    };
  }, [dispatch]);

  function getCompareData(e) {
    dispatch({
      type: `${moduleName}/vapFrsFaceCompare`,
      payload: {
        appId: e.vaEngine,
        imageOne: getRequestImageType(e.one),
        imageOther: getRequestImageType(e.two)
      }
    });
  }
  return (
    <div className={classes.wrapper}>
      <CompareSearchControl allTheAppsData={allTheAppsData} getCompareData={getCompareData} />
      <CompareResult compareResultData={compareResultData} loading={loading} />
    </div>
  );
}

export default connect(({ faceCompare, global, loading }) => ({ faceCompare, global, loading }))(
  FaceCompare
);
