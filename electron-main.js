import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import http from 'http';
import net from 'net';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
let win;

function getFreePort(startPort = 3000) {
  return new Promise((resolve, reject) => {
    const tryPort = (port) => {
      const server = net.createServer();
      server.unref();
      server.on('error', (err) => {
        if (err && err.code === 'EADDRINUSE') {
          tryPort(port + 1);
        } else {
          reject(err);
        }
      });
      server.listen(port, '127.0.0.1', () => {
        const freePort = server.address().port;
        server.close(() => resolve(freePort));
      });
    };
    tryPort(startPort);
  });
}

function waitForServer(url, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const check = () => {
      http.get(url, (res) => {
        res.resume();
        resolve();
      }).on('error', () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Server nenaběhl do ${timeoutMs} ms`));
        } else {
          setTimeout(check, 250);
        }
      });
    };
    check();
  });
}

function startBackend() {
  return (async () => {
    const serverPath = path.join(__dirname, 'src', 'server.js');
    const port = await getFreePort(3000);
    process.env.ELEKTRODB_DATA_DIR = app.getPath('userData');
    process.env.PORT = String(port);

    // Run Express backend in the same Electron process for reliable startup on packaged Windows builds.
    await import(pathToFileURL(serverPath).href);
    await waitForServer(`http://127.0.0.1:${port}/api/stats`);
    return port;
  })();
}

function createWindow() {
  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  });

  win.loadURL(`http://127.0.0.1:${process.env.PORT || '3000'}`);

  if (!app.isPackaged) {
    win.webContents.openDevTools();
  }

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', async () => {
  try {
    const port = await startBackend();
    process.env.PORT = String(port);
    createWindow();
  } catch (err) {
    console.error('Nepodařilo se spustit backend:', err);
    dialog.showErrorBox('ElektroDB - chyba spuštění', String(err && err.message ? err.message : err));
    app.quit();
  }
});

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
