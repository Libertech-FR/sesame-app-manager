<template lang="pug">
q-page.container
  q-toolbar
    q-toolbar-title Accueil

  div.q-pa-md(v-for="part in menuParts", :key="part")
    q-separator.q-my-md
    div.text-h5.q-my-md {{ part }}

    div.row.q-gutter-md
      q-btn(v-for="item in getMenuByPart(part)" :key="item.label"
        tile color="primary"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        :label="item.label"
        @click="push(item.path)"
        :icon="item.icon"
        style="height: 120px; font-size: 18px;")
        q-badge(v-if="item.badge" color="positive" floating) {{ badges[item.badge] }}
</template>

<script lang="ts" setup>
import { useIdentityStateStore } from '~/stores/identityState'
import { useIdentityAffectationStore } from '~/stores/identityAffectation'
const router = useRouter()

const identityStore = useIdentityStateStore()
const identityAffectationStore = useIdentityAffectationStore()
const { fetchAllStateCount } = identityStore
const { fetchAllAffectationCount } = identityAffectationStore

const TO_COMPLETE = computed(() => identityStore.getToCompleteCount > 99 ? '99+' : identityStore.getToCompleteCount)
const TO_VALIDATE = computed(() => identityStore.getToValidateCount > 99 ? '99+' : identityStore.getToValidateCount)
const ON_ERROR = computed(() => identityStore.getOnErrorCount > 99 ? '99+' : identityStore.getOnErrorCount)
const TO_SYNC = computed(() => identityStore.getToSyncCount > 99 ? '99+' : identityStore.getToSyncCount)
const SYNCED = computed(() => identityStore.getSyncedCount > 99 ? '99+' : identityStore.getSyncedCount)

const ADM = computed(() => identityAffectationStore.getAdmCount > 9999 ? '9999+' : identityAffectationStore.getAdmCount)
const ETD = computed(() => identityAffectationStore.getEtdCount > 9999 ? '9999+' : identityAffectationStore.getEtdCount)
const ESN = computed(() => identityAffectationStore.getEsnCount > 9999 ? '9999+' : identityAffectationStore.getEsnCount)

const badges = ref({
  TO_COMPLETE,
  TO_VALIDATE,
  ON_ERROR,
  TO_SYNC,
  SYNCED,
  ADM,
  ETD,
  ESN
})

function push(path: string) {
  router.push(path)
}

const menuParts = ref(['Listes', 'Affectations', 'Etats', 'Paramètres'])

const menu = ref([
  {
    icon: 'mdi-account',
    label: 'Liste des identités',
    path: '/identities',
    color: 'primary',
    part: 'Listes'
  },
  {
    icon: 'mdi-card-account-details',
    label: 'Liste des agents',
    path: '/account',
    color: 'primary',
    part: 'Listes'
  },
  {
    icon: 'mdi-account-check',
    label: 'A valider',
    path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_VALIDATE}`,
    color: 'primary',
    part: 'Etats',
    badge: 'TO_VALIDATE'
  },
  {
    icon: 'mdi-account-alert',
    label: 'A compléter',
    path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_COMPLETE}`,
    color: 'primary',
    part: 'Etats',
    badge: 'TO_COMPLETE'
  },
  {
    icon: 'mdi-sync',
    label: 'A synchroniser',
    path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_SYNC}`,
    color: 'primary',
    part: 'Etats',
    badge: 'TO_SYNC'
  },
  {
    icon: 'mdi-check',
    label: 'Synchronisées',
    path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.SYNCED}`,
    color: 'primary',
    part: 'Etats',
    badge: 'SYNCED'
  },
  {
    icon: 'mdi-account-off',
    label: 'Etudiants',
    path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/etd/i',
    color: 'primary',
    part: 'Affectations',
    badge: 'ETD'
  },
  {
    icon: 'mdi-account-tie',
    label: 'Administratifs',
    path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/adm/i',
    color: 'primary',
    part: 'Affectations',
    badge: 'ADM'
  },
  {
    icon: 'mdi-account-group',
    label: 'Enseignants',
    path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supann.supannTypeEntiteAffectation]=/esn/i',
    color: 'primary',
    part: 'Affectations',
    badge: 'ESN'
  },
  {
    icon: 'mdi-account-remove',
    label: 'En erreur',
    path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.ON_ERROR}`,
    color: 'primary',
    part: 'Etats',
    badge: 'ON_ERROR'
  },
  {
    icon: 'mdi-cog',
    label: 'Paramètres',
    path: '/settings',
    color: 'primary',
    part: 'Paramètres'
  }
])

function getMenuByPart(part: string) {
  return menu.value.filter(item => item.part === part)
}

</script>
