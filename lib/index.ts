import bindings from 'bindings';
import path from 'path';

const nodeWinWallpaper: {
    moveWindow(handle: Buffer, x: number, y: number, width: number, height: number): boolean;
    attachWindow(handle: Buffer): void;
} = bindings({
    // Workaround for webpack/electronforge shenanigans
    // eslint-disable-next-line @typescript-eslint/camelcase
    module_root: path.resolve(path.join(__dirname, '../')),
    bindings: 'node-win-wallpaper'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any as string);


export interface Rectangle {
    /**
     * The height of the rectangle (must be an integer).
     */
    height: number;
    /**
     * The width of the rectangle (must be an integer).
     */
    width: number;
    /**
     * The x coordinate of the origin of the rectangle (must be an integer).
     */
    x: number;
    /**
     * The y coordinate of the origin of the rectangle (must be an integer).
     */
    y: number;
}

export default {
    moveWindow: function(handle: Buffer, {x, y, width, height}: Rectangle): boolean {
        return nodeWinWallpaper.moveWindow(handle, x, y, width, height);
    },
    attachWindow: function(handle: Buffer): void {
        return nodeWinWallpaper.attachWindow(handle);
    }
};
