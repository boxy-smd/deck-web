import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { usersControllerLogin } from '@/http/api'

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        if (!(credentials?.email && credentials?.password)) {
          return null
        }

        const { email, password } = credentials
        const { token, user } = await usersControllerLogin({
          email,
          password,
        })

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          token: token,
        }
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
        token.token = user.token
      }

      return token
    },
    // biome-ignore lint/suspicious/useAwait: This is a NextAuth callback
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user
      }

      if (token.token) {
        session.token = token.token
      }

      return session
    },
  },
}

const handler = NextAuth(nextAuthOptions)

export { handler as GET, handler as POST }
