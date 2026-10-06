import type { DefaultSession } from "next-auth";
import type { Role } from "@/lib/admin";

// Augment Auth.js types so `session.user.role` and the JWT `role` claim are
// strongly typed everywhere.

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }

  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}
