// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { CLIENT, CREDIT } from './services/Database.service';

export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
  insertCLIENT: (client: CLIENT) => ipcRenderer.invoke('client:insert', client),
  deleteCLIENT: (id: number) => ipcRenderer.invoke('client:delete', id),
  getAllCLIENT: () => ipcRenderer.invoke('client:getAll'),
  getOneCLIENTBYCARDID: (id:number) => ipcRenderer.invoke('client:getByCardId', id),
  getOneCLIENTBYNAME: (name:string) => ipcRenderer.invoke('client:getBYName', name),
  getOneCLIENTBYSOCIALID: (id:number) => ipcRenderer.invoke('client:getBySocialId', id),
  getOneCLIENTBYRANGE: (low: number, high:number) => ipcRenderer.invoke('client:getByRange', low, high),
  updateCLIENT: (client: CLIENT) => ipcRenderer.invoke('client:update', client),
  insertCREDIT: (credit: CREDIT) => ipcRenderer.invoke('credit:insert', credit),
  deleteCREDIT: (id: number, credit_id:number) => ipcRenderer.invoke('credit:delete', id, credit_id),
  getAllCREDIT: () => ipcRenderer.invoke('credit:getAll'),
  updateCREDIT: (credit: CREDIT) => ipcRenderer.invoke('credit:update', credit),
  getOneCREDIT: (id: number) => ipcRenderer.invoke('credit:getOne', id),
  getOneCREDITBYNAME: (name:string) => ipcRenderer.invoke('credit:getBYName', name),
  getOneCREDITBYDATE: (date_low:Date, date_high:Date) => ipcRenderer.invoke('credit:getBYDate', date_low, date_high),
  getOneCREDITBYRANGE: (low: number, high:number) => ipcRenderer.invoke('credit:getByRange', low, high),
  
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
