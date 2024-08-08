import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import pugPlugin from 'vite-plugin-pug'
import openapiTS from 'openapi-typescript'
import { defineNuxtConfig } from 'nuxt/config'
import { parse } from 'yaml'

const SESAME_APP_API_URL = process.env.SESAME_APP_API_URL || 'http://localhost:4002'

let SESAME_APP_DARK_MODE: 'auto' | boolean = false
if (process.env.SESAME_APP_DARK_MODE) {
  if (process.env.SESAME_APP_DARK_MODE === 'auto') {
    SESAME_APP_DARK_MODE = 'auto'
  } else {
    SESAME_APP_DARK_MODE = /true|on|yes|1/i.test(process.env.SESAME_APP_DARK_MODE)
  }
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  telemetry: false,
  pages: true,
  srcDir: 'src',
  debug: !!process.env.DEBUG,
  devServer: {
    port: 3000,
  },
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
    timeline: {
      enabled: true,
    },
  },
  css: ['~/assets/sass/global.sass'],
  plugins: [/* { src: '~/plugins/ofetch' } */],
  components: {
    global: true,
    dirs: [{ path: '~/components', prefix: 'sesame' }],
  },
  appConfig: {
    baseUrl: SESAME_APP_API_URL,
    appManagerVersion: process.env.npm_package_version,
  },
  modules: [
    '@nuxt-alt/auth',
    '@nuxt-alt/http',
    '@pinia/nuxt',
    'nuxt-quasar-ui',
    '@vueuse/nuxt',
    'dayjs-nuxt',
    '@nuxt/devtools',
  ],
  auth: {
    globalMiddleware: true,
    rewriteRedirects: true,
    watchLoggedIn: true,
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access_token',
          maxAge: 60 * 5,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 4,
        },
        user: {
          property: 'user',
          autoFetch: true,
        },
        endpoints: {
          login: {
            url: `${SESAME_APP_API_URL}/core/auth/local`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
          },
          refresh: {
            url: `${SESAME_APP_API_URL}/core/auth/refresh`,
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
          },
          logout: { url: `${SESAME_APP_API_URL}/core/auth/logout`, method: 'post' },
          user: { url: `${SESAME_APP_API_URL}/core/auth/session`, method: 'get' },
        },
        redirect: {
          logout: '/login',
          login: '/',
        },
        tokenType: 'Bearer',
        autoRefresh: true,
      },
    },
    stores: {
      pinia: {
        enabled: true,
      },
    },
  },
  http: {
    debug: /true|on|yes|1/i.test(`${process.env.DEBUG}`),
    browserBaseURL: SESAME_APP_API_URL,
    baseURL: SESAME_APP_API_URL,
  },
  dayjs: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    defaultTimezone: 'Paris',
    plugins: ['timezone', 'relativeTime'],
  },
  quasar: {
    iconSet: 'mdi-v7',
    plugins: ['Notify', 'Dialog'],
    config: {
      dark: SESAME_APP_DARK_MODE,
      notify: {
        timeout: 2500,
        position: 'top-right',
        actions: [{ icon: 'mdi-close', color: 'white' }],
      },
    },
  },
  vite: {
    define: {
      'process.env.DEBUG': process.env.NODE_ENV === 'development',
    },
    plugins: [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pugPlugin(<any>{
        pretty: true,
        compilerOptions: {},
      }),
    ],
  },
  alias: {
    cookie: resolve(__dirname, '../node_modules/cookie'),
  },
  future: {
    typescriptBundlerResolution: true,
  },
  experimental: {
    appManifest: false,
  },
  typescript: {
    // typeCheck: 'build,
    shim: false,
    // typeCheck: true,
    // strict: true,
  },
  pinia: {
    storesDirs: ['~/stores'],
  },
  hooks: {
    ready: async (nuxt) => {
      try {
        const menus = parse(readFileSync('./config/menus.yml', 'utf8') || '{}')
        nuxt.options.appConfig.menus = { ...menus || {} }
      } catch (error) {
        console.debug('[Nuxt] Error while reading menus.yml', error)
      }

      try {
        const identitiesColumns = parse(readFileSync('./config/identities-columns.yml', 'utf8') || '{}')
        nuxt.options.appConfig.identitiesColumns = { ...identitiesColumns || {} }
      } catch (error) {
        console.debug('[Nuxt] Error while reading identities-columns.yml', error)
      }

      console.log('[OpenapiTS] Generating .nuxt/types/service-api.d.ts...')
      try {
        const fileData = await openapiTS(`${SESAME_APP_API_URL}/swagger/json`)
        writeFileSync('.nuxt/types/service-api.d.ts', fileData)
        console.log('[OpenapiTS] Generated .nuxt/types/service-api.d.ts !')
      } catch (error) {
        console.debug('[OpenapiTS] Error while generating .nuxt/types/service-api.d.ts', error)
      }
    },
  },
})
