import electron, {Display} from 'electron';
import Bounds from './Bounds';

export default class ScreenBounds {
    left = 0;
    top = 0;
    right = 0;
    bottom = 0;
    displays: Display[] = [];
    bounds: Bounds[] = [];

    constructor(displays: Display[]) {
        this.left = 0;
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.displays = displays;
        this.bounds = [];

        if (displays) {
            this.displays.forEach((display) => {

                const workArea = electron.screen.dipToScreenRect(null, display.workArea);
                if (this.left > workArea.x) {
                    this.left = workArea.x;
                }
                if (this.right < workArea.x + workArea.width) {
                    this.right = workArea.x + workArea.width;
                }
                if (this.top > workArea.y) {
                    this.top = workArea.y;
                }
                if (this.bottom < workArea.y + workArea.height) {
                    this.bottom = workArea.y + workArea.height;
                }
            });
            this.bounds = this.displays.map((display) => {
                const dipToScreenRect = electron.screen.dipToScreenRect(null, display.workArea);
                return {
                    displayId: display.id,
                    x: dipToScreenRect.x - this.left,
                    y: dipToScreenRect.y - this.top,
                    width: dipToScreenRect.width,
                    height: dipToScreenRect.height
                };
            });
        }
    }

    get width(): number {
        return this.right - this.left;
    }

    get height(): number {
        return this.bottom - this.top;
    }

    findBoundsByDisplayId(displayId: number): Bounds | undefined {
        return this.bounds.find((b) => {
            return b.displayId === displayId;
        });
    }

}
