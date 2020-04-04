const electron = require('electron');
class ScreenBounds {

  constructor(displays) {
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.originDisplay = null;
    this.displays = displays;
    this.bounds = [];

    if (displays) {
      this.displays.forEach(display => {
        const workArea = electron.screen.dipToScreenRect(null, display.workArea);
        if (this.left > workArea.x) {
          this.left = workArea.x;
          this.originDisplay = display;
        }
        if (this.right < (workArea.x + workArea.width)) {
          this.right = (workArea.x + workArea.width);
        }
        if (this.top > workArea.y) {
          this.top = workArea.y;
        }
        if (this.bottom < (workArea.y + workArea.height)) {
          this.bottom = (workArea.y + workArea.height);
        }
      });
      this.bounds = this.displays.map(display => {
        const dipToScreenRect = electron.screen.dipToScreenRect(null, display.workArea)
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

  get width() {
    return this.right - this.left;
  }

  get height() {
    return this.bottom - this.top;
  }

  findBoundsByDisplayId(displayId) {
    return this.bounds.find(b => b.displayId === displayId);
  }

}

module.exports = ScreenBounds;
