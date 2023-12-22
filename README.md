# YouTube Alternative Switch

A Firefox extension for quickly switching between YouTube, Piped, Invidious and Chat Replay when watching a video.

## How to Use

The context menu (accessed by right clicking) and keyboard shortcuts will only work on URLs starting with (by default):

- `https://youtube.com/watch?v=`
- `https://piped.video/watch?v=`
- `https://yewtu.be/watch?v=`
- `https://chatreplay.stream/videos/`

The Piped and Invidious URLs can be changed in `about:addons` -> YouTube Alternative Switch -> Preferences.

### Keyboard Shortcuts

- `Ctrl+Alt+Y` - Switch to YouTube.
- `Ctrl+Alt+P` - Switch to Piped.
- `Ctrl+Alt+I` - Switch to Invidious.
- `Ctrl+Alt+C` - Switch to Chat Replay.

The keyboard shortcuts can be changed in `about:addons` -> Manage Extension Shortcuts.

## Developing

To install the dev dependencies:

```bash
pnpm install
```

## Building

CD to `src` and run:

```bash
web-ext build -n youtube-alternative-switch.xpi
```

## Acknowledgements

- [PipedSwitch](https://github.com/AnkhSquirrel/PipedSwitch) for showing how to create a context menu that switches between URLs.
- [Remix Icon](https://remixicon.com/) for the icons.
