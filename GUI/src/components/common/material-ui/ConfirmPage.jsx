/*
 * @Description: Confirmpage component need five properties: message, messageTitle, isConfirmPageOpen, hanldeConfirmMessage, handleConfirmPageClose
 * @Author: Kevin
 * @Email: baishi.wang@ncs.com.sg
 * @LastEditors: Kevin
 * @Date: 2019-03-05 11:31:19
 * @LastEditTime: 2019-08-23 01:13:48
 * @Example:
 * <ConfirmPage
 *  message={string}   //confirm page message
 *  messageTitle={string} // confirm page title
 *  isConfirmPageOpen={Boolean} //if true, confirm page will open,
 *  hanldeConfirmMessage={function} //  click confirm to submit you data
 *  handleConfirmPageClose={function} //click cancle button to close the page, you must set isConfirmPageOpen false
 * />
 */

import React from 'react';
import { Dialog, DialogContent, DialogActions, DialogContentText } from '@material-ui/core';
import DialogTitle from './DialogTitle';
import Button from './Button';

export default function(props) {
  const {
    message,
    messageTitle,
    isConfirmPageOpen,
    hanldeConfirmMessage,
    handleConfirmPageClose
  } = props;
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isConfirmPageOpen}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{messageTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => hanldeConfirmMessage()} color="primary">
          Confirm
        </Button>
        <Button onClick={handleConfirmPageClose} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
