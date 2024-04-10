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
          q-item(@click="push('/agents')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-card-account-details")
            q-tooltip.text-body2(anchor="center right" self="center left") Liste des agents
          q-space
          q-separator
          q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_VALIDATE}`)" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-check")
              q-badge(color="primary" floating ) {{ TO_VALIDATE }}
            q-tooltip.text-body2(anchor="center right" self="center left") A valider

          q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_COMPLETE}`)" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-alert")
            q-badge(color="primary" floating) {{ TO_COMPLETE }}
            q-tooltip.text-body2(anchor="center right" self="center left") A compléter
          q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.ON_ERROR}`)" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-remove")
            q-tooltip.text-body2(anchor="center right" self="center left") En erreur
            q-badge(color="primary" floating) {{ ON_ERROR }}

          q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_SYNC}`)" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-sync")
            q-tooltip.text-body2(anchor="center right" self="center left") A synchroniser
            q-badge(color="primary" floating) {{ TO_SYNC }}

          q-item(@click="push(`/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.SYNCED}`)" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-check")
            q-tooltip.text-body2(anchor="center right" self="center left") Synchronisées
            q-badge(color="primary" floating) {{ SYNCED }}

          q-separator
          q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/etd/i')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-off")
            q-tooltip.text-body2(anchor="center right" self="center left") Etudiants
            q-badge(color="primary" floating) {{ ETD }}
          q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/adm/i')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-tie")
            q-tooltip.text-body2(anchor="center right" self="center left") Administratifs
            q-badge(color="primary" floating) {{ ADM }}
          q-item(@click="push('/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/esn/i')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-account-group")
            q-tooltip.text-body2(anchor="center right" self="center left") Enseignants
            q-badge(color="primary" floating) {{ ESN }}
          q-separator
          q-item(@click="push('/settings')" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-cog")
            q-tooltip.text-body2(anchor="center right" self="center left") Paramètres
          q-item(@click="test" clickable)
            q-item-section(avatar)
              q-icon(name="mdi-logout")
            q-tooltip.text-body2(anchor="center right" self="center left") Déconnexion

  q-page-container
    nuxt-page
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { IdentityState } from '~/composables'
import { useIdentityStateStore } from '~/stores/identityState'
import { useIdentityAffectationStore } from '~/stores/identityAffectation'
const drawer = ref(true)

const router = useRouter()

const identityStore = useIdentityStateStore()
const identityAffectationStore = useIdentityAffectationStore()
const { fetchAllStateCount } = identityStore
const { fetchAllAffectationCount } = identityAffectationStore
fetchAllStateCount()
fetchAllAffectationCount()


const TO_COMPLETE = computed(() => identityStore.getToCompleteCount > 99 ? '99+' : identityStore.getToCompleteCount)
const TO_VALIDATE = computed(() => identityStore.getToValidateCount > 99 ? '99+' : identityStore.getToValidateCount)
const ON_ERROR = computed(() => identityStore.getOnErrorCount > 99 ? '99+' : identityStore.getOnErrorCount)
const TO_SYNC = computed(() => identityStore.getToSyncCount > 99 ? '99+' : identityStore.getToSyncCount)
const SYNCED = computed(() => identityStore.getSyncedCount > 99 ? '99+' : identityStore.getSyncedCount)

const ADM = computed(() => identityAffectationStore.getAdmCount > 9999 ? '9999+' : identityAffectationStore.getAdmCount)
const ETD = computed(() => identityAffectationStore.getEtdCount > 9999 ? '9999+' : identityAffectationStore.getEtdCount)
const ESN = computed(() => identityAffectationStore.getEsnCount > 9999 ? '9999+' : identityAffectationStore.getEsnCount)

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
