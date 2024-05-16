import { useIdentityAffectationStore } from "~/stores/identityAffectation"
import { IdentityState, useIdentityStates } from "./useIdentityStates"
import { useIdentityStateStore } from "~/stores/identityState"

const { getStateInfos } = useIdentityStates()

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
}

function useMenu(identityStateStore, identityAffectationStore) {
  const menuParts = ref(['Listes', 'Affectations', 'Etats'])
  const menus = ref([
    {
      icon: 'mdi-account',
      label: 'Liste des identités',
      path: '/identities',
      color: 'primary',
      part: 'Listes',
    },
    {
      icon: 'mdi-card-account-details',
      label: 'Liste des agents',
      path: '/agents',
      color: 'primary',
      part: 'Listes',
    },
    {
      icon: 'mdi-account-check',
      label: 'A valider',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_VALIDATE}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'TO_VALIDATE',
    },
    {
      icon: 'mdi-account-alert',
      label: 'A compléter',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_COMPLETE}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'TO_COMPLETE',
    },
    {
      icon: 'mdi-sync',
      label: 'A synchroniser',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.TO_SYNC}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'TO_SYNC',
    },
    {
      icon: 'mdi-loading',
      label: 'En cours de synchronisation',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.PROCESSING}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'PROCESSING',
    },
    {
      icon: 'mdi-check',
      label: 'Synchronisées',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.SYNCED}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'SYNCED',
    },
    {
      icon: 'mdi-account-off',
      label: 'Etudiants',
      path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supannPerson.supannTypeEntiteAffectation]=/etd/i',
      color: 'primary',
      part: 'Affectations',
      badgeValue: 'ETD',
    },
    {
      icon: 'mdi-account-tie',
      label: 'Administratifs',
      path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supannPerson.supannTypeEntiteAffectation]=/adm/i',
      color: 'primary',
      part: 'Affectations',
      badgeValue: 'ADM',
    },
    {
      icon: 'mdi-account-group',
      label: 'Enseignants',
      path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[^additionalFields.attributes.supannPerson.supannTypeEntiteAffectation]=/esn/i',
      color: 'primary',
      part: 'Affectations',
      badgeValue: 'ESN',
    },
    {
      icon: 'mdi-account-remove',
      label: 'En erreur',
      path: `/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=${IdentityState.ON_ERROR}`,
      color: 'primary',
      part: 'Etats',
      badgeValue: 'ON_ERROR',
    },
    // {
    //   icon: 'mdi-cog',
    //   label: 'Paramètres',
    //   path: '/settings',
    //   color: 'primary',
    //   part: 'Paramètres'
    // }
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
        badge: menu.badgeValue ? badgeInfos : undefined,
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
