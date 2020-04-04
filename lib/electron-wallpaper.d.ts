import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

type bounds = {
    x: number, y: number, width: number, height: number
}
export as namespace electronWallpaper;

export function init(): void;
export function attachWindow(handler: Buffer): void;
export function moveWindow(handler: Buffer, bounds: bounds): BrowserWindow;
export function attachWindowToDisplay(displayId: number, browserWindow: BrowserWindow): BrowserWindow;
