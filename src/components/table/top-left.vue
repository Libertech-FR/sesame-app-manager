<template lang="pug">
q-btn-group(rounded flat)
  q-btn(flat icon="mdi-eye" color="primary" rounded @click="goToIdentity(selected[0])" size="md" :disable="selected.length === 0 || selected.length !== 1")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Afficher les identitées sélectionnés
  q-btn(flat icon="mdi-merge" color="primary" rounded @click="merge" size="md" :disable="true ||selected.length === 0 || selected.length === 1")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Fusionner les identitées sélectionnés
  q-btn(flat icon="mdi-lock" color="primary" rounded @click="updateLifestep(LifeStep.CLOSED)" size="md" :disable="selected.length === 0")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Mettre a syncroniser les identitées sélectionnés
  q-btn(flat icon="mdi-close" color="primary" rounded @click="clearSelection" size="md")
    q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Nettoyer la selection
</template>

<script lang="ts" setup>
import type { components } from '#build/types/service-api'
import type { PropType } from 'vue'
import { useRouter } from 'nuxt/app'
type Ticket = components['schemas']['TicketDto']

const props = defineProps({
  selected: {
    type: Array as PropType<Ticket[]>,
    default: () => [],
  },
})

const emit = defineEmits(['updateLifestep', 'clear'])

function updateLifestep(lifestep: LifeStep) {
  emit('updateLifestep', { identity: props.selected, lifestep })
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

function goToIdentity(identity: Ticket) {
  useRouter().push(`/identity/${identity._id}`)
}
</script>
