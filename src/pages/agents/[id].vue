<template lang="pug">
q-page
  q-toolbar
    q-toolbar-title {{ agent.username }} | {{ agent.email }}
    q-space

    q-btn.q-mx-xs(@click="submit" label="Enregistrer" color="primary" icon="mdi-check")
      q-tooltip.text-body2(slot="trigger") Enregistrer les modifications

    q-separator(:inset="true")

    q-btn.q-mx-xs(@click="refresh" color="primary" icon="mdi-refresh")
      q-tooltip.text-body2(slot="trigger") Rafraichir les données
    q-btn.q-mx-xs(to="/agents" label="Retour" color="primary" icon="mdi-arrow-left")
      q-tooltip.text-body2(slot="trigger") Retour à la liste des identités

  q-card-section
    q-form
      div.row.items-start
        .col-4.q-pa-sm
          q-input(v-model="agent.username" label="Username" filled)
        .col-4.q-pa-sm
          q-input(v-model="agent.displayName" label="Display Name" filled)
        .col-4.q-pa-sm
          q-input(v-model="agent.email" label="Email" type="email" filled)
        .col-4.q-pa-sm
          q-input(v-model="agent.password" label="Password" type="password" filled)
        .col-4.q-pa-sm
          q-input(v-model="agent.thirdPartyAuth" label="Third Party Auth" filled)
        .col-4.q-pa-sm
          q-select(v-model="agent.state.current" :options="stateOptions" label="Current State" filled)
        .col-4.q-pa-sm
          q-input(v-model="agent.baseURL" label="Base URL" filled)
        .col-4.q-pa-sm
          q-select(v-model="agent.roles" :options="rolesOptions" label="Roles" multiple filled)
</template>

<script lang="ts" setup>
import { computed, defineComponent, ref, shallowRef } from 'vue'
import { useQuasar } from 'quasar';
import type { components, operations } from '#build/types/service-api'
import { routerKey, useRoute, useRouter } from 'vue-router';
import { useHttp } from 'nuxt/app';

type AgentsResponse = operations['AgentsController_search']['responses']['200']['content']['application/json']
type Agents = components['schemas']['AgentsDto']


const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const id = shallowRef(route.params.id)

const { data: result, pending, error, refresh } = await useHttp<AgentsResponse>(`/api/core/agents/${id.value}`);
const agent = ref<Agents>(result.value?.data)

async function submit() {
  const sanitizedAgent = { ...agent.value }
  delete sanitizedAgent.metadata


  const { data: result, pending, error, refresh } = await useHttp(`/api/core/agents/${id.value}`, {
    method: 'PATCH',
    body: sanitizedAgent,
  });
  if (error.value) {
    $q.notify({
      message: 'Erreur lors de la sauvegarde',
      color: 'negative',
      position: 'top-right',
      icon: 'mdi-alert-circle-outline',
    })
    console.log(error)
    validations.value = error.value.data.validations
  } else {
    $q.notify({
      message: 'Sauvegarde effectuée',
      color: 'positive',
      position: 'top-right',
      icon: 'mdi-check-circle-outline',
    })
  }
}
</script>

<style scoped>
/* Add your styles here */
</style>
