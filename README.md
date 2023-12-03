# YouTube Alternative Switch

A Firefox extension for quickly switching between YouTube, Piped, and Invidious when watching a video.

## Keyboard Shortcuts

- `Ctrl+Alt+Y` - Switch to YouTube.
- `Ctrl+Alt+P` - Switch to Piped.
- `Ctrl+Alt+I` - Switch to Invidious.

The keyboard shortcuts can be changed in `about:addons` -> Manage Extension Shortcuts.

## Packaging

CD to `src` and run:

```bash
zip -r -FS ../youtube-alternative-switch.xpi *
```

## Acknowledgements

- [PipedSwitch](https://github.com/AnkhSquirrel/PipedSwitch) for showing how to create a context menu that switches between URLs.
