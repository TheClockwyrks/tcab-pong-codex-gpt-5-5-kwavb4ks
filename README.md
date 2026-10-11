# Carom

Carom is a top-down paddle duel for the browser. Two paddles trade a glowing
ball across a dark field while rotating, swaying obstacles turn every rally into
a bank-shot puzzle. Moving as you strike adds spin, bending the ball after
contact and making sharp recoveries possible.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game locally and reloads as source files change.

## Production Build

```sh
npm run build
```

The static site is emitted to `dist/`, with `dist/index.html` as the entry point.

## Controls

- `W` / `S`: move player one.
- `ArrowUp` / `ArrowDown`: move player two in Versus; also move player one in
  Solo.
- `Enter` or `Space`: confirm menu items.
- `P` or `Escape`: pause and resume a match.
- `Escape`: back out of menus.
- `M`: mute or unmute audio.

## Checks

```sh
npm run typecheck
npm run lint
npm run format
npm test
```
