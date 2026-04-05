/** Game balance and layout constants (Sprint 01). */

/** Phaser canvas size (must match page wrapper aspect). */
export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 640;

export const TILE_SIZE = 32;

export const YARD_WIDTH = 30;
export const YARD_HEIGHT = 20;

export const CHICKEN_SPEED = 40;

/** Milliseconds between egg spawns from the chicken. */
export const EGG_SPAWN_INTERVAL = 15_000;

export const EGG_COLLECT_SCORE = 1;

/** Milliseconds between chicken direction changes. */
export const CHICKEN_DIRECTION_CHANGE_INTERVAL = 3000;

/** Camera pan speed (world units per second) for keyboard movement. */
export const CAMERA_PAN_SPEED = 220;

/** Mouse wheel zoom step per wheel tick. */
export const CAMERA_ZOOM_STEP = 0.1;

export const CAMERA_ZOOM_MIN = 0.5;
export const CAMERA_ZOOM_MAX = 2;

/** Chance (0–1) to idle instead of picking a new walk direction. */
export const CHICKEN_IDLE_PROBABILITY = 0.4;

/** Bob animation phase speed (radians per ms, scaled in Chicken). */
export const CHICKEN_BOB_PHASE_SPEED = 0.012;

/** Bob vertical offset amplitude (pixels). */
export const CHICKEN_BOB_AMPLITUDE = 2;

/** Scale-in duration when an egg appears at the chicken. */
export const EGG_APPEAR_TWEEN_MS = 160;

/** Total duration of the collect shrink/grow tween sequence. */
export const EGG_COLLECT_DURATION_MS = 200;

/** Idle float animation for a placed egg. */
export const EGG_FLOAT_DURATION_MS = 900;

/** Vertical bob range for idle egg float (pixels). */
export const EGG_FLOAT_OFFSET_PX = 1;

/** HUD label offset from top-left (screen space). */
export const HUD_OFFSET_X = 12;
export const HUD_OFFSET_Y = 10;

/** HUD stacks above world content. */
export const HUD_DEPTH = 10000;
