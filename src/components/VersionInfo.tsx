import React, { useEffect, useState } from 'react';

interface Versions {
  electron: string;
  chrome: string;
  node: string;
}

declare global {
  interface Window {
    api: {
      getAppVersion: () => string;
      getVersions: () => Versions;
    }
  }
}

const VersionInfo: React.FC = () => {
  const [versions, setVersions] = useState<Versions>({
    electron: '',
    chrome: '',
    node: ''
  });

  useEffect(() => {
    setVersions(window.api.getVersions());
  }, []);

  return (
    <div>
      <h3>環境情報:</h3>
      <ul>
        <li>Electron: <span id="electron-version">{versions.electron}</span></li>
        <li>Chrome: <span id="chrome-version">{versions.chrome}</span></li>
        <li>Node.js: <span id="node-version">{versions.node}</span></li>
      </ul>
    </div>
  );
};

export default VersionInfo;
