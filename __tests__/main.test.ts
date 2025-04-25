/**
 * Main process tests using mocks to avoid launching Electron
 */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';

const mockOn = jest.fn();
const mockWhenReady = jest.fn().mockReturnValue({
  then: jest.fn((callback: () => void) => {
    callback();
    return { catch: jest.fn() };
  })
});

const mockLoadFile = jest.fn();
const mockBrowserWindow = jest.fn().mockImplementation(() => ({
  loadFile: mockLoadFile,
  webContents: {
    openDevTools: jest.fn()
  }
}));

jest.mock('electron', () => ({
  app: {
    whenReady: mockWhenReady,
    on: mockOn,
    quit: jest.fn()
  },
  BrowserWindow: mockBrowserWindow
}), { virtual: true });

describe('Main Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a browser window with correct settings', () => {
    jest.isolateModules(() => {
      require('../src/main');
      
      expect(mockBrowserWindow).toHaveBeenCalledWith({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
    });
  });

  it('loads the correct HTML file', () => {
    jest.isolateModules(() => {
      require('../src/main');
      
      expect(mockLoadFile).toHaveBeenCalledWith(expect.stringContaining('index.html'));
    });
  });

  it('registers window-all-closed event handler', () => {
    jest.isolateModules(() => {
      require('../src/main');
      
      expect(mockOn).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
    });
  });

  it('registers activate event handler', () => {
    jest.isolateModules(() => {
      require('../src/main');
      
      expect(mockOn).toHaveBeenCalledWith('activate', expect.any(Function));
    });
  });
});
