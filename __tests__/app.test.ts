import { Application } from 'spectron';
import * as path from 'path';
import * as fs from 'fs';

describe('Basic Application Tests', () => {
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

  it('shows an initial window', async () => {
    const count = await app.client.getWindowCount();
    expect(count).toBe(1);
  });

  it('has the correct title', async () => {
    const title = await app.client.getTitle();
    expect(title).toBe('Electron App');
  });

  it('displays the hello message', async () => {
    const element = await app.client.$('h1');
    const text = await element.getText();
    expect(text).toBe('Hello Electron!');
  });

  it('has an app div element', async () => {
    const element = await app.client.$('#app');
    const isExisting = await element.isExisting();
    expect(isExisting).toBe(true);
  });
});
