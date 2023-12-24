# YouTube Alternative Switch

A Firefox extension for quickly switching videos between YouTube, Piped, Invidious and Chat Replay.

## How to Use

The following will only work on YouTube, Piped, Invidious, or Chat Replay:

- Right click a video (link) to open the context menu and choose an alternative website to open the video in (creates a new tab).
- Right click the web page while watching a video to open the context menu and choose an alternative website to open the video in (replaces current tab).

The Piped and Invidious instances can be configured `about:addons` -> YouTube Alternative Switch -> Preferences.

### Keyboard Shortcuts

The following will only work while watching a video on YouTube, Piped, Invidious, or Chat Replay:

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
web-ext build --overwrite-dest -n youtube-alternative-switch.xpi
```

## Acknowledgements

- [PipedSwitch](https://github.com/AnkhSquirrel/PipedSwitch) for showing how to create a context menu that switches between URLs.
- [Remix Icon](https://remixicon.com/) for the icons.
