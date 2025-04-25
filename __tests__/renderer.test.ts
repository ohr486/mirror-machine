/**
 * @jest-environment jsdom
 */

import * as fs from 'fs';
import * as path from 'path';

describe('Renderer Process', () => {
  beforeEach(() => {
    document.body.innerHTML = fs.readFileSync(
      path.resolve(__dirname, '../index.html'),
      'utf8'
    );
  });

  it('has the correct title element', () => {
    const titleElement = document.querySelector('title');
    expect(titleElement).not.toBeNull();
    expect(titleElement?.textContent).toBe('Electron App');
  });

  it('has the correct h1 element', () => {
    const h1Element = document.querySelector('h1');
    expect(h1Element).not.toBeNull();
    expect(h1Element?.textContent).toBe('Hello Electron!');
  });

  it('has an app div element', () => {
    const appElement = document.getElementById('app');
    expect(appElement).not.toBeNull();
  });
});
