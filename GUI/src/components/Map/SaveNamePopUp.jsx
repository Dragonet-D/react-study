import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import Context from 'utils/createContext';
// import InputAdornment from '@material-ui/core/InputAdornment';
import { Paper, Typography, InputAdornment, IconButton } from '@material-ui/core';
import Search from '@material-ui/icons/Search';
import { loadModules } from 'esri-loader';
import { urls, layerId } from 'commons/map/setting';
import Context from 'utils/createContext';
import { Input, Button } from 'components/common'; // IVHTable
import AOITree from './AOITree';

const useStyles = makeStyles(theme => ({
  root1: {
    width: theme.spacing(48),
    height: theme.spacing(8),
    overflowY: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  root2: {
    width: theme.spacing(38),
    height: theme.spacing(45),
    overflowY: 'auto'
  },
  subHeader: {
    display: 'flex',
    alignItems: 'center'
  },
  warn: {
    color: theme.palette.messageCenter.warning
  },
  noData: {
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputBar: {
    height: '38px',
    width: '90%',
    padding: theme.spacing(1),
    marginLeft: '5%',
    overflow: 'hidden'
  }
}));

// const modulesUri = ['esri/geometry/Point', 'esri/geometry/SpatialReference', 'esri/Graphic'];

async function goto(view, item, modules) {
  if (item) {
    // eslint-disable-next-line
    const [Polygon, SpatialReference, Point, Graphic] = modules;
    const rings = item.geometryData.map(x => {
      return [x.xCoordinate, x.yCoordinate];
    });
    const polygon = {
      type: 'polygon',
      rings,
      spatialReference: new SpatialReference(102100)
    };

    const fillSymbol = {
      type: 'simple-fill', // autocasts as new SimpleFillSymbol()
      color: [227, 139, 79, 0.8],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
      }
    };
    const polygonGraphic = new Graphic({
      geometry: polygon,
      symbol: fillSymbol
    });
    view.graphics.removeAll();
    view.goTo(
      {
        target: new Point({
          latitude: item.centerCoordinates.latitude,
          longitude: item.centerCoordinates.longitude
        }),
        zoom: parseInt(item.zoomId, 10)
      },
      {
        duration: 500 // Duration of animation will be 5 seconds
      }
    );
    view.graphics.add(polygonGraphic);
  } else {
    view.graphics.removeAll();
  }
}

async function channelQuery(map, modules, item, resolve) {
  const [Polygon, SpatialReference] = modules;
  const normalLayer = map.findLayerById(layerId.normal);
  const rings = item.geometryData.map(x => {
    return [x.xCoordinate, x.yCoordinate];
  });
  const polygon = new Polygon({
    rings,
    spatialReference: new SpatialReference(102100)
  });
  const query = normalLayer.createQuery();
  query.geometry = polygon;
  query.spatialRelationship = 'contains';
  query.returnGeometry = true;
  normalLayer.queryFeatures(query).then(res => {
    resolve(res);
  });
}

function SaveNamePopUp(props) {
  const classes = useStyles();
  const [inputName, setinputName] = React.useState('');
  const [module, setmodule] = React.useState(null);
  const [searchStr, setsearchStr] = React.useState(null);
  const {
    highlight,
    contextMenu: { aoi }
  } = React.useContext(Context);
  const { AOIExpandInstance, AOISketchInstance } = aoi;

  const { saveName, dataSource, popSaveName, map, view, deleteAOI, searchName } = props;

  React.useEffect(() => {
    getModule();
  }, []);

  async function getModule() {
    const modulesUri = [
      'esri/geometry/Polygon',
      'esri/geometry/SpatialReference',
      'esri/geometry/Point',
      'esri/Graphic',
      'esri/tasks/support/FeatureSet'
    ];
    const modules = await loadModules([...modulesUri], { url: urls.module.current.js });
    setmodule(modules);
  }

  async function triggerLoad(item, resolve) {
    const res = new Promise(resolve => {
      channelQuery(map, module, item, resolve);
    });
    res.then(res => {
      resolve(res);
    });
  }

  function deleteAOIPloygon(id) {
    view.graphics.removeAll();
    deleteAOI(id);
  }

  function AOIDisplay(item) {
    if (AOISketchInstance) {
      AOISketchInstance.layer.removeAll();
    }
    goto(view, item, module);
  }

  function camSelected(item) {
    // const set = module[4].fromJSON(item.data);
    const normalLayer = map.findLayerById(layerId.normal);
    view.whenLayerView(normalLayer).then(layerView => {
      const set = module[4].fromJSON(item.data);
      set.features.forEach(x => {
        if (x.attributes.channelId === item.channelId) {
          highlight.set(layerView.highlight(x));
        }
      });
    });
  }

  return popSaveName ? (
    <Paper id="saveNamePopUp" className={classes.root1}>
      <Input
        placeholder="AOI Name"
        style={{ height: '40px', marginLeft: 15 }}
        onChange={e => {
          setinputName(e.target.value);
        }}
      />
      <Button
        onClick={() => {
          if (inputName.trim().length) {
            saveName(inputName.trim());
            if (AOIExpandInstance) {
              AOIExpandInstance.collapse();
              AOISketchInstance.cancel();
            }
          }
        }}
      >
        Save
      </Button>
    </Paper>
  ) : (
    <Paper id="saveNamePopUp" className={classes.root2}>
      <Typography color="textSecondary" variant="h6" style={{ padding: 8 }}>
        AOI List
      </Typography>
      <Input
        placeholder="AOI Name"
        className={classes.inputBar}
        onChange={e => {
          setsearchStr(e.target.value);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => {
                searchName(searchStr);
              }}
            >
              <Search />
            </IconButton>
          </InputAdornment>
        }
      />
      <div style={{ height: 'auto' }}>
        {dataSource && dataSource.length ? (
          <AOITree
            triggerLoad={triggerLoad}
            dataSource={dataSource}
            camSelected={camSelected}
            AOIDisplay={AOIDisplay}
            deleteAOI={deleteAOIPloygon}
          />
        ) : (
          <div className={classes.noData}>No Data</div>
        )}
      </div>
    </Paper>
  );
}

export default SaveNamePopUp;
