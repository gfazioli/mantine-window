# Mantine Window Component

<img alt="Mantine Window" src="https://github.com/gfazioli/mantine-window/blob/master/logo.jpeg" />

<div align="center">
  
  [![NPM version](https://img.shields.io/npm/v/%40gfazioli%2Fmantine-window?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  [![NPM Downloads](https://img.shields.io/npm/dm/%40gfazioli%2Fmantine-window?style=for-the-badge)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  [![NPM Downloads](https://img.shields.io/npm/dy/%40gfazioli%2Fmantine-window?style=for-the-badge&label=%20&color=f90)](https://www.npmjs.com/package/@gfazioli/mantine-window)
  ![NPM License](https://img.shields.io/npm/l/%40gfazioli%2Fmantine-window?style=for-the-badge)

---

[<kbd> <br/> ❤️ If this component has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

## Overview

This component is created on top of the [Mantine](https://mantine.dev/) library.
It requires **Mantine 9.x** and **React 19**.

[Mantine Window](https://gfazioli.github.io/mantine-window/) is a versatile UI container that brings a familiar desktop‑like window experience to React applications built with Mantine.

## Features

- Draggable and resizable floating windows with 8-direction resize handles
- Portal or container-relative positioning (`withinPortal`)
- Controlled and uncontrolled position/size with mixed unit support (px, vw/vh, %)
- Responsive values via Mantine breakpoints for all dimension props
- Persistent state via localStorage (position, size, collapse state)
- Configurable drag boundaries to constrain movement
- Min/max size constraints with multi-unit support
- Collapsible content with double-click header toggle
- Z-index management with bring-to-front on interaction
- `Window.Group` compound component for coordinated multi-window management
- Layout presets: snap, tile, columns, rows, fill
- Full Mantine Styles API support with fine-grained classNames
- SSR-safe with hydration-compatible viewport unit resolution
- `onPositionChange` and `onSizeChange` callbacks

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
    <Window title="Hello World" opened defaultX={50} defaultY={50} defaultWidth={400} defaultHeight={300}>
      <Title order={4}>This is a window</Title>
    </Window>
  );
}
```
## Sponsor

<div align="center">

[<kbd> <br/> ❤️ If this component has been useful to you or your team, please consider becoming a sponsor <br/> </kbd>](https://github.com/sponsors/gfazioli?o=esc)

</div>

Your support helps me:

- Keep the project actively maintained with timely bug fixes and security updates	
- Add new features, improve performance, and refine the developer experience	
- Expand test coverage and documentation for smoother adoption	
- Ensure long‑term sustainability without relying on ad hoc free time	
- Prioritize community requests and roadmap items that matter most

Open source thrives when those who benefit can give back—even a small monthly contribution makes a real difference. Sponsorships help cover maintenance time, infrastructure, and the countless invisible tasks that keep a project healthy.

Your help truly matters.

💚 [Become a sponsor](https://github.com/sponsors/gfazioli?o=esc) today and help me keep this project reliable, up‑to‑date, and growing for everyone.

---
https://github.com/user-attachments/assets/7f80b2c0-90b1-442f-82c8-fddb75cca14e

---
[![Star History Chart](https://api.star-history.com/svg?repos=gfazioli/mantine-window&type=Timeline)](https://www.star-history.com/#gfazioli/mantine-window&Timeline)
