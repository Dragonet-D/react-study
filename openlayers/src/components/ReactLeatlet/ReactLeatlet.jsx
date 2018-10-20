import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
// import "leaflet/dist/leaflet.css";

export default class SimpleExample extends Component {
  state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    return (
      <Map center={position} zoom={this.state.zoom} style={{width: "100vw", height: "100vh"}}>
        <TileLayer
          attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div style={{color: "red"}}>A pretty CSS3 popup. <br /> Easily customizable</div>
          </Popup>
        </Marker>
      </Map>
    )
  }
}