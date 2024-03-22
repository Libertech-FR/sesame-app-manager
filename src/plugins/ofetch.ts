import { useAuth } from "#imports"

export default defineNuxtPlugin((nuxtApp) => {
  const { tokenStrategy } = useAuth()
  const instance = $fetch.create({
    baseURL: '/api',
    headers: {
      Accept: 'application/json',
      Authorization: `${tokenStrategy?.token?.get()}`,
    },
  })


  globalThis.$fetch = instance

  return {
    provide: {
      fetch: instance,
    },
  }
})
