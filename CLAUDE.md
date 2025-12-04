# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native Awesome Gallery is a React Native image gallery component powered by Reanimated v3 and react-native-gesture-handler. It provides zoom, pan, and swipe gestures with native iOS-like feeling, RTL support, and infinite loop capabilities.

## Key Dependencies

- **react-native-reanimated**: Version 3.2.0+ required. All animations and gesture handling use Reanimated's worklet system.
- **react-native-gesture-handler**: Version 2.0.0+ required. Handles all user gestures (pinch, pan, tap, double-tap, long-press).

## Build and Development Commands

```sh
# Install dependencies (includes example app)
yarn

# Bootstrap entire project (install + pods)
yarn bootstrap

# Build library (compiles to lib/ directory)
yarn prepare

# Type checking
yarn typescript

# Linting
yarn lint
yarn lint --fix

# Testing
yarn test

# Example app commands
yarn example start    # Start Metro bundler
yarn example android  # Run on Android
yarn example ios      # Run on iOS

# iOS pods (example app)
yarn pods
```

## Architecture

### Single-File Component Structure

The entire gallery implementation is in [src/index.tsx](src/index.tsx). This ~1100 line file contains:

- `ResizableImage`: The core component handling individual images with zoom/pan gestures
- `GalleryComponent`: The main gallery wrapper managing multiple images and horizontal scrolling
- `Gallery`: The exported forwardRef wrapper with TypeScript generics

### Reanimated Worklet System

All gesture handlers and animations run on the UI thread using Reanimated worklets (functions marked with `'worklet'`). Key patterns:

- `useSharedValue`: For values that drive animations
- `useAnimatedReaction`: For side effects based on shared values
- `runOnJS`: To call JavaScript functions from worklets
- Custom animations: [src/utils/withDecaySpring.ts](src/utils/withDecaySpring.ts) implements a custom decay-to-spring animation using `defineAnimation`

### Gesture Architecture

Gestures are composed using the `Gesture` API from react-native-gesture-handler:

```typescript
Gesture.Race(
  Gesture.Simultaneous(longPressGesture, Gesture.Race(panGesture, pinchGesture)),
  Gesture.Exclusive(doubleTapGesture, tapGesture)
)
```

This structure ensures:
- Long press can detect during pan/pinch
- Pan and pinch race against each other
- Double-tap takes priority over single tap

### Coordinate System and Transforms

The gallery uses a transform-based positioning system:

- Each image is positioned absolutely using `translateX` based on its index
- RTL support is handled by inverting translateX values when `I18nManager.isRTL` is true
- Zoom is implemented using scale transforms with focal point calculations
- `getPosition()` and `getIndexFromPosition()` convert between index and X coordinates

### Loop Mode Implementation

Loop mode allows infinite scrolling by:
1. Rendering images outside the visible range based on `numToRender`
2. Detecting when scroll crosses boundaries (index -1 or length)
3. Instantly repositioning `translateX` and `currentIndex` to create the illusion of continuity
4. Resetting adjacent images when they're far from the current index

### Utilities

- [src/utils/clamping.ts](src/utils/clamping.ts): `clamp`, `rubberBandClamp`, `withRubberBandClamp` for boundary effects
- [src/utils/withDecaySpring.ts](src/utils/withDecaySpring.ts): Custom animation combining decay and spring for smooth pan gestures
- [src/utils/image.ts](src/utils/image.ts): Image resizing calculations to fit container dimensions

## TypeScript Build Configuration

The library uses `react-native-builder-bob` to generate three output formats:
- CommonJS: `lib/commonjs/`
- ES Module: `lib/module/`
- TypeScript declarations: `lib/typescript/`

Build configuration is in [package.json](package.json) under `react-native-builder-bob`. The `prepare` script runs automatically before publishing.

## Testing

Tests use Jest with React Native preset. Configuration in [package.json](package.json):
- Ignores `example/node_modules` and `lib/`
- Currently minimal test coverage (only utility tests in [src/utils/__tests__/](src/utils/__tests__/))

## Code Style

ESLint + Prettier configured in [package.json](package.json):
- Single quotes
- 2-space indentation
- Trailing commas (ES5)
- Follows @react-native-community config

Pre-commit hooks (via Husky) run `yarn lint && yarn typescript` before commits.

## Commit Convention

Uses conventional commits (enforced by commitlint):
- `feat:` new features
- `fix:` bug fixes
- `refactor:` code refactoring
- `docs:` documentation changes
- `test:` test additions/updates
- `chore:` tooling changes

## Important Implementation Details

### Image Dimension Handling

The gallery requires image dimensions to calculate scale/pan limits. The `setImageDimensions` callback must be called after loading images. The default `renderItem` does this automatically with `Image.onLoad`, but custom renderers must call it manually.

### Gesture State Management

- `isActive`: Derived value checking if this image is the current one (prevents gestures on off-screen images)
- `isVertical`: Detected at pan start to differentiate vertical swipe-to-close from horizontal swipe
- `scale`: Current zoom level, used throughout to calculate bounds and enable/disable transitions
- `offset` and `translation`: Separate vectors for persistent offset and current gesture translation

### Performance Considerations

- Only `numToRender` (default 5) images are rendered at once
- Images reset their scale/translation when 2 indices away from current
- Adjacent images can be hidden when scaled (`hideAdjacentImagesOnScaledImage` prop)

## Example App

Located in [example/](example/). Uses Expo with expo-image for optimized image rendering. Shows basic usage, toolbar integration, and loop mode examples.
