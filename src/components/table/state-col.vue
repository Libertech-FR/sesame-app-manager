<template lang="pug">
q-td
  q-icon(:name="stateInfo.icon" :color="stateInfo.color" :class="`q-mr-md`")
    q-tooltip.text-body2(slot="trigger") Etat : {{ stateInfo.name }}
  q-icon(:name="lifecycleInfo.icon" :color="lifecycleInfo.color" :class="`q-mr-md`")
    q-tooltip.text-body2(slot="trigger") Cycle de vie : {{ lifecycleInfo.name }}
</template>

<script lang="ts" setup>
import { inject, computed } from 'vue'
import { ref } from 'vue'
import type { components } from '#build/types/service-api'
import type { PropType } from 'vue'
import { useIdentityStates, useIdentityLifecycles } from '~/composables'
const { getStateColor, getStateName, getStateInfos } = useIdentityStates()
const { getLifecycleColor, getLifecycleName, getLifecycleInfos } = useIdentityLifecycles()

const props = defineProps({
  identity: {
    type: Object as PropType<components['schemas']['IdentitiesDto']>,
    default: () => ({}),
  },
})

const stateInfo = computed(() => {
  const state = props.identity.state
  return getStateInfos(state)
})

const lifecycleInfo = computed(() => {
  const lifecycle = props.identity.lifecycle
  return getLifecycleInfos(lifecycle)
})

</script>
