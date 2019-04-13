import {useEffect, useRef} from "react";

function useRefEffect(fn, inputs) {
  const ref = useRef(null);
  useEffect(fn, inputs);
  return ref;
}

function createLeafletHook(fn, name) {
  const func = function (...args) {
    const ref = useRefEffect(function () {
      ref.current = fn(...args);
      return () => {
        ref.current.remove();
      };
    }, []);

    return ref;
  };

  Object.defineProperty(func, "name", {value: name});

  return func;
}

export default createLeafletHook;