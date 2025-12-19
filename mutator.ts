import { AxiosRequestConfig } from 'axios'
import { instance } from './src/lib/axios'

export const customInstance = async <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
  const res = await instance({
    ...config,
    ...options,
  })

  return res.data
}
