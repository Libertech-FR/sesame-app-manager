<template lang="pug">
div
  q-tabs(v-model="tab" align="justify")
    q-tab(name="inetOrgPerson" label="inetOrgPerson" :alert="getTabValidations('inetOrgPerson')" alert-icon="mdi-alert" :class="`q-mr-xs`")
    q-tab(v-for="tab in tabs" :key="tab" :name="tab" :label="tab" :alert="getTabValidations(tab)" alert-icon="mdi-alert" :class="`q-mr-xs`")

  q-tab-panels(v-model="tab")
    q-tab-panel(name="inetOrgPerson")
      sesame-json-form-renderer-api(
        schemaName="inetorgperson"
        v-model:data="identity.inetOrgPerson"
        v-model:validations="validations"
      )
    q-tab-panel(v-for="tab in tabs" :key="tab" :name="tab")
      sesame-json-form-renderer-api(
        :schemaName="tab"
        v-model:data="identity.additionalFields.attributes[tab]"
        v-model:validations="validations"
      )
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IdentityState } from '~/constants'
import { useQuasar } from 'quasar'
import type { components, operations } from '#build/types/service-api'
import { useRouter } from 'vue-router'
import { useFetch } from 'nuxt/app'
import { useIdentityStates } from '~/composables'
import { useErrorHandling } from '#imports'

defineOptions({
  name: 'IdentityForm',
})

type IdentityResponse = operations['IdentitiesController_search']['responses']['200']['content']['application/json']
type Identity = components['schemas']['IdentitiesDto'] & { _id: string }

const props = defineProps(
  {
    identity: {
      type: Object as PropType<Identity>,
      required: true,
    }
  }
)

const emits = defineEmits(['refreshTarget'])

const $q = useQuasar()
const router = useRouter()
const { getStateColor, getStateName } = useIdentityStates()
const { handleError } = useErrorHandling()

const identity = ref<Identity>(props.identity)
const validations = ref<Record<string, unknown> | null>(props.identity.additionalFields?.validations ?? {})

watch(() => props.identity, () => {
  identity.value = props.identity
  validations.value = props.identity.additionalFields?.validations ?? null
})

const tabs = ref(props.identity?.additionalFields?.objectClasses ?? [])
const tab = ref('inetOrgPerson')
const error = ref(null)

async function submit() {
  console.log('submit from form')
  const sanitizedIdentity = { ...props.identity }
  delete sanitizedIdentity.metadata
  if (sanitizedIdentity.additionalFields?.validations) delete sanitizedIdentity.additionalFields.validations

  const { data: result, pending, error, refresh } = await useHttp<any>(`/management/identities/${props.identity._id}`, {
    method: 'PATCH',
    body: sanitizedIdentity,
  });
  if (error.value) {
    console.log('error', error.value.data.validations)
    validations.value = error.value.data.validations
    // error.value = error.value.cause.response._data
    handleError({
      error: error.value,
      message: 'Erreur lors de la sauvegarde'
    })
  } else {
    validations.value = null
    $q.notify({
      message: 'Sauvegarde effectuée',
      color: 'positive',
      position: 'top-right',
      icon: 'mdi-check-circle-outline',
    })
    emits('refreshTarget', result.value.data)
  }
}

const stateName = computed(() => {
  const state = props.identity?.state
  return getStateName(state)
})

const stateColor = computed(() => {
  const state = props.identity?.state
  return getStateColor(state)
})

function getTabValidations(tab: string) {
  return validations.value?.hasOwnProperty(tab) ? 'red' : false
}

async function sync() {
  const { data: result, pending, error, refresh } = await useHttp<any>(`/management/identities/${props.identity._id}/state`, {
    method: 'PATCH',
    body: {
      state: IdentityState.TO_SYNC,
    },
  });

  if (error.value) {
    // Handle error during sync
  } else {
    $q.notify({
      message: 'Synchronisation effectuée',
      color: 'positive',
      position: 'top-right',
      icon: 'mdi-check-circle-outline',
    })
    emits('refreshTarget', result.value.data)
    // props.identity. = result.value.data
  }
}

function logs() {
  console.log('logs')
}

function back() {
  router.push('/identities')
}

defineExpose({
  submit,
  sync,
  logs,
  back,
})
</script>


<style scoped>
/* Your styles here */
</style>
