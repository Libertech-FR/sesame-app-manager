<template lang="pug">
div.flex
  div
    q-btn(color="positive" icon='mdi-content-save-plus' @click="create" v-show="isNew" v-if="crud.create")
      q-tooltip.text-body2 Créer
    q-toggle.q-pa-md.q-gutter-y-xl(v-if="props.identity?._id" @click="activate" color="green" left-label='Inactif' label="Actif" v-model="activation")
    q-btn.q-mx-xs(@click="sendInit" color="primary" icon="mdi-email-arrow-right"  :disabled="props.identity.state != IdentityState.SYNCED")
      q-tooltip.text-body2(slot="trigger") Envoyer le mail d'invitation
    q-btn.q-mx-xs(@click="submit" color="positive" icon="mdi-check"  v-show="!isNew" v-if="crud.update")
      q-tooltip.text-body2(slot="trigger") Enregistrer les modifications
    q-btn.q-mx-xs(v-if="props.identity?._id" @click="sync" color="orange-8" :disabled="props.identity.state != IdentityState.TO_VALIDATE" icon="mdi-sync")
      q-tooltip.text-body2(slot="trigger" v-if="props.identity.state == IdentityState.TO_VALIDATE") Synchroniser l'identité
      q-tooltip.text-body2(slot="trigger" v-else) L'état de l'identité ne permet pas de la synchroniser
    q-btn.q-mx-xs(v-if="props.identity?._id" @click="logs" color="grey-8" icon="mdi-file-document" :href="'/jobs?filters[:concernedTo.id]=' + props.identity?._id")
      q-tooltip.text-body2(slot="trigger") Voir les logs de l'identité
    q-btn.q-mx-xs(v-if="props.identity?._id" @click="deleteIdentity" :disabled="!props.identity.lastSync" color="negative" icon="mdi-delete")
      q-tooltip.text-body2(slot="trigger") Supprimer l'identité
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
const activation=ref(true)
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

const emits = defineEmits(['submit', 'sync', 'logs', 'create', 'delete'])

async function submit() {
  // console.log('submit from actions')
  emits('submit')
}

async function create() {
  // console.log('submit from actions')
  emits('create')
}
async function activate(){
  let message=""
  let bouton = ""
  debugger
  if (activation.value === false){
    message="Voulez vous vraiment désactiver l'identité"
    bouton="Désactiver"
  }else{
    message="Voulez vous vraiment activer l'identité"
    bouton="Activer"
  }

  $q.dialog({
    title: 'Confirmation',
    message: message,
    persistent: true,
    ok: {
      push: true,
      color: 'positive',
      label: bouton,
    },
    cancel: {
      push: true,
      color: 'negative',
      label: 'Annuler',
    },
  }).onOk(async() => {
    const requestOptions={method: 'POST',
      body:JSON.stringify({id:props.identity._id,status:activation.value})}
    const data=await $http.post('/management/identities/activation', requestOptions)
      .catch(error => {
        alert('There was an error!');
      })
  }).onCancel(() =>{
    activation.value=activation.value === true? activation.value = false :activation.value = true
  })

}


async function deleteIdentity() {
  $q.dialog({
    title: 'Confirmation',
    message: 'Voulez-vous vraiment supprimer cette identité ?',
    persistent: true,
    ok: {
      push: true,
      color: 'positive',
      label: 'Supprimer',
    },
    cancel: {
      push: true,
      color: 'negative',
      label: 'Annuler',
    },
  }).onOk(() => {
    emits('delete')
  })
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
