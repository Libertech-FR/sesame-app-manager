<template lang="pug">
div
  //- pre(v-html="JSON.stringify(payload, null, 2)")
  sesame-json-form-renderer(
    v-model:data="payload.target"
    v-model:validations="validations"
    :schema="schema"
    :uischema="uischema"
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

const props = defineProps(
  {
    schema: {
      type: Object,
      default: () => ({}),
    },
    uischema: {
      type: Object,
      default: () => ({}),
    },
    payload: {
      type: Object,
      required: true,
    },
  }
)

const $q = useQuasar()
const router = useRouter()
const { getStateColor, getStateName } = useIdentityStates()
const { handleError } = useErrorHandling()


const validations = ref([])
const error = ref(null)

// defineExpose({
//   submit,
//   sync,
//   logs,
//   back,
// })
</script>


<style scoped>
/* Your styles here */
</style>
