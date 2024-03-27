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
            q-tooltip.text-body2(anchor="center right" self="center left") Accueil
          q-item(@click="push('/identities')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account")
            q-tooltip.text-body2(anchor="center right" self="center left") Liste des identités
          q-item(@click="push('/account')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-card-account-details")
            q-tooltip.text-body2(anchor="center right" self="center left") Liste des agents
          q-space
          q-separator
          q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=1')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-check")
              q-badge(color="primary" floating ) 1
            q-tooltip.text-body2(anchor="center right" self="center left") A valider

          q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=-2')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-alert")
            q-badge(color="primary" floating) 2
            q-tooltip.text-body2(anchor="center right" self="center left") A complèter
          q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=-3')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-remove")
            q-tooltip.text-body2(anchor="center right" self="center left") En erreur
            q-badge(color="primary" floating) 3

          q-separator
          q-item(@click="push('/settings')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-cog")
            q-tooltip.text-body2(anchor="center right" self="center left") Paramètres
          q-item(@click="logout" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-logout")
            q-tooltip.text-body2(anchor="center right" self="center left") Déconnexion

  q-page-container
    nuxt-page
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const router = useRouter()
const drawer = ref(true)

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
