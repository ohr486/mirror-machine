import { Application } from 'spectron';
import * as path from 'path';

describe('Application launch', () => {
  let app: Application;
  
  beforeEach(() => {
    app = new Application({
      path: require('electron'),
      args: [path.join(__dirname, '..')],
      env: { NODE_ENV: 'test' },
    });
    return app.start();
  }, 30000);

  afterEach(() => {
    if (app && app.isRunning()) {
      return app.stop();
    }
  });

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toBe(1);
  });

  it('has the correct title', async () => {
    const title = await app.client.getTitle();
    expect(title).toBe('Electron Windows App');
  });

  it('displays app content', async () => {
    const element = await app.client.$('#app-content');
    const isExisting = await element.isExisting();
    expect(isExisting).toBe(true);
  });
});
