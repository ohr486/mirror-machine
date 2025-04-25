import * as fs from 'fs';
import * as path from 'path';

jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadFile: jest.fn(),
    on: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
  })),
}));

import '../src/main';
import { BrowserWindow } from 'electron';

describe('Basic Application Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates a browser window with correct settings', () => {
    expect(BrowserWindow).toHaveBeenCalledWith({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
  });

  it('loads the correct HTML file', () => {
    const browserWindow = (BrowserWindow as unknown as jest.Mock<any, any>).mock.results[0].value;
    
    expect(browserWindow.loadFile).toHaveBeenCalledWith(
      expect.stringContaining('index.html')
    );
  });
});
