//      

const App = require('node-sdl2/lib/app');
const Window = require('node-sdl2/lib/window');
const Image = require('sdl2-image').class('image');
const ref = require('ref');
const { keepOnTop } = require('@bunchtogether/picture-in-picture');
/**
 * Create a window on the desktop containing an image that closes when clicked or the return callback is executed.
 *
 * @param {string} src - Path to image file
 * @param {number} x - X coordinate at which to place the image button
 * @param {number} y - Y coordinate at which to place the image button
 * @param {Function} callback - Callback called when the image button is clicked or closed by the returned function
 * @returns {Function} - Close the desktop window button
 */
const openDesktopWindowButton = (src        , x       , y       , callback           ) => {
  const app = new App();
  const image = new Image(src);
  const { w, h } = ref.deref(image._surface); // eslint-disable-line no-underscore-dangle
  const win = new Window({
    w,
    h,
    x,
    y,
    closable: false,
    resizable: false,
    borderless: true,
  });
  win.render.copy(image.texture(win.render), null, [0, 0, w, h]);
  win.render.present();
  let isClosed = false;
  const close = () => {
    if (isClosed) {
      return;
    }
    isClosed = true;
    app.quit();
    win.destroy();
    callback();
  };
  const handleBeforeQuit = (e      ) => {
    e.preventDefault();
  };
  const handleClose = () => {
    close();
  };
  const handleMouseDown = () => {
    close();
  };
  app.on('before-quit', handleBeforeQuit);
  win.on('close', handleClose);
  win.on('mousedown', handleMouseDown);
  keepOnTop(process.pid, true).catch((error) => {
    console.log(`Keep on top method failed: ${error.message}`);
  });
  return close;
};

module.exports = openDesktopWindowButton;
