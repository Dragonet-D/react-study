import React, { useRef, useEffect, useState } from "react";

function HooksUseRef({ impressionTracker, propA, propB, propC }) {
  const test = useRef({
    params: { propA, propB, propC },
    tracker: impressionTracker
  });
  useEffect(() => {
    const { params, tracker } = test.current;
    tracker(params);
  }, []);
  return <Child propA={propA} propB={propB} propC={propC} />
}

function Child({ propA, propB, propC }) {
  return (
    <>
      <div>{propA}</div>
      <div>{propB}</div>
      <div>{propC}</div>
    </>
  )
}

const ChatAPI = {};

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}

export default HooksUseRef;