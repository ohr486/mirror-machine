import { Application } from 'spectron';
import * as path from 'path';

describe('Main Process', () => {
  let app: Application;
  
  beforeEach(async () => {
    app = new Application({
      path: require('electron'),
      args: [path.join(__dirname, '..')],
      env: { NODE_ENV: 'test' },
    });
    
    return app.start();
  }, 30000);

  afterEach(async () => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('creates a browser window', async () => {
    const windowCount = await app.client.getWindowCount();
    expect(windowCount).toBe(1);
  });

  it('is running', async () => {
    expect(app.isRunning()).toBe(true);
  });

  it('has the correct window title', async () => {
    const title = await app.client.getTitle();
    expect(title).toBe('Electron App');
  });
});
