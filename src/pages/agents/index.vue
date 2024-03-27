<template lang="pug">
div
  //- .q-px-md
    sesame-searchfilters(:fields="fieldsList")
  .q-px-md
    q-table.sesamesticky-last-column-table(
      :rows="agents?.data"
      :rows-per-page-options="[5, 10, 15]" :loading="pending" :columns="columns" row-key="_id" :visible-columns="visibleColumns"
      v-model:pagination="pagination" title="Agents" @request="onRequest($event, agents.total)"
      rows-per-page-label="Lignes par page" no-data-label="Aucune donnée" loading-label="Chargement..." no-results-label="Aucun résultat"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} sur ${totalRowsNumber} lignes`"
    )
      template(#top-right)
        //- sesame-table-top-right(:columns="columns" v-model="visibleColumns" @refresh="refresh")
      template(#body-cell-actions="props")
        q-td
          q-btn-group(flat rounded dark)
            q-btn(icon="mdi-pencil" color="primary" :to="'/agents/' + props.row._id" size="sm" flat)
              q-tooltip.text-body2(transition-show="scale" transition-hide="scale") Afficher l'agent
</template>

<script lang="ts" setup>
import usePagination from '~/composables/usePagination'
import { ref, provide, watch, computed } from 'vue'
import { useFetch, useRoute, useRouter } from 'nuxt/app'
import { useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { components, operations } from '#build/types/service-api'
type Agents = components['schemas']['AgentsDto']
type Response = operations['AgentsController_search']['responses']['200']['content']['application/json']

const daysjs = useDayjs()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

onMounted(() => {
  initializePagination(agents.value?.total)
})

const { pagination, onRequest, initializePagination } = usePagination()

const {
  data: agents,
  pending,
  refresh,
  error,
} = await useHttp<Response>('/core/agents', {
  method: 'get',
  query: computed(() => {
    return {
      ...route.query,
    }
  }),
})

if (error.value) {
  $q.notify({
    message: 'Impossible de récupérer les Agents',
    type: 'negative',
  })
}

const columns = ref<QTableProps['columns']>([
  {
    name: 'username',
    label: 'Nom d\'utilisateur',
    field: (row: Agents) => row.username,
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    label: 'Email',
    field: (row: Agents) => row.email,
    align: 'left',
    sortable: true,
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'left',
  },
])
const visibleColumns = ref<QTableProps['visibleColumns']>([
  'username',
  'email',
  'actions',
])
const columnsType = ref([
  { name: 'username', type: 'text' },
  { name: 'email', type: 'text' },
  { name: 'actions', type: 'text' },
  { name: 'actions', type: 'text' },
  { name: 'actions', type: 'text' },
])

function refreshEvent() {
  refresh()
}

const fieldsList = computed(() => {
  return columns.value!.reduce((acc: { name: string; label: string; type?: string }[], column) => {
    if (visibleColumns.value!.includes(column.name) && column.name !== 'actions' && column.name !== 'states') {
      const type = columnsType.value.find((type) => type.name === column.name)?.type
      acc.push({
        name: column.name,
        label: column.label,
        type,
      })
    }
    return acc
  }, [])
})

provide('fieldsList', fieldsList.value)
</script>
