# Player Enhancer for YouTube

[![Create Release](https://github.com/fiahfy/youtube-player-enhancer/actions/workflows/create-release.yml/badge.svg)](https://github.com/fiahfy/youtube-player-enhancer/actions/workflows/create-release.yml)

> Chrome extension that enhances the YouTube player experience.

## Features

- Adds skip controls to the player control bar.
- Adds a reload button to the live chat menu.
- Prevents the page from scrolling when clicking timestamps.
- Automatically opens the live chat when it is closed.
- Automatically closes polls in the live chat.

## Screenshots

![screenshot](.github/img/screenshot1.png)
![screenshot](.github/img/screenshot2.png)

## Installation

1. Download `dist.zip` from [releases page](https://github.com/fiahfy/youtube-player-enhancer/releases) and unzip this file.
2. Open the Extension Management page by navigating to `chrome://extensions`.
3. Enable Developer Mode by clicking the toggle switch next to **Developer mode**.
4. Click the **LOAD UNPACKED** button and select the unpacked directory named `dist`.

## Development

```bash
# install dependencies
yarn

# watch files changed and reload extension
yarn dev
```
