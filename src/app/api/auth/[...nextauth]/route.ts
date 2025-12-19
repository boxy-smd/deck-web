import NextAuth, { type NextAuthOptions, type Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { instance } from '@/lib/axios'

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const response = await instance.post(
          'https://deck-api.onrender.com/sessions',
          {
            email: credentials?.email,
            password: credentials?.password,
          },
        )

        return response.data
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    // biome-ignore lint/suspicious/useAwait: This is a NextAuth callback
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }

      return token
    },
    // biome-ignore lint/suspicious/useAwait: This is a NextAuth callback
    async session({ session, token }) {
      session = token.user as Session

      return session
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
