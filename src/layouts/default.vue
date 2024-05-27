<template lang="pug">
q-layout
  sesame-appbar(@closeDrawer="drawer = !drawer" @syncing="syncing")
  q-drawer.flex(v-model="drawer" side="left" :mini="true" bordered)
    template(#mini)
      q-scroll-area.fit.mini-slot.cursor-pointer
        q-list
          q-item(@click="push('/')" clickable v-ripple)
            q-item-section(avatar)
              q-icon(name="mdi-home")
          q-separator
        q-list(v-for="part in menuParts" :key="part")
          q-item(
            v-for="menu in getMenuByPart(part)" :key="part" clickable v-ripple
            :href="menu.path" :active="menu.path === $route.fullPath"
          )
            q-item-section(avatar)
              q-icon(:name="menu.icon")
            q-badge(v-if="menu.badgeValue" :color="menu.badge.color" floating) {{ menu.badge.value }}
          q-separator
  q-page-container
    nuxt-page
    q-dialog(seamless v-model="eventSeamless" position="bottom")
      q-card(style="width: 350px")
        q-linear-progress(:value="eventSeamlessProgress" color="amber-9")
        q-card-section.row.items-center.no-wrap
          q-circular-progress.q-mr-md(indeterminate size="42px" color="amber-9")
          //- pre(v-html="JSON.stringify(eventSeamlessCurrentJobs, null, 2)")
          div
            .text-weight-bold.q-px-md.text-center
              | Synchronisation en cours&nbsp;&nbsp;
              q-badge(color="amber-10") {{ eventSeamlessCurrent }}/{{ eventSeamlessTotal }}
            //- .text-grey Fitz & The Tantrums
          q-space
          q-btn(flat round icon="mdi-close" v-close-popup)
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IdentityState } from '~/composables'
import { useIdentityStateStore } from '~/stores/identityState'
import { useIdentityAffectationStore } from '~/stores/identityAffectation'
import { useMenu } from '~/composables'
import ReconnectingEventSource from "reconnecting-eventsource";

const identityStateStore = useIdentityStateStore()

const auth = useAuth()
const config = useAppConfig()
const esUrl = new URL(config.baseUrl + "/core/backends/sse")
esUrl.searchParams.append("key", '' + auth.user?.sseToken)
var es = new ReconnectingEventSource(esUrl)

console.log('identityStateStore.getProcessingCount', identityStateStore.getProcessingCount)

const eventSeamless = ref(false)
const eventSeamlessTotal = ref(identityStateStore.getProcessingCount)
const eventSeamlessCurrent = ref(0)
const eventSeamlessCurrentJobs = ref({})

const eventSeamlessProgress = computed(() => {
  return eventSeamlessTotal.value === 0 ? 0 : eventSeamlessCurrent.value / eventSeamlessTotal.value
})

async function onmessage(event) {
  try {
    const data = JSON.parse(event.data)

    if (/^job:/.test(data.channel)) {
      eventSeamless.value = true
      if (eventSeamlessTotal.value === 0) {
        await identityStateStore.fetchProcessingCount()
        eventSeamlessTotal.value = identityStateStore.getProcessingCount
      }
    }

    switch (data.channel) {
      case 'job:added':
        eventSeamlessCurrentJobs.value[data.payload.jobId] = data.payload
        break

      case 'job:completed':
        delete eventSeamlessCurrentJobs.value[data.payload.jobId]
        eventSeamlessCurrent.value++

        if (eventSeamlessCurrent.value >= eventSeamlessTotal.value) {
          eventSeamlessCurrent.value = 0
          eventSeamlessCurrentJobs.value = {}
          setTimeout(() => {
            eventSeamless.value = false
          }, 2000)
        }
        break
    }

  } catch (e) {
    console.error(e)
  }
}

es.onmessage = onmessage

function syncing(payload: { count: number }) {
  eventSeamlessTotal.value = payload.count
  eventSeamlessCurrent.value = 0
  eventSeamless.value = true
}

const drawer = ref(true)

const router = useRouter()
const identityAffectationStore = useIdentityAffectationStore()
const { fetchAllStateCount } = identityStateStore
const { fetchAllAffectationCount } = identityAffectationStore
await identityStateStore.fetchAllStateCount()
await identityAffectationStore.fetchAllAffectationCount()

const { getMenu, badgesValues, menuParts, getMenuByPart } = useMenu(identityStateStore, identityAffectationStore)

// const { fetchAllStateCount } = identityStore
// await identityStore.fetchAllStateCount()

function push(path: string) {
  router.push(path)
}

function logout() {
  router.push({ name: 'login' })
}
</script>

<style>
.q-page-container {
  height: 100vh !important;
  width: 100% !important;
}
</style>
