<template lang="pug">
div.fit
  //- .q-px-md
  //-   sesame-searchfilters(:fields="fieldsList")
  q-scroll-area.fit.q-px-lg
    q-timeline.q-px-lg
      q-timeline-entry(heading) November, 2017
      q-timeline-entry(
        v-for="(job, key) in jobs.data" :key="key"
        icon="mdi-account" color="orange"
      )
        template(#title) Titre
        template(#subtitle) Titre
        div
          pre(v-html="JSON.stringify(job, null, 2)")
</template>

<script lang="ts" setup>
// const fieldsList = computed(() => {
//   return columns.value!.reduce((acc: { name: string; label: string; type?: string }[], column) => {
//     if (visibleColumns.value!.includes(column.name) && column.name !== 'actions' && column.name !== 'states') {
//       const type = columnsType.value.find((type) => type.name === column.name)?.type
//       acc.push({
//         name: column.name,
//         label: column.label,
//         type,
//       })
//     }
//     return acc
//   }, [])
// })

const $route = useRoute();

const query = computed(() => {
  return {
    limit: 100,
    'sort[metadata.lastUpdatedAt]': 'desc',
    ...$route.query,
  };
});

const { data: jobs, pending, error, refresh } = await useHttp(`/core/jobs/`, {
  method: 'GET',
  query,
});
</script>
