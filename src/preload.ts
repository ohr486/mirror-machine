import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getAppVersion: (): string | undefined => process.env.npm_package_version,
});

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector: string, text: string): void => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ['chrome', 'node', 'electron']) {
    const version = process.versions[dependency] || 'unknown';
    replaceText(`${dependency}-version`, version);
  }
});
