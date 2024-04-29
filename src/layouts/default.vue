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
            @click="push(menu.path)"
          )
            q-item-section(avatar)
              q-icon(:name="menu.icon")
            q-badge(v-if="menu.badgeValue" :color="menu.badge.color" floating) {{ menu.badge.value }}
          q-separator
            //- q-item-section.avatar
            //-   q-icon(:name="getMenuByPart(part)[0].icon")
            //- q-item-section
            //-   q-item-label {{ part }}
            //- q-tooltip.text-body2(anchor="center right" self="center left") {{ part }}
            //- q-badge(v-if="badgesValues[part]" color="primary" floating) {{ badgesValues[part] }}
          //- q-item(@click="push('/')" clickable v-ripple)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-home")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Accueil
          //- q-item(@click="push('/agents')" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-card-account-details")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Liste des agents
          //- q-item(@click="push('/identities')" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account")
          //-     q-badge(color="primary" floating) {{ TOTAL }}
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Liste des identités
          //- q-space
          //- q-separator
          //- q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_VALIDATE}`)" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account-check")
          //-     q-badge(color="primary" floating ) {{ TO_VALIDATE }}
          //-   q-tooltip.text-body2(anchor="center right" self="center left") A valider

          //- q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_COMPLETE}`)" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account-alert")
          //-   q-badge(color="primary" floating) {{ TO_COMPLETE }}
          //-   q-tooltip.text-body2(anchor="center right" self="center left") A compléter
          //- q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.ON_ERROR}`)" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account-remove")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") En erreur
          //-   q-badge(color="primary" floating) {{ ON_ERROR }}

          //- q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_SYNC}`)" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-sync")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") A synchroniser
          //-   q-badge(color="primary" floating) {{ TO_SYNC }}

          //- q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.PROCESSING}`)" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-loading")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") En cours de synchronisation
          //-   q-badge(color="primary" floating) {{ PROCESSING }}

          //- q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.SYNCED}`)" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-check")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Synchronisées
          //-   q-badge(color="primary" floating) {{ SYNCED }}

          //- q-separator
          //- q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/etd/i')" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account-off")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Etudiants
          //-   q-badge(color="primary" floating) {{ ETD }}
          //- q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/adm/i')" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account-tie")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Administratifs
          //-   q-badge(color="primary" floating) {{ ADM }}
          //- q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/esn/i')" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-account-group")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Enseignants
          //-   q-badge(color="primary" floating) {{ ESN }}
          //- q-separator
          //- q-item(@click="push('/settings')" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-cog")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Paramètres
          //- q-item(@click="test" clickable)
          //-   q-item-section(avatar)
          //-     q-icon(name="mdi-logout")
          //-   q-tooltip.text-body2(anchor="center right" self="center left") Déconnexion

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
