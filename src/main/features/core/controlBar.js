Emitter.on('window:minimize', (event, windowID) => {
  WindowManager.getByInternalID(windowID).minimize();
});

Emitter.on('window:maximize', (event, windowID) => {
  const window = WindowManager.getByInternalID(windowID);

  if (process.platform === 'darwin') {
    if (window.isFullScreen()) {
      window.setFullScreen(false);
    } else {
      window.setFullScreen(true);
    }
  } else {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

Emitter.on('window:close', (event, windowID) => {
  WindowManager.getByInternalID(windowID).close();
});

const mainWindow = WindowManager.getAll('main')[0];
mainWindow.on('close', (event) => {
  if ((Settings.get('minToTray', true) || process.platform === 'darwin') && !global.quiting) {
    if (process.platform !== 'darwin') {
      mainWindow.minimize();
      mainWindow.setSkipTaskbar(true);
    } else {
      if (PlaybackAPI.isPlaying()) {
        Emitter.sendToGooglePlayMusic('playback:playPause');
      }
      mainWindow.hide();
    }
    event.preventDefault();
    return;
  }
});
