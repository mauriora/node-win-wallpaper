'use strict';

class ScreenRectangle {
    left = 0;
    top = 0;
    right = 0;
    bottom = 0;
    originDisplay = null;

    get width() { return this._right - this._left; }
    get height() { return this._bottom - this._top; }

    addDisplay(display) {
        console.log(display)
        const bounds = display.bounds;
        
        if (this.left > bounds.x) {
            this.left = bounds.x;
            originDisplay = display;
        }
        if (this.right < (bounds.x + bounds.width)) {
            this.right = (bounds.x + bounds.width);
        }
        if (this.top > bounds.y) {
            this.top = bounds.y;
        }
        if (this.bottom < (bounds.y + bounds.height)) {
            this.bottom = (bounds.y + bounds.height);
        }
        console.log(`${display.id}: ${display.scaleFactor} * ${bounds.width} * ${bounds.height} @ ${bounds.x},${bounds.y} => ${this.width} * ${this.height} ${JSON.stringify(this)}`);
        return dashboardWindow;
    }
};
