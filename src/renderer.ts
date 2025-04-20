document.addEventListener('DOMContentLoaded', () => {
  const appContent = document.getElementById('app-content');
  
  if (appContent) {
    const versionInfo = document.createElement('div');
    versionInfo.innerHTML = `
      <h3>環境情報:</h3>
      <ul>
        <li>Electron: <span id="electron-version"></span></li>
        <li>Chrome: <span id="chrome-version"></span></li>
        <li>Node.js: <span id="node-version"></span></li>
      </ul>
    `;
    
    appContent.appendChild(versionInfo);
  }
});
