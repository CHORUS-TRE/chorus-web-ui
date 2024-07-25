export const BASE_URL = 'http://localhost:3000/api/rest/v1/'

export interface TypedResponse<T = any> extends Response {
  json<P = T>(): Promise<P>
}
export function myFetch<T>(...args: any): Promise<TypedResponse<T>> {
  return fetch.apply(window, args)
}
