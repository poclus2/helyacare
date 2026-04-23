import NextAuth, { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    medusa_token: string
    customer_id: string
    role: string
    user: {
      /** The user's postal address. */
      // address: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    medusa_token: string
    customer_id: string
    role: string
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    medusa_token?: string
    customer_id?: string
    role?: string
  }
}
