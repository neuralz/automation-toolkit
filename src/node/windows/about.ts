import { BrowserWindow, app } from 'electron';
import * as path from 'path';
import * as url from 'url';

declare const __static: string;

export const openAboutWindow = () => {
  let win: BrowserWindow | undefined = new BrowserWindow({
    width: 350,
    height: 175
  });

  win.loadURL(
    url.format({
      pathname: path.join(__static, `about.html`),
      protocol: 'file:',
      slashes: true,
      query: {
        version: app.getVersion()
      }
    })
  );

  win.on('closed', () => {
    win = undefined;
  });
};
