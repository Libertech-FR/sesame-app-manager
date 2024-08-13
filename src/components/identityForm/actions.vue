<template lang="pug">
div
  q-btn(color="positive" icon='mdi-content-save-plus' @click="create" v-show="isNew" v-if="crud.create")
    q-tooltip.text-body2 Créer
  q-btn.q-mx-xs(@click="sendInit" color="primary" icon="mdi-email-arrow-right"  :disabled="props.identity.state != IdentityState.SYNCED")
    q-tooltip.text-body2(slot="trigger") Envoyer le mail d'invitation
  q-btn.q-mx-xs(@click="submit" color="positive" icon="mdi-check"  v-show="!isNew" v-if="crud.update")
    q-tooltip.text-body2(slot="trigger") Enregistrer les modifications
  q-btn.q-mx-xs(v-if="props.identity?._id" @click="sync" color="orange-8" :disabled="props.identity.state != IdentityState.TO_VALIDATE" icon="mdi-sync")
    q-tooltip.text-body2(slot="trigger" v-if="props.identity.state == IdentityState.TO_VALIDATE") Synchroniser l'identité
    q-tooltip.text-body2(slot="trigger" v-else) L'état de l'identité ne permet pas de la synchroniser
  q-btn.q-mx-xs(v-if="props.identity?._id" @click="logs" color="grey-8" icon="mdi-file-document" :href="'/jobs?filters[:concernedTo.id]=' + props.identity?._id")
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
  crud: {
    type: Object,
    default: {},
  },
  isNew: {
    type: Boolean,
    required: true,
  },
})
const $q = useQuasar()
const router = useRouter()
const { getStateColor, getStateName } = useIdentityStates()
const { handleError } = useErrorHandling()

const emits = defineEmits(['submit', 'sync', 'logs', 'create'])

async function submit() {
  // console.log('submit from actions')
  emits('submit')
}

async function create() {
  // console.log('submit from actions')
  emits('create')
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

async function sendInit(){
  //envoi le mail

  const { data: result, pending, error, refresh } = await useHttp(`/management/passwd/init`, {
    method: 'POST',
    body: { uid: props.identity.inetOrgPerson.uid  },
  });
  if (error.value) {
    handleError({
      error: error.value,
      message: 'Erreur lors de l\'envoi du mail'
    })
  } else {
    $q.notify({
      message: 'Le mail a été envoyé',
      color: 'positive',
      position: 'top-right',
      icon: 'mdi-check-circle-outline',
    })
  }
}

function logs() {
  router.push(`/jobs?filters[:concernedTo.id]=${(props.identity as any)._id}`)
}

function back() {
  router.push('/identities')
}
</script>
