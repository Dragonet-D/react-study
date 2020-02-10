import React from 'react';
import DialogWindowBody from './DialogWindowBody';
import DialogWindowHeader from './DialogWindowHeader';
import DialogWindowContainer from './DialogWindowContainer';

export default function DialogWindow(props) {
  const { title, properties, operation, children } = props;
  return (
    <DialogWindowContainer properties={properties}>
      <DialogWindowHeader title={title} operation={operation} />
      <DialogWindowBody>{children}</DialogWindowBody>
    </DialogWindowContainer>
  );
}
