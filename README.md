# YouTube Alternative Switch

A Firefox extension for quickly switching videos between YouTube, Piped, Invidious and Chat Replay.

[addons.mozilla.org/en-US/firefox/addon/youtube-alternative-switch/](https://addons.mozilla.org/en-US/firefox/addon/youtube-alternative-switch/)

## Features

The features described here will only work on YouTube, Piped (default is [piped.video](https://piped.video)), Invidious (default is [yewtu.be](https://yewtu.be)), and Chat Replay.

- Right click a web page while watching a video to reveal a context menu that allows you to; open the video in an alternative front-end while replacing the current tab, or open the video in an alternative front-end while creating a new tab.
- Right click a video link (e.g. YouTube thumbnail) to choose an alternative front-end to open the video in (creates a new tab).

The Piped and Invidious instances can be configured `about:addons` -> YouTube Alternative Switch -> Preferences.

## Keyboard Shortcuts

The keyboard shortcuts will only work while watching a video on YouTube, Piped, Invidious, or Chat Replay.

### Create New Tab

- `Ctrl+Alt+Y` - Open Current Tab in New YouTube Tab.
- `Ctrl+Alt+P` - Open Current Tab in New Piped Tab.
- `Ctrl+Alt+I` - Open Current Tab in New Invidious Tab.
- `Ctrl+Alt+C` - Open Current Tab in New Chat Replay Tab.

### Replace Current Tab

- `Shift+Alt+Y` - Switch Current Tab to YouTube.
- `Shift+Alt+P` - Switch Current Tab to Piped.
- `Shift+Alt+I` - Switch Current Tab to Invidious.
- `Shift+Alt+C` - Switch Current Tab to Chat Replay.

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
