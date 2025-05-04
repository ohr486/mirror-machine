import React from 'react';
import VersionInfo from './VersionInfo';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Mirror Machine for macOS</h1>
      <div id="app-content">
        <VersionInfo />
      </div>
    </div>
  );
};

export default App;
