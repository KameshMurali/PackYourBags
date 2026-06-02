export type LocalAccount = {
  name: string;
  email: string;
};

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

const ACCOUNT_KEY = "packyourbags.account";
const SESSION_KEY = "packyourbags.session";
const TRIP_KEY = "packyourbags.latest-trip";
const ITINERARY_KEY = "packyourbags.latest-itinerary";

export function createLocalAccount(account: LocalAccount) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
  localStorage.setItem(SESSION_KEY, account.email);
}

export function signInLocally(email: string) {
  const account = getLocalAccount();

  if (!account || account.email.toLowerCase() !== email.toLowerCase()) {
    return false;
  }

  localStorage.setItem(SESSION_KEY, account.email);
  return true;
}

export function getLocalAccount(): LocalAccount | null {
  const storedAccount = localStorage.getItem(ACCOUNT_KEY);

  if (!storedAccount) {
    return null;
  }

  try {
    return JSON.parse(storedAccount) as LocalAccount;
  } catch {
    localStorage.removeItem(ACCOUNT_KEY);
    return null;
  }
}

export function getSignedInAccount() {
  const account = getLocalAccount();
  const sessionEmail = localStorage.getItem(SESSION_KEY);

  return account && account.email === sessionEmail ? account : null;
}

export function signOutLocally() {
  localStorage.removeItem(SESSION_KEY);
}

export function saveTripDraft(trip: TripDraft) {
  localStorage.setItem(TRIP_KEY, JSON.stringify(trip));
}

export function getLatestTripDraft(): TripDraft | null {
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
  localStorage.setItem(ITINERARY_KEY, JSON.stringify(itinerary));
}

export function getLatestGeneratedItinerary(): GeneratedItinerary | null {
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

export function generateLocalItinerary(prompt: string): GeneratedItinerary {
  const normalizedPrompt = prompt.toLowerCase();
  const destination = extractDestination(prompt);
  const requestedDays = Number(normalizedPrompt.match(/(\d+)[-\s]day/)?.[1] ?? 4);
  const dayCount = Math.min(Math.max(requestedDays, 3), 7);
  const isBeach = includesAny(normalizedPrompt, ["beach", "coast", "island", "sea"]);
  const isFood = includesAny(normalizedPrompt, ["food", "restaurant", "cuisine", "local"]);
  const isRemote = includesAny(normalizedPrompt, ["remote", "work", "laptop"]);
  const isLuxury = includesAny(normalizedPrompt, ["luxury", "design hotel", "anniversary", "boutique"]);
  const themes = [
    {
      title: "Arrival and an easy first evening",
      plan: `Check in, take a gentle neighbourhood walk, and settle into ${isLuxury ? "a design-led stay" : "a comfortable central stay"}.`,
    },
    {
      title: isFood ? "Markets, local tables, and a slow afternoon" : "A local neighbourhood day",
      plan: isFood
        ? "Start with a market visit, save room for a regional lunch, and keep dinner flexible for a local favourite."
        : "Explore one characterful district, add a relaxed cafe stop, and keep the evening unhurried.",
    },
    {
      title: isBeach ? "A quiet day by the water" : "The signature experience",
      plan: isBeach
        ? "Choose a calm stretch of coast, book a late lunch nearby, and leave space for sunset."
        : "Reserve the trip's must-do experience, then balance it with a low-key afternoon and an easy dinner.",
    },
    {
      title: isRemote ? "A work-friendly reset" : "A flexible discovery day",
      plan: isRemote
        ? "Use a laptop-friendly morning base, finish work early, and keep the late afternoon for one nearby highlight."
        : "Pick one saved shortlist option in the morning and keep the afternoon open for spontaneous finds.",
    },
    {
      title: "A polished final day",
      plan: "Revisit a favourite area, collect any last recommendations, and leave a comfortable buffer before departure.",
    },
  ];

  const days = Array.from({ length: dayCount }, (_, index) => ({
    day: index + 1,
    ...themes[Math.min(index, themes.length - 1)],
  }));

  return {
    destination,
    summary: `${dayCount} days shaped around ${isLuxury ? "a refined, slower pace" : "a balanced pace"}${isFood ? ", local food" : ""}${isBeach ? ", time by the water" : ""}${isRemote ? ", and a work-friendly rhythm" : ""}.`,
    days,
  };
}

function extractDestination(prompt: string) {
  const match = prompt.match(/\b(?:in|to|around)\s+([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)?)/);
  return match?.[1] ?? "Your concierge escape";
}

function includesAny(value: string, options: string[]) {
  return options.some((option) => value.includes(option));
}
