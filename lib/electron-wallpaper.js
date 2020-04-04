/*
 * Copyright 2018 Robin Andersson <me@robinwassen.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const bindings = require('bindings');

const electron = require('electron');
const electronWallpaperNative = bindings('electron-wallpaper');
const ScreenBounds = new require('./ScreenBounds');
let bounds;

function moveWindow(handle, bounds) {
  return electronWallpaperNative.moveWindow(handle, bounds.x, bounds.y, bounds.width, bounds.height)
}
const defaultExport = {
  ...electronWallpaperNative,
  init: function () {
    bounds = new ScreenBounds(electron.screen.getAllDisplays());
  },
  moveWindow: moveWindow,
  attachWindowToDisplay: function (displayId, browserWindow) {
    const handle = browserWindow.getNativeWindowHandle();
    const displayBounds = bounds.findBoundsByDisplayId(displayId);
    electronWallpaperNative.attachWindow(handle);
    moveWindow(handle, displayBounds);
    return browserWindow;
  }
};
module.exports = defaultExport;
