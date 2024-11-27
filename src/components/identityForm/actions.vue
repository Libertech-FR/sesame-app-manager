<template lang="pug">
div.flex
  div
    q-btn(color="positive" icon='mdi-content-save-plus' @click="create" v-show="isNew" v-if="crud.create")
      q-tooltip.text-body2 Créer
    q-toggle.q-pa-md.q-gutter-y-lg(  unchecked-icon="mdi-account-cancel"
      checked-icon="mdi-account-check"
      size="xl"
      @click="activate"
      :color="setActivateColor()"
      label="Activation"
      v-model="props.identity.dataStatus"
      :true-value="1"
      :false-value="0"
      )
    q-btn.q-mx-xs(@click="resetPasswordModal = true" color="red-8" icon="mdi-account-key"  :disabled="props.identity.state != IdentityState.SYNCED")
      q-tooltip.text-body2(slot="trigger") Définir le mot de passe
    q-btn.q-mx-xs(@click="sendInit" color="primary" icon="mdi-email-arrow-right"  :disabled="props.identity.state != IdentityState.SYNCED")
      q-tooltip.text-body2(slot="trigger") Envoyer le mail d'invitation
    q-btn.q-mx-xs(@click="submit" color="positive" icon="mdi-check"  v-show="!isNew" v-if="crud.update")
      q-tooltip.text-body2(slot="trigger") Enregistrer les modifications
    q-btn.q-mx-xs(v-if="props.identity?._id" @click="sync" color="orange-8" :disabled="props.identity.state != IdentityState.TO_VALIDATE" icon="mdi-sync")
      q-tooltip.text-body2(slot="trigger" v-if="props.identity.state == IdentityState.TO_VALIDATE") Synchroniser l'identité
      q-tooltip.text-body2(slot="trigger" v-else) L'état de l'identité ne permet pas de la synchroniser
    q-btn.q-mx-xs(v-if="props.identity?._id" @click="logs" color="grey-8" icon="mdi-file-document" :href="'/jobs?filters[:concernedTo.id]=' + props.identity?._id")
      q-tooltip.text-body2(slot="trigger") Voir les logs de l'identité
    q-btn.q-mx-xs(v-if="props.identity?._id" @click="deleteIdentity" color="negative" icon="mdi-delete")
      q-tooltip.text-body2(slot="trigger") Supprimer l'identité
    q-dialog(v-model="resetPasswordModal" persistent medium)
      q-card(style="width:800px")
       q-card-section(class="text-h6 bg-primary text-white") definition du mot de passe
       q-card-section
        input-new-password(v-model="newpassword")
        q-card-actions(align="right" class="bg-white text-teal")
          q-btn( label="Abandonner" color="negative" @click="resetPasswordModal = false" )
          q-btn( label="Sauver" color="positive" @click="doChangePassword" :disabled="newpassword === ''")

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
import InputNewPassword from "~/components/inputNewPassword.vue";
const resetPasswordModal=ref(false)


const newpassword=ref('')
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

async function doChangePassword(){
  const requestOptions={method: 'POST',
    body:JSON.stringify({id:props.identity._id,newPassword: newpassword.value})}
  try{
    const data=await $http.post('/management/identities/forcepassword', requestOptions)
    $q.notify({
      message: 'Le mot de passe a été changé : ',
      color: 'positive',
      position: 'top-right',
      icon: 'mdi-check-circle-outline',
    })
  }catch(error){
    $q.notify({
      message: 'Impossible de modifier le mot de passe : ' + error.response._data.message,
      color: 'negative',
      position: 'top-right',
      icon: 'mdi-alert-circle-outline',
    })
  }
  resetPasswordModal.value = false
}
async function submit() {
  // console.log('submit from actions')
  emits('submit')
}

async function create() {
  // console.log('submit from actions')
  emits('create')
}
function setActivateColor(){
  if (props.identity.lastBackendSync != ""){
    return "green"
  }else{
    return "grey"
  }
}
function showActivate(){
  if (props.identity.lastBackendSync != ""){
    return true
  }else{
    return false
  }
}
async function activate(){


  let message=""
  let bouton = ""
  let initialStatus=0
  if (props.identity.dataStatus === 0){
    message="Voulez vous vraiment désactiver l'identité"
    bouton="Désactiver"
    initialStatus=1
  }else{
    message="Voulez vous vraiment activer l'identité"
    bouton="Activer"
    initialStatus=0
  }
  if (showActivate() === false){
    props.identity.dataStatus = initialStatus
    return
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
      body:JSON.stringify({id:props.identity._id,status:props.identity.dataStatus === 1 ?true:false})}
    try{
      const data=await $http.post('/management/identities/activation', requestOptions)
      $q.notify({
        message: 'Le statut a été mis à jour : ',
        color: 'positive',
        position: 'top-right',
        icon: 'mdi-check-circle-outline',
      })
    }catch(error){
      props.identity.dataStatus = initialStatus
      $q.notify({
        message: 'Impossible de modifier le statut : ' + error.response._data.message,
        color: 'negative',
        position: 'top-right',
        icon: 'mdi-alert-circle-outline',
      })
    }

  }).onCancel(() =>{
    props.identity.dataStatus=initialStatus
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
