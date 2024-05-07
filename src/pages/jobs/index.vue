<template lang="pug">
div
  //- .q-px-md
  //-   sesame-searchfilters(:fields="fieldsList")
  q-timeline.q-px-lg
    q-infinite-scroll.q-px-lg(@load="load" :offset="250")
      template(#loading)
        .row.justify-center.q-my-md
          q-spinner-dots(color="primary" size="40px")

      q-timeline-entry(heading) November, 2017
      q-timeline-entry(
        v-for="(job, key) in jobs" :key="key"
        icon="mdi-account" color="orange"
      )
        template(#title)
          span(v-text="'[' + job.jobId + ']'")
          | &nbsp; - &nbsp;
          span(v-text="job.params?.identity?.identity?.inetOrgPerson?.cn")
          | &nbsp;
          span(v-text="job.params?.identity?.identity?.inetOrgPerson?.givenName")
        template(#subtitle)
          q-card.bg-transparent(flat)
            q-card-actions
              div(v-text="job.action")
              q-space
              div
                q-icon(name="mdi-clock" size="20px" left)
                time(v-text="$dayjs(job.metadata?.createdAt).format('DD/MM/YYYY HH:mm:ss').toString()")
        q-card(flat)
          q-tabs(
            v-model="tabs[key]"
            align="justify"
            dense
          )
            q-tab(name="params") Paramètres d'appel
            q-tab(name="result") Résultat
            q-btn(
              v-if="tabs[key]"
              @click="delete tabs[key]"
              slot="right"
              color="primary"
              icon="mdi-close"
              flat
            )
          q-tab-panels.overflow-auto(v-model="tabs[key]" style="max-height: 300px")
            q-tab-panel(name="params")
              pre(v-html="JSON.stringify(job.params, null, 2)")
            q-tab-panel(name="result")
              pre(v-html="JSON.stringify(job.result, null, 2)")
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

const scrollTargetRef = ref(null)
const tabs = ref([])

const $route = useRoute();

const offset = ref(0);
const query = computed(() => {
  return {
    limit: 10,
    skip: offset.value * 10,
    'sort[metadata.lastUpdatedAt]': 'desc',
    ...$route.query,
  };
});

const jobs = ref<any>([]);

const load = async (index, done) => {
  offset.value = index;
  const { data, pending, error, refresh } = await useHttp<any>(`/core/jobs/`, {
    method: 'GET',
    query,
  });

  jobs.value.push(...data.value.data);
  done(data.value.data.length === 0);
}
</script>
