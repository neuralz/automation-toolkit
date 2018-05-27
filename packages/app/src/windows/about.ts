import { BrowserWindow } from "electron";
import * as url from 'url';
import * as path from 'path';
const pjson = require('../../package.json');

export const openAboutWindow = () => {
  let win: BrowserWindow | undefined = new BrowserWindow({
    width: 350,
    height: 175
  });

  if (process.env.NODE_ENV !== 'production') {
    win.loadURL(`http://localhost:8663/about.html?version=${pjson.version}`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  win.on('closed', () => {
    win = undefined;
  });
}
