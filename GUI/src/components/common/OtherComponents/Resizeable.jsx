import React, { useCallback, useState } from 'react';
import { Resizable } from 're-resizable';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Collapse from '@material-ui/core/Collapse';
import Button from '@material-ui/core/Button';
import ReactDOM from 'react-dom';

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
    const btn = document.querySelector(`#color_picker_btn_${id}`);
    const client = btn.getBoundingClientRect();
    const right = window.innerWidth - client.left;
    const clientLeft = client.left + client.width;
    const left = right > colorPickerWidth ? clientLeft : clientLeft - colorPickerWidth;
    const bottom = window.innerHeight - client.bottom;
    const clientTop = client.top + client.height;
    const top = bottom > colorPickerHeight ? clientTop : clientTop - colorPickerHeight;
    setTop(top);
    setLeft(left);
    setOpen(true);
  }, [id]);
  return (
    <>
      <ClickAwayListener onClickAway={onClose}>
        <div>
          <Button onClick={onOpen} id={`color_picker_btn_${id}`}>
            test
          </Button>
          {ReactDOM.createPortal(
            <Collapse
              in={open}
              style={{
                position: 'fixed',
                zIndex: 1301,
                top,
                left
              }}
            >
              <Resizable
                style={{
                  border: '1px solid pink'
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
            </Collapse>,
            document.body
          )}
        </div>
      </ClickAwayListener>
    </>
  );
}

Resizeable.defaultProps = {
  id: Date.now()
};

export default Resizeable;
