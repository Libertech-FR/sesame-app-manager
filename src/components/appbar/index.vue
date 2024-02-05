<template lang="pug">
  q-header
    q-toolbar.bg-primary.text-white(style={ height: '32px' })
      q-btn(flat @click="backToIndex()")
        q-avatar(square)
          img(src="/sesame-logo.svg")
        q-toolbar-title SESAME
      q-separator(vertical dark inset).q-mx-md
      sesame-AppbarMenu
      q-space
      sesame-AppbarRightButtons
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function backToIndex() {
  router.push({ name: 'index' })
}
</script>
