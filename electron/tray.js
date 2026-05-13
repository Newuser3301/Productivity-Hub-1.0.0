// electron/tray.js
import { Menu, Tray, app, nativeImage } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tray = null;
let lastStatus = { isRunning: false, mode: 'focus', secondsLeft: 25 * 60 };

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

export const createTray = (mainWindow) => {
  const iconPath = path.join(__dirname, '..', 'public', 'icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon.isEmpty() ? nativeImage.createEmpty() : icon.resize({ width: 16, height: 16 }));
  tray.setToolTip('Productivity Hub');
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
  updateTray(lastStatus, mainWindow);
  return tray;
};

export const updateTray = (status, mainWindow) => {
  lastStatus = { ...lastStatus, ...status };
  if (!tray) return;
  const label = lastStatus.isRunning
    ? `${lastStatus.mode.replace(/([A-Z])/g, ' $1')} ${formatTime(lastStatus.secondsLeft)}`
    : 'Pomodoro idle';
  tray.setToolTip(`Productivity Hub - ${label}`);
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: label, enabled: false },
    { type: 'separator' },
    { label: 'Open Productivity Hub', click: () => mainWindow.show() },
    { label: 'Matrix', click: () => mainWindow.webContents.send('navigate', 'matrix') },
    { label: 'Schedule', click: () => mainWindow.webContents.send('navigate', 'calendar') },
    { label: 'Timer', click: () => mainWindow.webContents.send('navigate', 'timer') },
    { label: 'Kanban', click: () => mainWindow.webContents.send('navigate', 'kanban') },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]));
};
