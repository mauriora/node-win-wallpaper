import bindings from 'bindings';
import ScreenBounds from './type/ScreenBounds';
import Bounds from './type/Bounds';
import NodeWallpaperNative from './type/NodeWallpaperNative';
import { BrowserWindow, screen } from 'electron';
import path from 'path';
/* eslint-disable */
//@ts-ignore
const nodeWallpaperNative: NodeWallpaperNative = bindings({
    // Workaround for webpack/electronforge shenanigans
    module_root: path.resolve(path.join(__dirname, '../')),
    bindings: 'node-win-wallpaper'
});
/* eslint-enable */

let currentBounds: ScreenBounds;
export const moveWindow = (handle: Buffer, { x, y, width, height }: Bounds): boolean => {
    return nodeWallpaperNative.moveWindow(handle, x, y, width, height);
};
export const init = (): void => {
    currentBounds = new ScreenBounds(screen.getAllDisplays());
};
export const attachWindowToDisplay = (displayId: number, browserWindow: BrowserWindow): BrowserWindow => {
    const handle = browserWindow.getNativeWindowHandle();
    const displayBounds = currentBounds.findBoundsByDisplayId(displayId);
    nodeWallpaperNative.attachWindow(handle);
    if (displayBounds) {
        moveWindow(handle, displayBounds);
    }
    return browserWindow;
};
export const attachWindow = nodeWallpaperNative.attachWindow;
