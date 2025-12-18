# Mantine Window Component

<img width="2752" height="1536" alt="Mantine Window" src="https://github.com/user-attachments/assets/398a2a91-34d2-4819-a10a-791057e5b2ef" />

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-window?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-window?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-window?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-window?style=for-the-badge)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.

[Mantine Window](https://gfazioli.github.io/mantine-window/) is a versatile UI container that brings a familiar desktop‑like window experience to React applications built with Mantine. 

You can render windows in a portal for fixed, scroll‑independent overlays, or constrain them to a specific parent by setting withinPortal to false and using a relative container. The component supports both uncontrolled defaults (position and size) and controlled visibility via opened/onClose, plus optional drag boundaries to keep windows within prescribed X/Y ranges. 

For state continuity, it can persist position and size to localStorage, and it exposes onPositionChange and onSizeChange callbacks for reacting to user interactions. The window’s behavior and chrome are configurable—draggable and resizable modes, collapse/close buttons, non‑collapsible headers, and centered, immovable presets—while appearance is tailored through Mantine’s Styles API with fine‑grained classNames for internal elements. Together, these features make it a robust foundation for modals, tools, and embedded UI panels in complex interfaces.

> [!note]
>
> → [Demo and Documentation](https://gfazioli.github.io/mantine-window/) → [Youtube Video](https://www.youtube.com/playlist?list=PL85tTROKkZrWyqCcmNCdWajpx05-cTal4) → [More Mantine Components](https://mantine-extensions.vercel.app/)

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
---
https://github.com/user-attachments/assets/7f80b2c0-90b1-442f-82c8-fddb75cca14e

---
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-window&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-window&Timeline)
