import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import * as url from 'url';

export const openAboutWindow = () => {
  let win: BrowserWindow | undefined = new BrowserWindow({
    width: 350,
    height: 175,
    title: 'About ERC dEX Automation Toolkit'
  });

  const isDevelopment = process.env.NODE_ENV !== 'production';
  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?mode=about&version=${app.getVersion()}`);
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true,
      query: {
        mode: 'about',
        version: app.getVersion()
      }
    }));
  }

  win.on('closed', () => {
    win = undefined;
  });
};
