import { app, BrowserWindow, Menu, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { INetworkSettings, startAqueductServer } from './aqueduct-remote/server';
import { checkForUpdates } from './check-for-updates';
import { startServer } from './market-maker-api/server';
import { openAboutWindow } from './windows/about';

autoUpdater.checkForUpdatesAndNotify();

const kovanNetwork: INetworkSettings = { id: 42, chain: 'kovan' };
const mainNetwork: INetworkSettings = { id: 1, chain: 'mainnet' };
const userDataPath = app.getPath('userData');
const chainCachePath = path.join(userDataPath, 'chain');
const cacheNetwork = (chain: string) => fs.writeFileSync(chainCachePath, chain);
const getCachedNetwork = () => {
  try {
    const result = fs.readFileSync(chainCachePath).toString();
    if (result === 'kovan' || result === 'mainnet') {
      return result;
    }
    return;
  } catch {
    return;
  }
};

let win: BrowserWindow | undefined;

app.makeSingleInstance(() => {
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
  }
  return true;
});

const createWindow = async () => {
  win = new BrowserWindow({
    title: 'ERC dEX Automation Toolkit'
  });

  // tslint:disable-next-line:no-console
  const cachedNetwork = getCachedNetwork();
  let networkSettings: INetworkSettings = cachedNetwork === 'kovan' ? kovanNetwork : mainNetwork;
  await startAqueductServer(userDataPath, networkSettings);
  await startServer(userDataPath);

  const selectNetwork = async (settings: INetworkSettings) => {
    cacheNetwork(settings.chain);
    app.relaunch();
    app.exit();
  };

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
      label: 'Options',
      submenu: [
        {
          label: 'Network',
          submenu: [
            {
              label: 'Mainnet',
              type: 'radio',
              checked: networkSettings.id === 1,
              click: () => {
                selectNetwork(mainNetwork);
              }
            },
            {
              label: 'Kovan (testnet)',
              type: 'radio',
              checked: networkSettings.id === 42,
              click: () => {
                selectNetwork(kovanNetwork);
              }
            }
          ]
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

  const isDevelopment = process.env.NODE_ENV !== 'production';
  if (isDevelopment) {
    win.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
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
