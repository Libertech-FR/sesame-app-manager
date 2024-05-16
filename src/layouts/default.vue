<template lang="pug">
q-layout
  sesame-appbar(@closeDrawer="drawer = !drawer")
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IdentityState } from '~/composables'
import { useIdentityStateStore } from '~/stores/identityState'
import { useIdentityAffectationStore } from '~/stores/identityAffectation'
import { useMenu } from '~/composables'

const drawer = ref(true)

const router = useRouter()
const identityStateStore = useIdentityStateStore()
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

function test() {
  console.log('test')
}
</script>

<style>
.q-page-container {
  height: 100vh !important;
  width: 100% !important;
}
</style>
