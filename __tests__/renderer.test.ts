/**
 * @jest-environment jsdom
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Renderer Process', () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, '../src/index.html'),
      'utf8'
    );
    
    (global.window as any).api = {
      getAppVersion: jest.fn().mockReturnValue('1.0.0'),
    };
  });

  it('creates version info elements when DOM is loaded', () => {
    require('../src/renderer');
    
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
