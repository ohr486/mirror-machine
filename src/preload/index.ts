import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getAppVersion: () => process.env.npm_package_version || '1.0.0',
  getVersions: () => ({
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  })
});
