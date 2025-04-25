import * as path from 'path';

jest.mock('electron', () => ({
  app: {
    whenReady: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    quit: jest.fn(),
  },
  BrowserWindow: {
    getAllWindows: jest.fn().mockReturnValue([]),
  },
}));

import { app } from 'electron';

describe('Main Process', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers app ready event handler', () => {
    jest.isolateModules(() => {
      require('../src/main');
      expect(app.whenReady).toHaveBeenCalled();
    });
  });

  it('registers window-all-closed event handler', () => {
    jest.isolateModules(() => {
      require('../src/main');
      expect(app.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
    });
  });

  it('registers activate event handler', () => {
    jest.isolateModules(() => {
      require('../src/main');
      expect(app.on).toHaveBeenCalledWith('activate', expect.any(Function));
    });
  });
});
