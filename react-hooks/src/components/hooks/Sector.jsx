import React, { useRef, useEffect } from "react";
import PropTypes from 'prop-types';

function Sector({radius, offsetAngle, angle, color}) {
  const ref = useRef(null);
  useEffect(() => {
    var ctx = ref.current.getContext("2d");
    ref.current.width = radius * 2;
    ref.current.height = radius * 2;

    ctx.strokeStyle = color;
    ctx.lineWidth = 0;

    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius,offsetAngle * Math.PI/180,(offsetAngle + angle)*Math.PI/180,false);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  }, []);
  return (
      <>
        <canvas
          ref={ref}
        />
      </>
  )
}

Sector.defaultProps = {
  radius: 100,
  offsetAngle: 0,
  angle: 30,
  color: 'gray'
};

Sector.propTypes = {
  radius: PropTypes.number,
  offsetAngle: PropTypes.number,
  angle: PropTypes.number,
  color: PropTypes.string
};

export default Sector;
