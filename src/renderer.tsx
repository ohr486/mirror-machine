import React from 'react';
import { createRoot } from 'react-dom/client';

interface VersionInfo {
  electron: string;
  chrome: string;
  node: string;
}

declare global {
  interface Window {
    api: {
      getAppVersion: () => string;
      getElectronVersion: () => string;
      getChromeVersion: () => string;
      getNodeVersion: () => string;
    };
  }
}

const VersionInfoComponent: React.FC = () => {
  const [versions, setVersions] = React.useState<VersionInfo>({
    electron: '',
    chrome: '',
    node: ''
  });

  React.useEffect(() => {
    if (window.api) {
      setVersions({
        electron: window.api.getElectronVersion(),
        chrome: window.api.getChromeVersion(),
        node: window.api.getNodeVersion()
      });
    }
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

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Mirror Machine for macOS</h1>
      <div id="app-content">
        <VersionInfoComponent />
      </div>
    </div>
  );
};

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('app');
  if (container) {
    const root = createRoot(container);
    root.render(<App />);
  }
});
