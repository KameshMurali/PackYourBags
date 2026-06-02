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
