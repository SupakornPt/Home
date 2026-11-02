/** Opening video served from /public */
export const OPENING_VIDEO_SRC = "/video_opening.mp4";

/** Mock catalog (swap for live API via env in lib/api) */
export const PROPERTIES_DATA_PATH = "/data/properties.json";

/** House GLB models under /public/models/houses */
export const HOUSE_MODELS = {
  tropical: "/models/houses/tropical-house.glb",
  modern: "/models/houses/modern-house.glb",
  courtyard: "/models/houses/courtyard-house.glb",
} as const;

export const HOUSE_MODEL_URLS = Object.values(HOUSE_MODELS);