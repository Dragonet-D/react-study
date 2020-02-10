import materialKeys from '../materialKeys';

const namespace = 'map';
const map = {
  'IVH-MAP-DEVICE-API': {
    Address: '/api',
    Path: '/ummi-device/',
    URLS: {
      updateChannel: {
        url: 'vms/channel/saveMetadata',
        materialKey: materialKeys['M1-2']
      }
    }
  },
  'IVH-MAP-AOI-API': {
    Address: '/api',
    Path: '/ummi-arcgis/',
    URLS: {
      getAOIPolygon: {
        url: 'polygon/search/{createdId}',
        materialKey: materialKeys['M1-2']
      },
      createPolygon: {
        url: '/polygon/create',
        materialKey: materialKeys['M1-2']
      },
      deleteAOI: {
        url: '/polygon/delete/{geometryId}/{createdId}',
        materialKey: materialKeys['M1-2']
      }
    }
  }
};
export default { map, namespace };
