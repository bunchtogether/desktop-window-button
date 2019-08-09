// @flow

const path = require('path');
const openDesktopWindowButton = require('../src');

jest.setTimeout(30000);

test('Should display a button on the desktop', async () => {
  const src = path.resolve(__dirname, 'files', 'fruits.png');
  const closeDesktopWindowButtonA = await openDesktopWindowButton(src, 0, 0, () => console.log('Close top left'), 'top left');
  const closeDesktopWindowButtonB = await openDesktopWindowButton(src, 0, 0, () => console.log('Close top right'), 'top right');
  const closeDesktopWindowButtonC = await openDesktopWindowButton(src, 0, 0, () => console.log('Close bottom right'), 'bottom right');
  const closeDesktopWindowButtonD = await openDesktopWindowButton(src, 0, 0, () => console.log('Close bottom left'), 'bottom left');
  await new Promise((resolve) => setTimeout(resolve, 3000));
  closeDesktopWindowButtonA();
  closeDesktopWindowButtonB();
  closeDesktopWindowButtonC();
  closeDesktopWindowButtonD();
});

