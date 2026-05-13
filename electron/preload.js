// electron/preload.js
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  pomodoroStatus: (status) => ipcRenderer.send('pomodoro:status', status),
  notifySessionEnd: (payload) => ipcRenderer.send('pomodoro:session-end', payload),
  onNavigate: (callback) => {
    const listener = (_event, module) => callback(module);
    ipcRenderer.on('navigate', listener);
    return () => ipcRenderer.removeListener('navigate', listener);
  },
  onQuickAdd: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('quick-add', listener);
    return () => ipcRenderer.removeListener('quick-add', listener);
  },
  onPomodoroBeep: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('pomodoro:beep', listener);
    return () => ipcRenderer.removeListener('pomodoro:beep', listener);
  }
});
