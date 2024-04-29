<template lang="pug">
q-card.shadow-24.row(style="max-width: 800px;")
  q-toolbar.bg-primary.text-white
    q-toolbar-title Connexion
  q-card-section.col-6.flex.items-center
    q-img(src="/config/login-side.png" error-src="/default.png" alt="Ecole logo" style="max-width: 100%;")
  q-card-section.col-6.column
    form(@submit.prevent='submit')
      q-card.no-shadow
        q-card-section.q-pt-sm.q-px-lg.q-pb-lg
          q-input(v-model="formData.username" label="Username" type="text")
          q-input(v-model="formData.password" label="Password" type="password" auto-complete='current-password')
        q-inner-loading(:showing='pending')
          q-spinner-grid(color='primary' size='50px')
      q-card-actions.column.justify-between
        .col.q-my-sm.flex.items-center
          q-btn(@click.prevent='submit' type='submit' color='primary') Se connecter
        .col.row
          q-separator
        .col.row.q-my-sm.justify-between
          .col-4
            q-btn(@click="" color="primary" style="height:100%" disabled) Se connecter avec CAS
          .col-4
            q-btn(@click="" color="primary" style="height:100%" disabled) Se connecter avec microsoft

</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
definePageMeta({
  layout: 'simple-centered',
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const $q = useQuasar()
const pending = ref(false)
const formData = ref({
  username: '',
  password: '',
})

const submit = async () => {
  pending.value = true
  try {
    await useAuth().loginWith('local', {
      body: formData.value,
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erreur de connexion',
    })
  } finally {
    pending.value = false
  }
}
</script>
