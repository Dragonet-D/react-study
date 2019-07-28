import React from "react";
import Map from "./LeafLet";
import "./style.scss";

function Leaflet() {
  return (
    <div className="leaflet_wrapper">
      <Map id="map1"/>
      <Map id="map2"/>
    </div>
  )
}

export default Leaflet;
