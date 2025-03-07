import { useIdentityAffectationStore } from "~/stores/identityAffectation"
import { IdentityState, useIdentityStates } from "./useIdentityStates"
import { useIdentityStateStore } from "~/stores/identityState"

const { getStateInfos } = useIdentityStates()
const config = useAppConfig()

type Badge = {
  name: string
  color: string
  value: string
}

type Menu = {
  icon: string
  label: string
  path: string
  color: string
  part: string
  badgeValue?: string
  badge?: Badge
  hideInMenuBar?:boolean
}

function useMenu(identityStateStore, identityAffectationStore) {
  const menuParts = ref(['Données', 'Listes', 'Affectations', 'Etats', 'Activation'])
  const menus = ref([
    {
      icon: 'mdi-account',
      label: 'Liste des identités',
      path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0',
      color: 'primary',
      part: 'Données',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-download-outline',
      label: 'Exporter',
      path: '/identities/export',
      color: 'primary',
      part: 'Données',
      hideInMenuBar: true
    }, {
      icon: 'mdi-book-clock',
      label: 'Journal des jobs',
      path: '/jobs/table?filters[:state]=-1',
      color: 'primary',
      part: 'Données',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-set-merge',
      label: 'Detection des doublons',
      path: '/identities/fusion',
      color: 'green',
      part: 'Données',
      hideInMenuBar: true
    },
    {
      icon: 'mdi-trash-can',
      label: 'Corbeille',
      path: '/identities/trash',
      color: 'black',
      hideInMenuBar: true,
      part: 'Données'
    },
    {
      icon: 'mdi-account-check',
      label: 'A valider',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[@state][]=${IdentityState.TO_VALIDATE}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'TO_VALIDATE',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-account-alert',
      label: 'A compléter',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[@state][]=${IdentityState.TO_COMPLETE}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'TO_COMPLETE',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-sync',
      label: 'A synchroniser',
      path: `/identities/readonly?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[@state][]=${IdentityState.TO_SYNC}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'TO_SYNC',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-loading',
      label: 'En cours de synchro.',
      path: `/identities/readonly?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[@state][]=${IdentityState.PROCESSING}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'PROCESSING',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-check',
      label: 'Synchronisées',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[@state][]=${IdentityState.SYNCED}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'SYNCED',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-account-switch-outline',
      label: 'Fusionnées',
      path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[!:primaryEmployeeNumber]=null',
      color: 'primary',
      part: 'Etats',
      hideInMenuBar: false
    },
    ...config?.menus?.entries || [],
    {
      icon: 'mdi-account-remove',
      label: 'En erreur',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&filters[@state][]=${IdentityState.ON_ERROR}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'ON_ERROR',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-email-alert',
      label: 'Invitations non envoyés',
      path: '/identities?limit=10&skip=0&filters[&filters[%23initState]=0&sort[metadata.lastUpdatedAt]=desc',
      color: 'negative',
      part: 'Activation',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-email-fast',
      label: 'Invitations envoyées',
      path: '/identities?limit=10&skip=0&filters[&filters[%23initState]=1&sort[metadata.lastUpdatedAt]=desc',
      color: 'warning',
      part: 'Activation',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-email-open',
      label: 'Comptes activés',
      path: '/identities?limit=10&skip=0&filters[&filters[%23initState]=2&sort[metadata.lastUpdatedAt]=desc',
      color: 'positive',
      part: 'Activation',
      hideInMenuBar: false
    },
    {
      icon: 'mdi-email-remove',
      label: 'Invitations périmées',
      path: '/identities/outdated',
      color: 'accent',
      part: 'Activation',
      hideInMenuBar: false
    },
  ])

  const badgesValues = ref({
    TO_VALIDATE: computed(() => (identityStateStore.getToValidateCount > 9999 ? '9999+' : identityStateStore.getToValidateCount)),
    TO_COMPLETE: computed(() => (identityStateStore.getToCompleteCount > 9999 ? '9999+' : identityStateStore.getToCompleteCount)),
    TO_SYNC: computed(() => (identityStateStore.getToSyncCount > 9999 ? '9999+' : identityStateStore.getToSyncCount)),
    PROCESSING: computed(() => (identityStateStore.getProcessingCount > 9999 ? '9999+' : identityStateStore.getProcessingCount)),
    SYNCED: computed(() => (identityStateStore.getSyncedCount > 9999 ? '9999+' : identityStateStore.getSyncedCount)),
    ON_ERROR: computed(() => (identityStateStore.getOnErrorCount > 9999 ? '9999+' : identityStateStore.getOnErrorCount)),
    ETD: computed(() => (identityAffectationStore.getEtdCount > 9999 ? '9999+' : identityAffectationStore.getEtdCount)),
    ADM: computed(() => (identityAffectationStore.getAdmCount > 9999 ? '9999+' : identityAffectationStore.getAdmCount)),
    ESN: computed(() => (identityAffectationStore.getEsnCount > 9999 ? '9999+' : identityAffectationStore.getEsnCount)),
  })

  function getMenu(): Menu[] {
    const menuWithBadgeValue: Menu[] = menus.value.reduce((acc: Menu[], menu) => {
      const badgeType = menu.badgeValue ? menu.badgeValue : 'UNKNOWN'
      const stateInfo = getStateInfos(IdentityState[badgeType])
      const badgeInfos: Badge = {
        name: stateInfo.name,
        color: stateInfo.color === 'grey' ? 'primary' : stateInfo.color,
        value: badgesValues.value[badgeType] || '0',
      }
      acc.push({
        ...menu,
        badge: menu.badgeValue ? badgeInfos : undefined
      })
      return acc
    }, [])
    return menuWithBadgeValue
  }

  function getMenuByPart(part: string): Menu[] {
    return getMenu().filter((menu) => menu.part === part)
  }

  return { getMenu, menuParts, badgesValues, getMenuByPart }
}

export { useMenu }
