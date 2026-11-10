'use strict';

// 打包后用 rcedit 写入 exe 图标与版本信息。
// 替代 electron-builder 默认的 rcedit 流程，避免其 winCodeSign 包
// 在无符号链接权限的 Windows 环境解压失败。
const { execFile } = require('child_process');
const path = require('path');

const RCEDIT = path.join(__dirname, 'bin', 'rcedit.exe');
const ICON = path.join(__dirname, '..', 'build', 'icon.ico');

exports.default = async function afterPack(context) {
  if (context.electronPlatformName !== 'win32') return;
  const exe = path.join(context.appOutDir, context.packager.appInfo.productFilename + '.exe');

  const args = [
    exe,
    '--set-icon', ICON,
    '--set-file-version', '1.0.0.0',
    '--set-product-version', '1.0.0.0',
    '--set-version-string', 'ProductName', '本地图片加水印',
    '--set-version-string', 'FileDescription', '本地图片加水印 - 离线批量水印工具',
    '--set-version-string', 'CompanyName', 'Local',
    '--set-version-string', 'LegalCopyright', 'Copyright © 2026',
  ];

  await new Promise((resolve, reject) => {
    execFile(RCEDIT, args, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error('rcedit 失败: ' + (stderr || err.message)));
        return;
      }
      resolve();
    });
  });
};
