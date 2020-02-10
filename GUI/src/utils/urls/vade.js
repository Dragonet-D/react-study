import materialKeys from '../materialKeys';

const namespace = 'vade';
const vade = {
  'IVH-TASK-API': {
    Address: '/api',
    Path: '/ummi-vade/task/',
    URLS: {
      doTask: {
        url: 'doTask',
        materialKey: materialKeys['M3-22']
      },
      tasks: {
        url: 'tasks',
        materialKey: materialKeys['M3-22']
      },
      taskList: {
        url: 'tasks/list',
        materialKey: materialKeys['M3-22']
      },
      taskTypes: {
        url: 'taskTypes',
        materialKey: materialKeys['M3-26']
      },
      taskTypeList: {
        url: 'taskTypes/list',
        materialKey: materialKeys['M3-26']
      },
      testGz: {
        url: 'testGz',
        materialKey: materialKeys['M3-22']
      },
      taskResource: {
        url: 'resource',
        materialKey: materialKeys['M3-22']
      }
    }
  },
  'IVH-FILE-API': {
    Address: '/api',
    Path: '/ummi-vade/',
    URLS: {
      entry: {
        url: 'control/entry',
        materialKey: materialKeys['M3-26']
      },
      files: {
        url: 'control/files',
        materialKey: materialKeys['M3-26']
      },
      fileList: {
        url: 'control/files/list',
        materialKey: materialKeys['M3-26']
      },
      allfileList: {
        url: 'control/files/allList',
        materialKey: materialKeys['M3-26']
      },
      fileTypes: {
        url: 'control/fileTypes',
        materialKey: materialKeys['M3-26']
      },
      fileTypeList: {
        url: 'control/fileTypes/list',
        materialKey: materialKeys['M3-26']
      },
      vadeAddModel: {
        url: 'control/files/addModel',
        materialKey: materialKeys['M3-26']
      }
    }
  },
  'IVH-VADE-UPLOAD-API': {
    Address: '/api',
    Path: '/zuul/ummi-vade/',
    URLS: {
      uploadFile: {
        url: 'control/files/uploadFile',
        materialKey: materialKeys['M3-26']
      }
    }
  },
  'IVH-VADE-RESOURCE-API': {
    Address: '/api',
    Path: '/ummi-vade/resource/',
    URLS: {
      serverResource: {
        url: 'servers',
        materialKey: materialKeys['M3-44']
      },
      serverResourceTotal: {
        url: 'servers/total',
        materialKey: materialKeys['M3-44']
      },
      taskResource: {
        url: 'tasks',
        materialKey: materialKeys['M3-44']
      }
    }
  },
  'IVH-VADE-UPLOAD-FILE-API': {
    Address: '/api',
    Path: '/ummi-vade/control/files/',
    URLS: {
      uploadFileBlock: {
        url: 'uploadFileBlock',
        materialKey: ''
      }
    }
  },
  'IVH-VADE-DOWNLOAD-FILE-API': {
    Address: '/downloadApi',
    Path: '/control/',
    URLS: {
      downloadFile: {
        url: 'files/download',
        materialKey: materialKeys['M3-26']
      }
    }
  }
};
export default { vade, namespace };
