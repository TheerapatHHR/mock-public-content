
import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Keycloak],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log("Account details:", account);
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          id_token: account.id_token,
        }
      }
      // else if (Date.now() < token.expires_at * 1000) {
      //   return token
      // } 
      else {
        if (!token.refresh_token) throw new Error("No refresh token available");

        try {
          const response = await fetch("https://extgw-oapi-pf-sit.arisetech.dev/realms/partner/protocol/openid-connect/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              client_id: "portal-public-client",
              grant_type: "password",
              username: "admin",
            }),
          })

          const tokenOrError = await response.json()

          if (!response.ok) throw tokenOrError

          const newTokens = tokenOrError as {
            access_token: string,
            expires_in: number,
            refresh_token: string,
            id_token: string,
          }

          return {
            ...token,
            access_token: newTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000) + newTokens.expires_in,
            refresh_token: newTokens.refresh_token ? newTokens.refresh_token : token.refresh_token,
            idToken: newTokens.id_token,
          }
        } catch (error) {
          // console.error("Error refreshing token:", error);
          // token.error = "RefreshTokenError"
          return token;
        }
      }
    },
    async session({ session, token }) {
      session.error = token.error
      session.id_token = token.id_token
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);
    // Allows relative callback URLs
    if (url.startsWith("/")) return `${baseUrl}${url}`
 
    // Allows callback URLs on the same origin
    if (new URL(url).origin === baseUrl) return url
 
    return baseUrl
  }
  },
})

