// @ts-expect-error
import { loadEnvConfig } from '@next/env'
import { defineConfig } from 'orval'

loadEnvConfig(process.cwd())

export default defineConfig({
  api: {
    input: `${process.env.NEXT_PUBLIC_API_URL}/docs-json`,
    output: {
      target: './src/http/api.ts',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      baseUrl: '',
      override: {
        mutator: {
          path: './mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
