import bindings from 'bindings';
import path from 'path';

var nodeWinWallpaper = /*#__PURE__*/bindings({
  // Workaround for webpack/electronforge shenanigans
  // eslint-disable-next-line @typescript-eslint/camelcase
  module_root: /*#__PURE__*/path.resolve( /*#__PURE__*/path.join(__dirname, '../')),
  bindings: 'node-win-wallpaper' // eslint-disable-next-line @typescript-eslint/no-explicit-any

});
var index = {
  moveWindow: function moveWindow(handle, _ref) {
    var x = _ref.x,
        y = _ref.y,
        width = _ref.width,
        height = _ref.height;
    return nodeWinWallpaper.moveWindow(handle, x, y, width, height);
  },
  attachWindow: function attachWindow(handle) {
    return nodeWinWallpaper.attachWindow(handle);
  }
};

export default index;
//# sourceMappingURL=node-win-wallpaper.esm.js.map
