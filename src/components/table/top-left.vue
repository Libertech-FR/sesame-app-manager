<template lang="pug">
q-btn-group(rounded flat)
  q-btn(flat icon="mdi-eye" color="primary" rounded @click="goToIdentity(selected[0])" size="md" :disable="selected.length === 0 || selected.length !== 1")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Afficher les identités sélectionnées
  //- q-btn(flat icon="mdi-merge" color="primary" rounded @click="merge" size="md" :disable="true ||selected.length === 0 || selected.length === 1")
  //-   q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Fusionner les identités sélectionnées
  //- q-btn(flat icon="mdi-check" color="primary" rounded @click="openUpdateModale(IdentityState.TO_VALIDATE)" size="md" :disable="selected.length === 0")
  //-   q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Valider les identités sélectionnées
  q-btn(flat icon="mdi-sync" color="primary" rounded @click="openUpdateModale(IdentityState.TO_VALIDATE)" size="md" :disable="selected.length === 0")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Mettre à synchroniser les identités sélectionnées
  q-btn(flat icon="mdi-close" color="primary" rounded @click="clearSelection" size="md")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Nettoyer la selection
</template>

<script lang="ts" setup>
import type { components } from '#build/types/service-api'
import type { PropType } from 'vue'
import { useRouter } from 'nuxt/app'
import updateIdentityModale from '../updateIdentityModale.vue'
import { useIdentityStates } from '#imports'
import { IdentityState } from '~/composables'
import { useIdentityStateStore } from '~/stores/identityState'

const $q = useQuasar()

const props = defineProps({
  selected: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const emit = defineEmits(['updateLifestep', 'clear', 'refresh'])

const { getStateName } = useIdentityStates()
const { getStateValue } = useIdentityStateStore()
// function updateLifestep(lifestep: LifeStep) {
//   emit('updateLifestep', { identity: props.selected, lifestep })
// }

function openUpdateModale(identityState: IdentityState) {
  console.log('openUpdateModale')

  const name = getStateName(identityState)
  const count = getStateValue(identityState)

  $q.dialog({
    component: updateIdentityModale,
    componentProps: {
      selectedIdentities: props.selected,
      identityTypesName: name,
      allIdentitiesCount: count,
    },
  })
    .onOk(async (data) => {
      console.log('syncIdentities', data)
      data.syncAllIdentities ? await updateAllIdentities(identityState) : await updateIdentity(props.selected, identityState)
    })
    .onCancel(() => {
      console.log('cancelSync')
    })
}

function getTargetState(state: IdentityState) {
  switch (state) {
    case IdentityState.TO_VALIDATE:
      return IdentityState.TO_SYNC
    default:
      return state
  }
}

async function updateAllIdentities(state: IdentityState) {
  const { data: identities } = await useHttp(`/management/identities?limit=999999&&filters[@state][]=${state}`, {
    method: 'get',
  })

  if (!identities) {
    $q.notify({
      message: 'Aucune identité à mettre à jour',
      color: 'negative',
    })
    return
  }
  updateIdentity(identities.value.data, state)
}

async function updateIdentity(identities, state: IdentityState) {
  const targetState = getTargetState(state)

  console.log('updateIdentity', identities)
  const ids = identities.map((identity) => identity._id)
  const { data, error } = await useHttp(`/management/identities/state`, {
    method: 'patch',
    body: {
      ids,
      originState: state,
      targetState,
    },
  })

  if (error.value) {
    $q.notify({
      message: error.value.data.message,
      color: 'negative',
    })
    return
  }

  $q.notify({
    message: `Les identités ont été mises à jour avec succès`,
    color: 'positive',
  })
  emit('refresh')
  emit('clear')
}

function clearSelection() {
  emit('clear')
}

function markAsRead() {
  console.log('markAsRead')
}

function merge() {
  console.log('merge')
}

function goToIdentity(identity) {
  useRouter().push(`/identity/${identity._id}`)
}
</script>
