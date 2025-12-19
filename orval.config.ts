import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: 'http://localhost:3333/docs-json',
    output: {
      target: './src/http/api.ts',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      baseUrl: 'http://localhost:3333',
      override: {
        mutator: {
          path: './mutator.ts',
          name: 'customInstance',
        },
      },
    },
  },
})
