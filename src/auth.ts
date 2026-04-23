import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Medusa Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/emailpass`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            })
          })

          if (!res.ok) {
            return null
          }

          const parsed = await res.json()
          
          if (parsed.token) {
            return {
              id: parsed.customer_id || credentials.email as string, // next-auth requires `id` inside return
              email: credentials.email as string,
              medusa_token: parsed.token,
              customer_id: parsed.customer_id,
              role: parsed.role || "customer",
            }
          }

          return null
        } catch (e) {
          console.error("Authentication error:", e)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.medusa_token = (user as any).medusa_token
        token.customer_id = (user as any).customer_id
        token.role = (user as any).role || "customer"
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.medusa_token = token.medusa_token as string
        session.customer_id = token.customer_id as string
        session.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/connexion', // Assuming the login page is here based on the contexts
  }
})
