import React, { useCallback, useState } from "react";
import { Resizable } from "re-resizable";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Button from "@material-ui/core/Button";

const colorPickerWidth = 200;
const colorPickerHeight = 200;
function Resizeable(props) {
  const { id } = props;
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    const btn = document.querySelector(`#color_picker_btn_${id}`),
        client = btn.getBoundingClientRect(),
        right = window.innerWidth - client.left,
        clientLeft = client.left + client.width,
        left = right > colorPickerWidth ? clientLeft : clientLeft - colorPickerWidth,
        bottom = window.innerHeight - client.bottom,
        clientTop = client.top + client.height,
        top = bottom > colorPickerHeight ? clientTop : clientTop - colorPickerHeight;
    setTop(top);
    setLeft(left);
    setOpen(true);
  }, []);
  return (
      <>
        <Button onClick={onOpen} id={`color_picker_btn_${id}`}>test</Button>
        <ClickAwayListener onClickAway={onClose}>
          <Collapse
            in={open}
            style={{
              position: "fixed",
              zIndex: 1301,
              top,
              left
            }}
          >
            <Resizable
              style={{
                border: '1px solid pink',
              }}
              defaultSize={{
                width: 200,
                height: 200
              }}
              minWidth={200}
              minHeight={200}
            >
              Sample with size
            </Resizable>
          </Collapse>
        </ClickAwayListener>
      </>
  )
}

Resizeable.defaultProps = {
  id: Date.now()
};

export default Resizeable;
