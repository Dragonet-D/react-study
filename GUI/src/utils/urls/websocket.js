const namespace = 'websocket';

const websocket = {
  'IVH-SOCKET-ALARM-API': {
    Address: 'wss://ummi.web.local:443',
    Path: '/socketalarm/',
    URLS: {
      messageBusOfAlarm: {
        url: 'websocket',
        materialKey: ''
      }
    }
  },
  'IVH-SOCKET-CLIPPING-PROGRESS-API': {
    Address: 'wss://ummi.web.local:443',
    Path: '/socket/',
    URLS: {
      progressMsgBus: {
        url: 'websocket',
        materialKey: ''
      }
    }
  },
  'IVH-SOCKET-DEVICE-API': {
    Address: 'wss://ummi.web.local:443',
    Path: '/socketdevice/',
    URLS: {
      messageBusOfDevice: {
        url: 'websocket',
        materialKey: ''
      }
    }
  },
  'IVH-SOCKET-COMMON-API': {
    Address: 'wss://ummi.web.local:443',
    Path: '/socketcommon/',
    URLS: {
      messageBusOfCommon: {
        url: 'websocket',
        materialKey: ''
      }
    }
  },
  'IVH-SOCKET-VADETASK-LOG-API': {
    Address: 'wss://ummi.web.local:443',
    Path: '/vadeWebSocketApi/',
    URLS: {
      livelog: {
        url: 'websocket/',
        materialKey: ''
      },
      vadeMonitor: {
        url: '/websocket/monitor',
        materialKey: ''
      }
    }
  }
};

export default { namespace, websocket };
