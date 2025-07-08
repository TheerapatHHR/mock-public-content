declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
    id_token?: string;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    expires_at?: number;
    refresh_token?: string;
    id_token?: string;
    error?: "RefreshTokenError";
  }
}
