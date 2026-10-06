// Registry of verified datasets, keyed by passport (ISO 3166-1 alpha-2).
// A passport with an empty dataset is listed but shown as "coming soon".

import type { DestinationRule } from "../types";
import { EGYPT_DESTINATIONS } from "./eg";
import { INDIA_DESTINATIONS } from "./in";
import { NIGERIA_DESTINATIONS } from "./ng";
import { PHILIPPINES_DESTINATIONS } from "./ph";
import { PAKISTAN_DESTINATIONS } from "./pk";

export const DATASETS: Readonly<Record<string, readonly DestinationRule[]>> = {
  IN: INDIA_DESTINATIONS,
  PK: PAKISTAN_DESTINATIONS,
  PH: PHILIPPINES_DESTINATIONS,
  NG: NIGERIA_DESTINATIONS,
  EG: EGYPT_DESTINATIONS,
};
