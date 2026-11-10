'use strict';

const { app, BrowserWindow, dialog, session, shell } = require('electron');
const path = require('path');

let win = null;

// 单实例：重复启动时聚焦已有窗口
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });
}

function createWindow() {
  win = new BrowserWindow({
    width: 1360,
    height: 900,
    minWidth: 1024,
    minHeight: 680,
    backgroundColor: '#0d1117',
    title: '本地图片加水印',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // 站外链接交给系统浏览器
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/i.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith('file://')) e.preventDefault();
  });

  win.on('closed', () => { win = null; });
}

app.whenReady().then(() => {
  app.setAppUserModelId('local.watermark.tool');

  // 导出下载：弹出“另存为”对话框，让用户选择保存位置
  session.defaultSession.on('will-download', (event, item) => {
    const name = item.getFilename();
    const ext = path.extname(name).replace('.', '');
    const filters = ext
      ? [{ name: ext.toUpperCase() + ' 文件', extensions: [ext] }, { name: '所有文件', extensions: ['*'] }]
      : [{ name: '所有文件', extensions: ['*'] }];
    const savePath = dialog.showSaveDialogSync(win, {
      title: '保存导出文件',
      defaultPath: path.join(app.getPath('downloads'), name),
      filters,
    });
    if (!savePath) {
      item.cancel();
      return;
    }
    item.setSavePath(savePath);
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
