import React, { useEffect } from 'react';
import store from '@/index';

export default function LoginADFSTransfer() {
  useEffect(() => {
    const url = window.location.href;
    const param = url.split('?')[1];
    const adfsUserId = param.split('=')[1];
    store.dispatch({
      type: 'user/loginADFS',
      payload: {
        id: adfsUserId
      }
    });
  }, []);

  return <h4>Please wait a moment, Skipping.....</h4>;
}
