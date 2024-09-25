// biome-ignore lint/correctness/noUnusedImports: This file is used by NextAuth
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    token: string
  }
}
