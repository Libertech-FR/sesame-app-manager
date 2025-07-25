<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script lang="ts" setup>
const $route = useRoute()

if (/1|yes|on|true/.test($route.query.embedded as string)) {
  setPageLayout('empty')
}
</script>
