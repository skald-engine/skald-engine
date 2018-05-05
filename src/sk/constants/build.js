// Injected on the building process
/** Skald engine version (we use semantic version). */
export const VERSION = process.env.VERSION

// Injected on the building process
/** Build date of the library. */
export const BUILD_DATE = process.env.DATE

// Injected on the building process
/** Revision of the build (we use the current commit of git). */
export const REVISION = process.env.REVISION

/** Version of the PixiJS. */
export const PIXI_VERSION = PIXI.VERSION