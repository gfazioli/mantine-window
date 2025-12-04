# Mantine Window Component

<img width="1376" height="768" alt="Gemini_Generated_Image_hr8hs4hr8hs4hr8h" src="https://github.com/user-attachments/assets/159a1cf3-b3aa-4eed-9586-c63af9974cac" />

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-window?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-window?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-window?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-window?style=for-the-badge)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.

[![Mantine UI Library](https://img.shields.io/badge/-MANTINE_UI_LIBRARY-blue?style=for-the-badge&labelColor=black&logo=mantine
)](https://mantine.dev/)

A fully-featured floating window component for Mantine applications. Provides draggable windows with customizable drag modes (header-only, full-window, or both), 8-directional resizing (top, right, bottom, left, and corners), collapsible content with smooth animations, and persistent state management via localStorage. Configure initial position, size constraints (min/max width/height), drag boundaries, and control interaction modes (none, vertical, horizontal, or both for resizing). Includes z-index management for multi-window scenarios, close/collapse buttons, and event callbacks for position and size changes. Perfect for building desktop-like interfaces, modals, tool panels, and floating widgets.

[![Mantine Extensions](https://img.shields.io/badge/-Watch_the_Video-blue?style=for-the-badge&labelColor=black&logo=youtube
)](https://www.youtube.com/playlist?list=PL85tTROKkZrWyqCcmNCdWajpx05-cTal4)
[![Demo and Documentation](https://img.shields.io/badge/-Demo_%26_Documentation-blue?style=for-the-badge&labelColor=black&logo=typescript
)](https://gfazioli.github.io/mantine-window/)
[![Mantine Extensions HUB](https://img.shields.io/badge/-Mantine_Extensions_Hub-blue?style=for-the-badge&labelColor=blue
)](https://mantine-extensions.vercel.app/)


👉 You can find more components on the [Mantine Extensions Hub](https://mantine-extensions.vercel.app/) library.

## Installation

```sh
npm install @gfazioli/mantine-window
```
or 

```sh
yarn add @gfazioli/mantine-window
```

After installation import package styles at the root of your application:

```tsx
import '@gfazioli/mantine-window/styles.css';
```

## Usage

```tsx
import { Window } from '@gfazioli/mantine-window';
import { Title } from '@mantine/core';

function Demo() {
  return (
    <Stack>
      <Window title="Hello World" opened>
        <Title order={4}>This is a window</Title>
      </Window>
    </Stack>
  );
}
```

<div align="center">
  
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-window&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-window&Timeline)

---
<div align="center">

https://github.com/user-attachments/assets/7f80b2c0-90b1-442f-82c8-fddb75cca14e

</div>

</div>
