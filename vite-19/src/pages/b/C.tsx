import {FC, memo} from 'react';

interface Props {
  onClick: (e: any) => void;
}


export default memo(({ onClick, a }) => {
  console.log('C rerender');
  return (
      <button onClick={onClick}>{a}</button>
  )
}, (prevProps, nextProps) => {
  console.log(prevProps, nextProps);
  if (prevProps.a !== nextProps.a) {
    return false;
  }

  return true
});