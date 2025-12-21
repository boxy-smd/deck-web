// biome-ignore lint/correctness/noUnusedImports: This file is used by NextAuth
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    token: string
  }

  interface Session {
    user: User
    token: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: import('next-auth').User
    token?: string
  }
}
