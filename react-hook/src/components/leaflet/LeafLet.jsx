import React, {useEffect, useState} from "react";
import L from "leaflet";
import {
  IconButton,
  ClickAwayListener,
  Collapse,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from "@material-ui/core";
import {Layers} from "@material-ui/icons";
import {useMap, useMarker} from "./use-leaflet";
import GreenIcon from "./leaf-green.png";

import "leaflet/dist/leaflet.css";

const greenIcon = L.icon({
  iconUrl: GreenIcon,
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76]
});

function Map(props) {
  const {id} = props;
  const center = L.latLng(1.3559982755948157, 103.81118774414062);
  const [collapseStatus, setCollapseStatus] = useState(false);
  const [currentLayer, setCurrentLayer] = useState("female");
  const mapRef = useMap(id, {
    center,
    zoom: 11,
    layers: [L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png")]
  });
  const markerRef = useMarker(L.latLng(1.3559982755948157, 103.81118774414062), {icon: greenIcon});
  useEffect(() => {
    markerRef.current.addTo(mapRef.current);
  }, []);

  function handleClickAway(e) {
    setCollapseStatus(false)
  }

  function toggleCollapse() {
    setCollapseStatus(item => !item);
  }

  function handleLayerChange(e) {
    setCurrentLayer(e.target.value)
  }

  return (
    <div>
      <div id={id} className="map"/>
      <ClickAwayListener onClickAway={handleClickAway}>
        <div>
          <IconButton
            className="layer_btn"
            onClick={toggleCollapse}
          >
            <Layers/>
          </IconButton>
          <Collapse className="collapse" in={collapseStatus}>
            <Paper className="layer_content">
              <FormControl component="fieldset">
                <FormLabel component="legend">layers</FormLabel>
                <RadioGroup
                  aria-label="Gender"
                  name="gender1"
                  value={currentLayer}
                  onChange={handleLayerChange}
                >
                  {
                    ["OpenStreetMap", "HERE.normalDayTransit", "HERE.normalDayCustom", "HERE.normalDayGrey"].map(item => {
                      return (
                        <FormControlLabel
                          value={item}
                          key={item}
                          control={<Radio/>}
                          label={item}
                        />)
                    })
                  }

                </RadioGroup>
              </FormControl>
            </Paper>
          </Collapse>
        </div>
      </ClickAwayListener>
    </div>
  )
}

Map.defaultProps = {
  id: "map"
};
export default Map;
