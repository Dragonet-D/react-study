import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import LeafletMap from "./components/map/leaflet";

import "leaflet/dist/leaflet.css"

class App extends Component {


  render() {
    return (
      <Router>
        <Route path="/" component={LeafletMap}/>
      </Router>
    );
  }
}

export default App;
