import { startAqueductServer } from '@ercdex/aqueduct-remote';
import { startServer } from '@ercdex/market-maker-api';
import { app, BrowserWindow, Menu, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import * as url from 'url';
import { checkForUpdates } from './check-for-updates';
import { openAboutWindow } from './windows/about';

autoUpdater.checkForUpdatesAndNotify();

/**
 * There is a bug with either yarn, lerna, electron-builder, electron-webpack, or some other
 * piece of this <REDACTED> that packages in the wrong version of a package called mime. Luckily, this
 * is JavaScript so I can just reshape packages with impunity
 */
// tslint:disable-next-line
const mime: any = require('mime');
mime.charsets = {
  lookup: (mimeType: any, fallback: any) => {
    // Assume text types are utf8
    return (/^text\/|^application\/(javascript|json)/).test(mimeType) ? 'UTF-8' : fallback;
  }
};

declare const __static: string;

let win: BrowserWindow | undefined;

// tslint:disable-next-line:no-console
startAqueductServer(app.getPath('userData'));
startServer(app.getPath('userData'));

const createWindow = async () => {
  win = new BrowserWindow();

  const menuTemplate: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'ERC dEX',
      submenu: [
        {
          label: 'About ERC dEX Toolkit',
          click: () => {
            openAboutWindow();
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Check for Updates',
          click: checkForUpdates
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        { label: 'Select All', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
      ] as Electron.MenuItemConstructorOptions[]
    },
    {
      label: 'Help',
      submenu: [
        { role: 'toggledevtools' },
        { type: 'separator' },
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/ERCdEX/automation-toolkit');
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Support Issue',
          click: () => {
            shell.openExternal('https://github.com/ERCdEX/automation-toolkit/issues/new?template=support-request.md');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  win.loadURL(
    url.format({
      pathname: path.join(__static, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  win.on('closed', () => {
    win = undefined;
  });
  win.maximize();
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
