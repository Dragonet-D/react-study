import React, {Component} from 'react';
import L from "leaflet";
import "leaflet/dist/leaflet.css"

class App extends Component {
  constructor(props) {
    super(props);
    this.map = {}
  }

  componentDidMount() {
    this.map = L.map("map");
    this.map.setView(new L.LatLng(1.3697024, 103.8852096), 12);
    const token = 'pk.eyJ1IjoiZG9tb3JpdHoiLCJhIjoiY2o0OHZuY3MwMGo1cTMybGM4MTFrM2dxbCJ9.yCQe43DMRqobazKewlhi9w';
    const mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/{z}/{x}/{y}@2x?access_token=' + token;
    L.tileLayer(mapboxUrl).addTo(this.map);
  }

  render() {
    return (
      <div id="map" style={{width: "100%", height: "700px"}}/>
    );
  }
}

export default App;
