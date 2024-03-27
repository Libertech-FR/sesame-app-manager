import { useAuth } from "#imports"
import { useQuasar } from "#imports"

export default defineNuxtPlugin((nuxtApp) => {
  const { tokenStrategy } = useAuth()
<<<<<<< HEAD
  const $q = useQuasar()
  const instance = $fetch.create({
    baseURL: '/api',
    headers: {
      Accept: 'application/json',
      Authorization: `${tokenStrategy?.token?.get()}`,
    },
    onResponseError: (error) => {
      console.error('onResponseError', error)
      $q.notify({
        message: error.response?._data.message || 'Erreur inconnue',
        color: 'negative',
        position: 'top-right',
        icon: 'mdi-alert-circle-outline',
      })
      return Promise.reject(error)
    }
  })
=======
  // const instance = $fetch.create({
  //   baseURL: '/api',
  //   headers: {
  //     Accept: 'application/json',
  //     Authorization: `${tokenStrategy?.token?.get()}`,
  //   },
  // })
>>>>>>> 3eadaab (fix nuxt config)


  // globalThis.$fetch = instance

  return {
    provide: {
      // fetch: instance,
    },
  }
})
