<template lang="pug">
q-page
    q-toolbar 
        q-toolbar-title {{ identity.inetOrgPerson.cn }} {{ identity.inetOrgPerson.givenName }} 
            q-icon(name="mdi-circle" :color="stateColor" :class="`q-mr-xs`")
                q-tooltip.text-body2(slot="trigger") {{ stateName }}
        q-space

        q-btn.q-mx-xs(@click="submit" label="Enregistrer" color="primary" icon="mdi-check")
            q-tooltip.text-body2(slot="trigger") Enregistrer les modifications
        q-btn.q-mx-xs(@click="sync" label="Synchroniser" color="primary" v-if="identity" :disabled="identity.state < IdentityState.TO_VALIDATE || identity.state == IdentityState.SYNCED" icon="mdi-sync")
            q-tooltip(slot="trigger" v-if="identity.state == IdentityState.TO_SYNC") Syncroniser l'identité
            q-tooltip.text-body2(slot="trigger" v-else) L'état de l'identité ne permet pas de la synchroniser
        q-btn.q-mx-xs(@click="logs" label="Logs" color="primary" icon="mdi-file-document")
            q-tooltip.text-body2(slot="trigger") Voir les logs de l'identité

        q-separator(:inset="true")

        q-btn.q-mx-xs(@click="refresh" color="primary" icon="mdi-refresh")
            q-tooltip.text-body2(slot="trigger") Rafraichir les données
        q-btn.q-mx-xs(@click="back" label="Retour" color="primary" icon="mdi-arrow-left")
            q-tooltip.text-body2(slot="trigger") Retour à la liste des identités

    q-tabs(v-model="tab" align="justify")
        q-tab(name="inetOrgPerson" label="inetOrgPerson")
        q-tab(v-for="tab in tabs" :key="tab" :name="tab" :label="tab")

    q-tab-panels(v-model="tab")
        q-tab-panel(name="inetOrgPerson")
            sesame-json-form-renderer(
                schemaName="inetorgperson" 
                v-model:data="identity.inetOrgPerson"
                v-model:validations="validations"
                )
        q-tab-panel(v-for="tab in tabs" :key="tab" :name="tab")
            sesame-json-form-renderer(
                :schemaName="tab" 
                v-model:data="identity.additionalFields.attributes[tab]"
                v-model:validations="validations"
            )

</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import { IdentityState } from '~/constants'
import { useQuasar } from 'quasar';
import type { components, operations } from '#build/types/service-api'

type IdentityResponse = operations['IdentitiesController_search']['responses']['200']['content']['application/json']
type Identity = components['schemas']['IdentitiesDto']


const route = useRoute()
const $q = useQuasar()
const id = shallowRef(route.params.id)

const { data: result, pending, error, refresh } = await useFetch<IdentityResponse>(`/api/management/identities/${id.value}`);
const identity = ref<Identity>(result.value?.data)
const validations = ref(identity.value?.additionalFields?.validations)

const tabs = ref(identity.value?.additionalFields?.objectClasses || [])
const tab = ref('inetOrgPerson')

function getDataForTab(tab: string) {
    return identity.value?.additionalFields?.attributes[tab]
}

// function sanitizeIdentity() {
//     const sanitizedIdentity = { ...identity.value }
//     delete sanitizedIdentity.metadata
//     delete sanitizedIdentity.additionalFields.validations
//     return sanitizedIdentity
// }

async function submit() {
    const sanitizedIdentity = { ...identity.value }
    delete sanitizedIdentity.metadata
    delete sanitizedIdentity.additionalFields.validations

    const { data: result, pending, error, refresh } = await useFetch(`/api/management/identities/${id.value}`, {
        method: 'PATCH',
        body: sanitizedIdentity,
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

const stateName = computed(() => {
    const state = identity.value?.state
    switch (state) {
        case IdentityState.TO_SYNC:
            return 'A synchroniser'
        case IdentityState.TO_VALIDATE:
            return 'A valider'
        case IdentityState.SYNCED:
            return 'Synchronisé'
        case IdentityState.ON_ERROR:
            return 'En erreur'
        case IdentityState.TO_COMPLETE:
            return 'A compléter'
        default:
            return 'Inconnu'
    }
})

const stateColor = computed(() => {
    const state = identity.value?.state
    switch (state) {
        case IdentityState.TO_SYNC:
            return 'grey'
        case IdentityState.TO_VALIDATE:
            return 'positive'
        case IdentityState.SYNCED:
            return 'info'
        case IdentityState.ON_ERROR:
            return 'negative'
        case IdentityState.TO_COMPLETE:
            return 'warning'
        default:
            return 'grey'
    }
})

function sync() {
    console.log('sync')
}

function logs() {
    console.log('logs')
}

function back() {
    console.log('back')
}
</script>

<style scoped>
/* Add your styles here */
</style>