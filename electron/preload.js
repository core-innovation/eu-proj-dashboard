// Preload script for Electron
// This script runs in a privileged context and can safely expose APIs to the renderer

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: expose a method to get app version
  getVersion: () => process.versions.electron,
  
  // Example: expose a method to minimize/maximize window
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // Add more APIs as needed for your app
});
