interface Window {
  api: {
    getAppVersion: () => string | undefined;
  }
}

declare namespace NodeJS {
  interface ProcessVersions {
    [key: string]: string;
  }
}
