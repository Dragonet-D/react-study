import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

function Sector(props) {
  const { radius, offsetAngle, angle, color } = props;
  const ref = useRef(null);
  useEffect(() => {
    drawSector(radius, offsetAngle, angle, color);
  }, [angle, color, offsetAngle, radius]);

  useEffect(() => {
    drawSector(radius, offsetAngle, angle, color);
  }, [angle, color, offsetAngle, props, radius]);

  function drawSector(radius, _offsetAngle, angle, color) {
    const offsetAng = _offsetAngle + 90 - angle / 2;
    const ctx = ref.current.getContext('2d');
    ref.current.width = radius * 2;
    ref.current.height = radius * 2;

    // ==========================================================

    // ==========================================================

    ctx.strokeStyle = color;
    ctx.lineWidth = 0;
    ctx.moveTo(radius, radius);
    ctx.arc(
      radius, // x
      radius, // y
      radius, // radius
      -offsetAng * (Math.PI / 180), // // end angle
      -(offsetAng + angle) * (Math.PI / 180), // start angle
      // (offsetAngle + angle / 2 + 90)
      true
    );
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  }
  return <canvas ref={ref} />;
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
