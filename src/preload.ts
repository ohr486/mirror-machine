import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getAppVersion: () => '1.0.0',
  getElectronVersion: () => process.versions.electron,
  getChromeVersion: () => process.versions.chrome,
  getNodeVersion: () => process.versions.node
});
