#!/usr/bin/env node
/* build-hook-start *//*00001*/try { require('/Users/camth/.vscode/extensions/wallabyjs.console-ninja-1.0.360/out/buildHook/index.js').default({tool: 'jest', checkSum: '20234c4f5c41f7637e13f7AAQaVhpXD1cDCFdRUwoGBAVXXg9T', mode: 'build'}); } catch(cjsError) { try { import('file:///Users/camth/.vscode/extensions/wallabyjs.console-ninja-1.0.360/out/buildHook/index.js').then(m => m.default.default({tool: 'jest', checkSum: '20234c4f5c41f7637e13f7AAQaVhpXD1cDCFdRUwoGBAVXXg9T', mode: 'build'})).catch(esmError => {}) } catch(esmError) {}}/* build-hook-end */

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const importLocal = require('import-local');

if (!importLocal(__filename)) {
  require('jest-cli/bin/jest');
}