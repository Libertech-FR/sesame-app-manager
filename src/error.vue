<template lang="pug">
div(class="q-pa-md flex flex-center full-height" style="background-color: #f5f5f5; height: 100vh;")
  q-card(style="max-width: 400px;")
    q-card-section(class="q-pa-md text-center")
      q-icon(name="mdi-alert-circle" color="negative" size="52px")
      div(class="text-h5 q-my-md") Oups ! Un problème est survenu.
      div(class="text-subtitle1 q-my-md") {{ error.statusCode }} - {{ error.message }}
      div(class="q-my-md") Ne vous inquiétez pas, nous allons vous remettre sur le bon chemin.

    q-card-actions(align="around")
      q-btn(flat label="Retour à l'accueil" @click="$router.push('/')")
      //q-btn(flat label="Contacter le support" @click="contactSupport")
      q-btn(flat label="Essayer à nouveau" @click="reloadPage")

</template>

<script lang="ts" setup>
import type { NuxtError } from '#app'
import type { PropType } from 'vue'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    default: null,
  },
})

const router = useRouter();

function contactSupport() {
  // Implement your contact support logic here
  // For example, redirect to a contact form or display contact info
}

function reloadPage() {
  location.reload();
}
</script>
