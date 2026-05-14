// electron/main.js
import { app, BrowserWindow, Menu, Notification, ipcMain, shell } from 'electron';
import updater from 'electron-updater';
import Store from 'electron-store';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import { createTray, updateTray } from './tray.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { autoUpdater } = updater;
const store = new Store({ name: 'window-state' });
let mainWindow;
let quitting = false;

const loadEnvFile = () => {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, '');
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
};

loadEnvFile();

const safeCompare = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const authenticateCredentials = ({ username = '', password = '' } = {}) => {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || '';
  if (!adminPassword) {
    throw new Error('Admin password is not configured.');
  }
  if (!safeCompare(username, adminUsername) || !safeCompare(password, adminPassword)) {
    throw new Error('Username yoki parol notogri.');
  }
  return {
    user: {
      id: 'admin-1',
      name: process.env.ADMIN_NAME || 'Productivity Admin',
      username: adminUsername,
      role: 'admin',
      initials: process.env.ADMIN_INITIALS || 'PA',
      token: crypto.randomBytes(32).toString('base64url')
    }
  };
};

const createWindow = async () => {
  const state = store.get('bounds', { width: 1200, height: 800 });
  mainWindow = new BrowserWindow({
    ...state,
    minWidth: 1024,
    minHeight: 700,
    title: 'Productivity Hub',
    icon: path.join(__dirname, '..', 'public', 'icon.png'),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('close', (event) => {
    store.set('bounds', mainWindow.getBounds());
    if (!quitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  if (app.isPackaged) {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  createTray(mainWindow);
};

const sendNavigation = (module) => {
  if (!mainWindow) return;
  mainWindow.show();
  mainWindow.webContents.send('navigate', module);
};

const buildMenu = () => Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      { label: 'Quick Add Task', accelerator: 'Ctrl+N', click: () => mainWindow?.webContents.send('quick-add') },
      { type: 'separator' },
      { label: 'Minimize to Tray', click: () => mainWindow?.hide() },
      { label: 'Quit', accelerator: 'Ctrl+Q', click: () => { quitting = true; app.quit(); } }
    ]
  },
  {
    label: 'View',
    submenu: [
      { label: 'Matrix', accelerator: 'Ctrl+1', click: () => sendNavigation('matrix') },
      { label: 'Time Blocking', accelerator: 'Ctrl+2', click: () => sendNavigation('calendar') },
      { label: 'Pomodoro', accelerator: 'Ctrl+3', click: () => sendNavigation('timer') },
      { label: 'Kanban', accelerator: 'Ctrl+4', click: () => sendNavigation('kanban') },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'toggleDevTools' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Productivity Hub README', click: () => shell.openExternal('https://github.com/') },
      { label: 'Check for Updates', click: () => autoUpdater.checkForUpdatesAndNotify().catch(() => undefined) },
      { label: 'About', click: () => new Notification({ title: 'Productivity Hub', body: '4-in-1 desktop productivity dashboard.' }).show() }
    ]
  }
]);

app.whenReady().then(async () => {
  Menu.setApplicationMenu(buildMenu());
  await createWindow();
  autoUpdater.autoDownload = false;
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify().catch(() => undefined);
  }
});

app.on('before-quit', () => {
  quitting = true;
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {});

ipcMain.on('pomodoro:status', (_event, status) => {
  if (mainWindow) updateTray(status, mainWindow);
});

ipcMain.on('pomodoro:session-end', (_event, payload) => {
  mainWindow?.webContents.send('pomodoro:beep');
  if (Notification.isSupported()) {
    new Notification({
      title: 'Pomodoro session complete',
      body: `${payload.mode.replace(/([A-Z])/g, ' $1')} finished. Next session is ready.`
    }).show();
  }
});

ipcMain.handle('auth:login', (_event, credentials) => authenticateCredentials(credentials));
