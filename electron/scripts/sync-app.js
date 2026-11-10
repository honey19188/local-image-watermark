'use strict';

// 把工作区根目录的 index.html 与 lib 同步到 electron/app，
// 保证打包产物与源码始终保持一致。
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const APP = path.resolve(__dirname, '..', 'app');

function copy(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

fs.rmSync(APP, { recursive: true, force: true });
copy(path.join(ROOT, 'index.html'), path.join(APP, 'index.html'));

const libDir = path.join(ROOT, 'lib');
for (const file of fs.readdirSync(libDir)) {
  copy(path.join(libDir, file), path.join(APP, 'lib', file));
}

console.log('synced ->', APP);
