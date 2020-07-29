/// <reference types="node" />
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
declare const _default: {
    moveWindow: (handle: Buffer, { x, y, width, height }: Rectangle) => boolean;
    attachWindow: (handle: Buffer) => void;
};
export default _default;
