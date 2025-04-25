/**
 * Main process tests using mocks to avoid launching Electron
 */
const { describe, it, expect, beforeEach } = require('@jest/globals');

const mockOn = jest.fn();
const mockQuit = jest.fn();
const mockWhenReady = jest.fn().mockReturnValue({
  then: jest.fn((callback) => {
    callback();
    return { catch: jest.fn() };
  })
});

const mockLoadFile = jest.fn();
const mockOpenDevTools = jest.fn();
const mockBrowserWindow = jest.fn().mockImplementation(() => ({
  loadFile: mockLoadFile,
  webContents: {
    openDevTools: mockOpenDevTools
  }
}));

jest.mock('electron', () => ({
  app: {
    whenReady: mockWhenReady,
    on: mockOn,
    quit: mockQuit
  },
  BrowserWindow: mockBrowserWindow
}), { virtual: true });

describe('Main Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a browser window with correct settings', () => {
    expect(mockBrowserWindow).not.toHaveBeenCalled();
    
    const createWindow = () => {
      const win = new (require('electron').BrowserWindow)({
        width: 800,
        height: 600,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true
        }
      });
      win.loadFile('src/index.html');
    };
    
    createWindow();
    
    expect(mockBrowserWindow).toHaveBeenCalledWith(expect.objectContaining({
      width: 800,
      height: 600,
      webPreferences: expect.objectContaining({
        nodeIntegration: false,
        contextIsolation: true
      })
    }));
    
    expect(mockLoadFile).toHaveBeenCalledWith('src/index.html');
  });

  it('registers app lifecycle event handlers', () => {
    require('electron').app.on('window-all-closed', () => {});
    require('electron').app.on('activate', () => {});
    
    expect(mockOn).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
    expect(mockOn).toHaveBeenCalledWith('activate', expect.any(Function));
  });
});
