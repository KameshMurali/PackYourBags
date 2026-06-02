export type LocalAccount = {
  name: string;
  email: string;
};

const ACCOUNT_KEY = "packyourbags.account";
const SESSION_KEY = "packyourbags.session";

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
