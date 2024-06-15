/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import {
  deleteClient,
  getAllClient,
  getOneClientByName,
  getOneClientByCardId,
  getOneClientBySocialId,
  getOneClientByAmountRange,
  insertClient,
  updateClient,
  deleteCredit,
  insertCredit,
  getOneCredit,
  getAllCredit,
  updateCredit,
  getOneCreditByName,
  getOneCreditByAmountRange,
  getOneCreditByDate,
  CREDIT,
  CLIENT,
} from './services/Database.service';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

  return installer.default(forceDownload).catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1650,
    height: 1200,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    ipcMain.handle('client:insert', async (_, client: CLIENT) => {
      insertClient(client);
    });
    ipcMain.handle('client:update', async (_, client: CLIENT) => {
      updateClient(client);
    });
    ipcMain.handle('client:delete', async (_, id: number) => {
      deleteClient(id);
    });
    ipcMain.handle('client:getByName', async (_, name: string) => {
      return getOneClientByName(name);
    });
    ipcMain.handle('client:getBySocialId', async (_, id: number) => {
      return getOneClientBySocialId(id);
    });
    ipcMain.handle('client:getByCardId', async (_, id: number) => {
      return getOneClientByCardId(id);
    });
    ipcMain.handle(
      'client:getByRange',
      async (_, low: number, high: number) => {
        return getOneClientByAmountRange(low, high);
      },
    );
    ipcMain.handle('client:getAll', async () => {
      return getAllClient();
    });
    ipcMain.handle('credit:insert', async (_, credit: CREDIT) => {
      insertCredit(credit);
    });
    ipcMain.handle('credit:update', async (_, credit: CREDIT) => {
      updateCredit(credit);
    });
    ipcMain.handle(
      'credit:delete',
      async (_, id: number, client_id: number) => {
        deleteCredit(id, client_id);
      },
    );
    ipcMain.handle('credit:getOne', async (_, id: number) => {
      return getOneCredit(id);
    });
    ipcMain.handle('credit:getByName', async (_, name: string) => {
      return getOneCreditByName(name);
    });
    ipcMain.handle(
      'credit:getByRange',
      async (_, low: number, high: number) => {
        return getOneCreditByAmountRange(low, high);
      },
    );
    ipcMain.handle(
      'credit:getByDate',
      async (_, date_low: Date, date_high: Date) => {
        return getOneCreditByDate(date_low, date_high);
      },
    );
    ipcMain.handle('credit:getAll', async () => {
      return getAllCredit();
    });
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
