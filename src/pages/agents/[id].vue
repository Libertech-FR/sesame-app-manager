<template lang="pug">
q-page
  q-toolbar
    q-toolbar-title {{ agent.displayName }}
    q-space

    q-btn.q-mx-xs(@click="submit" label="Enregistrer" color="primary" icon="mdi-check")
      q-tooltip.text-body2(slot="trigger") Enregistrer les modifications

    q-separator(:inset="true")

    q-btn.q-mx-xs(@click="refresh" color="primary" icon="mdi-refresh")
      q-tooltip.text-body2(slot="trigger") Rafraichir les données
    q-btn.q-mx-xs(@click="back" label="Retour" color="primary" icon="mdi-arrow-left")
      q-tooltip.text-body2(slot="trigger") Retour à la liste des identités

  sesame-json-form-renderer(
    v-model:data="agent"
    v-model:validations="validations"
    :schema="schema"
    :uischema="uischema"
    )

</template>

<script lang="ts" setup>
import { computed, defineComponent, ref, shallowRef } from 'vue'
import { useQuasar } from 'quasar';
import type { components, operations } from '#build/types/service-api'
import { routerKey, useRoute, useRouter } from 'vue-router';
import { useFetch } from 'nuxt/app';
import { useErrorHandling } from '#imports';

type AgentResponse = operations['AgentsController_search']['responses']['200']['content']['application/json']
type Agent = components['schemas']['AgentsDto']


const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const id = shallowRef(route.params.id)
const { handleError } = useErrorHandling()

const schema = ref({
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "displayName": {
      "type": "string",
      "description": "Common name of the inetOrgPerson."
    },
  },
  "required": ["cn", "sn", "uid", "employeeNumber"]
})
const uischema = ref({
  "type": "Group",
  "label": "inetOrgPerson",
  "elements": [
    {
      "type": "HorizontalLayout",
      "elements": [
        {
          "type": "Control",
          "label": "Display Name",
          "scope": "#/properties/displayName",
          "options": {
            "required": true
          }
        },
      ]
    },
  ]
})

const { data: result, pending, error, refresh } = await useHttp<AgentResponse>(`/core/agents/${id.value}`);
if (error.value) {
  handleError({
    error: error.value,
    redirect: true,
    message: error.value.message
  })
}

const agent = ref<Agent>(result.value?.data)
const validations = ref(agent.value?.additionalFields?.validations)

async function submit() {
  const sanitizedAgent = { ...agent.value }
  delete sanitizedAgent.metadata

  const { data: result, pending, error, refresh } = await useHttp(`/core/agents/${id.value}`, {
    method: 'PATCH',
    body: sanitizedAgent,
  });
  if (error.value) {
    handleError({
      error: error.value,
      message: 'Erreur lors de la sauvegarde'
    })
    validations.value = error.value.data.validations
  } else {
    $q.notify({
      message: 'Sauvegarde effectuée',
      color: 'positive',
      position: 'top-right',
      icon: 'mdi-check-circle-outline',
    })
    agent.value = result.value.data
  }
}

function logs() {
  console.log('logs')
}

function back() {
  router.push('/agents')
}
</script>

<style scoped>
/* Add your styles here */
</style>
