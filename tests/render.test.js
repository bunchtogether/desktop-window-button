// @flow

const path = require('path');
const openDesktopWindowButton = require('../src');

jest.setTimeout(30000);

test('Should display a button on the desktop', async () => {
  const src = path.resolve(__dirname, 'files', 'fruits.png');
  const closeDesktopWindowButton = openDesktopWindowButton(src, 0, 0, () => console.log('Close'));
  await new Promise((resolve) => setTimeout(resolve, 3000));
  closeDesktopWindowButton();
});

