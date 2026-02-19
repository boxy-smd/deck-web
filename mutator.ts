import type { AxiosRequestConfig } from 'axios'

import { instance } from './src/lib/axios'

export function customInstance<T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> {
  return instance({
    ...config,
    ...options,
  }).then(response => response.data as T)
}
