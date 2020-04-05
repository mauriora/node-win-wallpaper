export default interface NodeWallpaperNative {
    moveWindow(handle: Buffer, x: number, y: number, width: number, height: number): boolean;

    attachWindow(handle: Buffer): void;
};
