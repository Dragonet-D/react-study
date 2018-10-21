import React, {
  Component
} from 'react';
import Map from "./components/map/Map";
import Leaflet from "./components/leaflet/Leaflet";
import LeafletLabel from "./components/leaflet/LeafletLabel";
import LeafletDraw from "./components/leaflet/LeaftletDraw";
import LeafletCoordinate from "./components/leaflet/LeafletCoordinate";

import SimpleExample from "./components/ReactLeatlet/ReactLeatlet"
class App extends Component {
  state = {
    data: [{
      id: "id1",
      center: [103.74943256378174, 1.3225763556778443]
    }]
  };
  test = () => {
    this.setState({
      data: [
      {
        id: "id2",
        center: [103.8542, 1.3293]
      }, {
        id: "id3",
        center: [103.85530471801756, 1.3291406454039345]
      }, {
        id: "id4",
        center: [103.84435325860977, 1.38758564176523]
      }]
    });
  };
  render() {
    return (
      <div>
        <span className="material-icons" style={{color: "red"}}>place</span>
        <Map/>
      </div>
    );
  }
}

export default App;