import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const { handlers, auth, signIn, signOut } = NextAuth({
  basePath: "/api/auth",
  trustHost: true,
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
          const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
          const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/auth/customer/emailpass`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              ...(publishableKey && { "x-publishable-api-key": publishableKey })
            },
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
            // En Medusa v2, le endpoint auth retourne juste un token.
            // On doit récupérer le customer pour avoir son ID et ses métadonnées.
            const customerRes = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/me`, {
              headers: {
                "Authorization": `Bearer ${parsed.token}`,
                ...(publishableKey && { "x-publishable-api-key": publishableKey })
              }
            });
            
            let customerId = "";
            let role = "customer";
            let firstName = "";
            
            if (customerRes.ok) {
              const customerData = await customerRes.json();
              customerId = customerData.customer?.id || "";
              role = customerData.customer?.metadata?.role || "customer";
              firstName = customerData.customer?.first_name || "";
            }

            return {
              id: customerId || credentials.email as string,
              email: credentials.email as string,
              medusa_token: parsed.token,
              customer_id: customerId,
              role: role,
              first_name: firstName,
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
        token.first_name = (user as any).first_name || ""
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.medusa_token = token.medusa_token as string
        session.customer_id = token.customer_id as string
        session.role = token.role as string
        // @ts-ignore - On étend la session NextAuth
        session.first_name = token.first_name as string
      }
      return session
    }
  },
  pages: {
    signIn: '/connexion', // Assuming the login page is here based on the contexts
  }
})
