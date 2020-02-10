import React, { Fragment, useContext } from 'react';
import Context from 'utils/createContext';

export default function MapVideoLiveViewWindowSet() {
  const {
    contextMenu: { liveViewWindowSet }
  } = useContext(Context);
  const { liveViewWindows } = liveViewWindowSet;
  if (liveViewWindows.length) {
    return <Fragment>{liveViewWindows.map(item => item.value)}</Fragment>;
  }
  return null;
}
