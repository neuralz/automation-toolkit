import { startAqueductServer } from '@ercdex/aqueduct-remote';
import { startServer } from '@ercdex/market-maker-api';
import { app, BrowserWindow, Menu, shell } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { openAboutWindow } from './windows/about';

let win: BrowserWindow | undefined;

startAqueductServer();
startServer();

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

  // if (process.env.NODE_ENV !== 'production') {
  //   win.loadURL(`http://localhost:8663`);
  // } else {
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'web', 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
  // }

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
