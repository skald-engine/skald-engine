# CHANGELOG

## 2.0.0-alpha.1

- Rewriting the whole engine with new architecture.
  Now Skald uses an arquitecture based on IoC for dependency management and signals 
  for events.


## 1.0.0-alpha.4

- Adding a pool manager on game.
- Changing all events in engine to use event pool.
- Rewriting all ECS/EventSheet/Scene objects for simplification.
- Adding Task object (and rewriting tween to be a subclass).
- Scene now have tasks and timeout functions.


## 1.0.0-alpha.3

- Adding color utility functions.
- Adding random utility functions.
- Adding easing modifiers.
- Adding gaussian and bell curve easings.
- Adding particle system.
- Adding startScene and preloadScene on config.
- Adding a default preload scene.
- Adding a scene stack in the scenes manager.
- Removing manifest parameter from game (using inside of config now).


## 1.0.0-alpha.2

Lot of things fixed and adjusted to follow a better pattern.

- Adding Tween and tween handling at scenes.
- Adding scene transitions.
- All events renamed for a better descriptive name.
- Gamepad and touch now send events.
- Game core now works with scenes and ECS.
- Added declarators `scene`, `entity`, `component`, `system`, ... 
- Adding feature tests.
- Adding unit tests.
- Lot of other modifications, including starting the changelog.


## 1.0.0-alpha.1

- First rewritten version of Skald.