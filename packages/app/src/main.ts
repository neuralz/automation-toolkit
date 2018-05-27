import { app, BrowserWindow, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { openAboutWindow } from './windows/about';

import '../../api/src/server';

let win: BrowserWindow | undefined;

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
          label: 'Quit',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            shell.openExternal('https://github.com/ERCdEX/automation-toolkit')
          }
        },
        {
          type: 'separator'
        },
        {
          label: 'Open Support Issue',
          click: () => {
            shell.openExternal('https://github.com/ERCdEX/automation-toolkit/issues/new?template=support-request.md')
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  if (process.env.NODE_ENV !== 'production') {
    win.loadURL(`http://localhost:8663`);
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  if (process.env.NODE_ENV !== 'production') {
    // Open DevTools
    win.webContents.openDevTools();
  }

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
