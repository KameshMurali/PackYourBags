// Registry of verified datasets, keyed by passport (ISO 3166-1 alpha-2).
// A passport with an empty dataset is listed but shown as "coming soon".

import type { DestinationRule } from "../types";
import { EGYPT_DESTINATIONS } from "./eg";
import { UNITED_KINGDOM_DESTINATIONS } from "./gb";
import { INDIA_DESTINATIONS } from "./in";
import { INDIA_EXTRA_DESTINATIONS } from "./in-extra";
import { ITALY_DESTINATIONS } from "./it";
import { NIGERIA_DESTINATIONS } from "./ng";
import { PHILIPPINES_DESTINATIONS } from "./ph";
import { PAKISTAN_DESTINATIONS } from "./pk";
import { UNITED_STATES_DESTINATIONS } from "./us";

export const DATASETS: Readonly<Record<string, readonly DestinationRule[]>> = {
  IN: [...INDIA_DESTINATIONS, ...INDIA_EXTRA_DESTINATIONS],
  PK: PAKISTAN_DESTINATIONS,
  PH: PHILIPPINES_DESTINATIONS,
  NG: NIGERIA_DESTINATIONS,
  EG: EGYPT_DESTINATIONS,
  GB: UNITED_KINGDOM_DESTINATIONS,
  US: UNITED_STATES_DESTINATIONS,
  IT: ITALY_DESTINATIONS,
};
