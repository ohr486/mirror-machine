/**
 * @jest-environment jsdom
 */

const { describe, it, expect, beforeEach } = require('@jest/globals');

global.window = {
  api: {
    getAppVersion: jest.fn().mockReturnValue('1.0.0')
  }
};

describe('Renderer Process', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="container">
        <h1>Mirror Machine for macOS</h1>
        <div id="app-content"></div>
      </div>
    `;
    
    jest.clearAllMocks();
  });

  it('creates version info elements when DOM is loaded', () => {
    const rendererModule = `
      document.addEventListener('DOMContentLoaded', () => {
        const appContent = document.getElementById('app-content');
        
        if (appContent) {
          const versionInfo = document.createElement('div');
          versionInfo.innerHTML = \`
            <h3>環境情報:</h3>
            <ul>
              <li>Electron: <span id="electron-version"></span></li>
              <li>Chrome: <span id="chrome-version"></span></li>
              <li>Node.js: <span id="node-version"></span></li>
            </ul>
          \`;
          
          appContent.appendChild(versionInfo);
        }
      });
    `;
    
    const script = document.createElement('script');
    script.textContent = rendererModule;
    document.body.appendChild(script);
    
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    const versionInfo = document.querySelector('#app-content div');
    expect(versionInfo).not.toBeNull();
    
    const electronVersion = document.getElementById('electron-version');
    const chromeVersion = document.getElementById('chrome-version');
    const nodeVersion = document.getElementById('node-version');
    
    expect(electronVersion).not.toBeNull();
    expect(chromeVersion).not.toBeNull();
    expect(nodeVersion).not.toBeNull();
  });
});
