<template lang="pug">
div
  q-btn.q-mx-xs(@click="submit" color="positive" icon="mdi-check")
    q-tooltip.text-body2(slot="trigger") Enregistrer les modifications
  q-btn.q-mx-xs(@click="sync" color="orange-8" v-if="identity" :disabled="props.identity.state != IdentityState.TO_VALIDATE" icon="mdi-sync")
    q-tooltip.text-body2(slot="trigger" v-if="props.identity.state == IdentityState.TO_VALIDATE") Synchroniser l'identité
    q-tooltip.text-body2(slot="trigger" v-else) L'état de l'identité ne permet pas de la synchroniser
  q-btn.q-mx-xs(@click="logs" color="grey-8" icon="mdi-file-document" :href="'/jobs?filters[:concernedTo.id]=' + props.identity?._id")
    q-tooltip.text-body2(slot="trigger") Voir les logs de l'identité
</template>

<script lang="ts" setup>
import { computed, ref, type Prop } from 'vue'
import { IdentityState } from '~/constants'
import { useQuasar } from 'quasar'
import type { components, operations } from '#build/types/service-api'
import { useRouter } from 'vue-router'
import { useFetch } from 'nuxt/app'
import { useIdentityStates } from '~/composables'
import { useErrorHandling } from '#imports'

type IdentityResponse = operations['IdentitiesController_search']['responses']['200']['content']['application/json']
type Identity = components['schemas']['IdentitiesDto']

const props = defineProps({
  identity: {
    type: Object as PropType<Identity>,
    required: true,
  },
})
const $q = useQuasar()
const router = useRouter()
const { getStateColor, getStateName } = useIdentityStates()
const { handleError } = useErrorHandling()

const emits = defineEmits(['submit', 'sync', 'logs'])

async function submit() {
  console.log('submit from actions')
  emits('submit')
}

const stateName = computed(() => {
  const state = props.identity?.state
  return getStateName(state)
})

const stateColor = computed(() => {
  const state = props.identity?.state
  return getStateColor(state)
})

async function sync() {
  emits('sync')
}

function logs() {
  router.push(`/jobs?filters[:concernedTo.id]=${(props.identity as any)._id}`)
}

function back() {
  router.push('/identities')
}
</script>
