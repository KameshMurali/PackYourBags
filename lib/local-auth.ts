// Browser-local storage for trip drafts and generated itineraries.
//
// Account/session identity has moved to Auth.js (see auth.ts / auth.config.ts).
// Only the trip + itinerary data below still lives in this browser's
// localStorage — intentionally, so drafts stay device-local.

export type TripDraft = {
  destination: string;
  dates: string;
  travellers: string;
  mood: string;
  notes: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  plan: string;
};

export type GeneratedItinerary = {
  destination: string;
  summary: string;
  days: ItineraryDay[];
};

const TRIP_KEY = "packyourbags.latest-trip";
const ITINERARY_KEY = "packyourbags.latest-itinerary";

function storageAvailable() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function saveTripDraft(trip: TripDraft) {
  if (!storageAvailable()) {
    return;
  }

  localStorage.setItem(TRIP_KEY, JSON.stringify(trip));
}

export function getLatestTripDraft(): TripDraft | null {
  if (!storageAvailable()) {
    return null;
  }

  const storedTrip = localStorage.getItem(TRIP_KEY);

  if (!storedTrip) {
    return null;
  }

  try {
    return JSON.parse(storedTrip) as TripDraft;
  } catch {
    localStorage.removeItem(TRIP_KEY);
    return null;
  }
}

export function saveGeneratedItinerary(itinerary: GeneratedItinerary) {
  if (!storageAvailable()) {
    return;
  }

  localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary));
}

export function getLatestGeneratedItinerary(): GeneratedItinerary | null {
  if (!storageAvailable()) {
    return null;
  }

  const storedItinerary = localStorage.getItem(ITINERARY_KEY);

  if (!storedItinerary) {
    return null;
  }

  try {
    return JSON.parse(storedItinerary) as GeneratedItinerary;
  } catch {
    localStorage.removeItem(ITINERARY_KEY);
    return null;
  }
}
