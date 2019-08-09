//      

const App = require('node-sdl2/lib/app');
const Window = require('node-sdl2/lib/window');
const Image = require('sdl2-image').class('image');
const ref = require('ref');
const { keepOnTop, getScreenDimensions } = require('@bunchtogether/picture-in-picture');
const { addShutdownHandler } = require('@bunchtogether/exit-handler');

let app;
let dimensions;

const shutdown = async () => {
  if (app) {
    app.quit();
  }
};

addShutdownHandler(shutdown, (error      ) => {
  console.log('Error shutting down desktop window button app');
  console.error(error);
});

/**
 * Create a window on the desktop containing an image that closes when clicked or the return callback is executed.
 *
 * @param {string} src - Path to image file
 * @param {number} x - X coordinate at which to place the image button
 * @param {number} y - Y coordinate at which to place the image button
 * @param {Function} callback - Callback called when the image button is clicked or closed by the returned function
 * @returns {Function} - Close the desktop window button
 */
const openDesktopWindowButton = async (src        , x       , y       , callback           , alignment         = 'top left') => {
  if (!app) {
    app = new App();
  }
  const image = new Image(src);
  const { w, h } = ref.deref(image._surface); // eslint-disable-line no-underscore-dangle
  const width = Math.floor(w / 2);
  const height = Math.floor(h / 2);
  let adjustedX = x;
  let adjustedY = y;
  if (alignment.indexOf('bottom') !== -1) {
    if (!dimensions) {
      dimensions = await getScreenDimensions();
    }
    adjustedY = dimensions[1] - y - height;
  }
  if (alignment.indexOf('right') !== -1) {
    if (!dimensions) {
      dimensions = await getScreenDimensions();
    }
    adjustedX = dimensions[0] - x - width;
  }
  const win = new Window({
    w: width,
    h: height,
    x: adjustedX,
    y: adjustedY,
    closable: false,
    resizable: false,
    borderless: true,
    mouseCapture: true,
  });
  win.render.copy(image.texture(win.render), null, [0, 0, width, height]);
  win.render.present();
  let isClosed = false;
  const close = () => {
    if (isClosed) {
      return;
    }
    isClosed = true;
    win.destroy();
    callback();
  };
  const handleBeforeQuit = (e      ) => {
    e.preventDefault();
    app.removeListener('before-quit', handleBeforeQuit);
    win.removeListener('close', handleClose);
    win.removeListener('mousedown', handleMouseDown);
    win.removeListener('mouseup', handleMouseUp);
    win.removeListener('focus', handleFocus);
  };
  const handleClose = () => {
    close();
  };
  const handleFocus = () => {
    close();
  };
  const handleMouseDown = () => {
    close();
  };
  const handleMouseUp = () => {
    close();
  };
  app.on('before-quit', handleBeforeQuit);
  win.on('close', handleClose);
  win.on('mousedown', handleMouseDown);
  win.on('mouseup', handleMouseUp);
  win.on('focus', handleFocus);
  await keepOnTop(process.pid, true);
  return close;
};

module.exports = openDesktopWindowButton;
