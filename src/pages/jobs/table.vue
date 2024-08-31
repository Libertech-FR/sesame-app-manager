<template>
  <q-page class="container">
    <div class="col-12">
      <q-btn @click="push('/jobs/table')" color="positive" glossy label=" Afficher les 1000 dernieres entrées" />
      <q-btn @click="push('/jobs/table?filters[:state]=-1')" color="negative" glossy label=" Afficher que les erreurs" />
    </div>
    <q-table
      flat bordered
      title="Journal"
      dense
      :rows="rows"
      :columns="columns"
      row-key="jobId"
      :rows-per-page-options="[20,50,0]"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th>
          </q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-bold"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <q-btn size="xs" :color="getColorState(props.row.state)" round dense @click="props.expand = !props.expand" :icon="getIconState(props.row.state)" />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            {{ col.name === 'state'?getStatusText(col.value):col.value }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <pre class="text-caption"  v-html="JSON.stringify(props.row?.result, null, 2)"/>
          </q-td>
        </q-tr>
      </template>



    </q-table>
  </q-page>

</template>
<script setup>



const $dayjs = useDayjs();
const $route=useRoute()
const router = useRouter()

const foptions=[
    "En erreur","Ok"
]
const columns=[
  { name: 'state',
    title: 'Statut',
    field:'state',
    label: 'Statut'},
  { name: 'jobId',
    title: 'Job Id',
    field:'jobId',
    align: 'right',
    label: 'N° Job'
  },
  {
    name: 'date',
    title: 'Date',
    field: (row)=>$dayjs(row.metadata?.lastUpdatedAt).format('DD/MM/YYYY HH:mm:ss').toString(),
    align: 'left',
    label: 'Date'
  },{
    name: 'identity',
    title: 'Identité',
    field: (row)=>row?.concernedTo?.name,
    align: 'left',
    label: 'Identité'
  },{
    name: 'action',
    title: 'Action',
    field:'action',
    align: 'left',
    label: 'Action'
  }
]
const query = computed(() => {
  return {
    limit: 2000,
    skip: 0,
    'sort[metadata.lastUpdatedAt]': 'desc',
    ...$route.query,
  };
});
const { data:rows, pending, error, refresh } = await useHttp('/core/jobs/', {
  method: 'GET',
  transform: (result) => {
    const data=  result.data.map((enr) => {
      return enr
    });
    return data
  },
  query

});

function getColorState(state){
  switch(state){
    case -1:
      return 'negative'
    case 9:
      return 'positive'
    case 0:
      return 'warning'
  }
  return 'primary'
}
function getStatusText(state){
  switch(state){
    case -1:
      return 'ERR'
    case 9:
      return 'OK'

  }
  return " "
}
function getIconState(state){
  switch(state){
    case -1:
      return "mdi-account-remove"
    case 9:
      return "mdi-account-check"
    case 0:
      return "mdi-account-sync"
  }
}
function push(path) {
  router.push(path)
}
</script>



<style scoped>

</style>
