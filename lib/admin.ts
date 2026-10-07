// Edge-safe admin resolution. No node-only imports here so this module can be
// pulled into `auth.config.ts` (and therefore the edge middleware) safely.

// kameshwar.murali@gmail.com is the built-in admin when ADMIN_EMAILS is unset.
const DEFAULT_ADMIN_EMAILS = ["kameshwar.murali@gmail.com"];

export type Role = "admin" | "user";

/**
 * The configured set of admin emails, lowercased. Reads the comma-separated
 * ADMIN_EMAILS env var; falls back to the built-in default when unset/empty.
 */
export function adminEmails(): string[] {
  const configured = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  return configured.length > 0 ? configured : DEFAULT_ADMIN_EMAILS;
}

/** Returns true when the given email should be treated as an admin. */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  return adminEmails().includes(email.toLowerCase());
}

/** Resolves a role from an email address. */
export function roleForEmail(email?: string | null): Role {
  return isAdminEmail(email) ? "admin" : "user";
}
