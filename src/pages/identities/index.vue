<template lang="pug">
div
  .q-px-md
    sesame-searchfilters(:fields="fieldsList")
  .q-px-md
    q-table.sesamesticky-last-column-table(
      :rows="identities?.data"
      :rows-per-page-options="[5, 10, 15]" :loading="pending" :columns="columns" row-key="_id" :visible-columns="visibleColumns"
      v-model:pagination="pagination" title="Identitiées" @request="onRequest($event, identities.total)"
      rows-per-page-label="Lignes par page" no-data-label="Aucune donnée" loading-label="Chargement..." no-results-label="Aucun résultat"
      :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} sur ${totalRowsNumber} lignes`"
      selection="multiple" v-model:selected="selected" :selected-rows-label="(numberOfRows) => `${numberOfRows} identitées sélectionnées`"
    )
      template(#top-left)
        sesame-table-top-left(:selected="selected" @updateLifestep="updateLifestep($event)" @clear="selected = []")
      template(#top-right)
        sesame-table-top-right(:columns="columns" v-model="visibleColumns" @refresh="refresh")
      template(#body-cell-actions="props")
        sesame-table-actions(:identity="props.row" @updateLifestep="updateLifestep($event)")
      template(#body-cell-states="props")
        sesame-table-state-col(:identity="props.row")
      template(#body-cell-inetOrgPerson.cn="props")
        td
          span {{ props.row.inetOrgPerson.cn }} {{ props.row.inetOrgPerson.givenName }}

</template>

<script lang="ts" setup>
import usePagination from '~/composables/usePagination'
import { ref, provide, watch, computed } from 'vue'
import { useFetch, useRoute, useRouter } from 'nuxt/app'
import { useQuasar } from 'quasar'
import type { QTableProps } from 'quasar'
import type { components, operations } from '#build/types/service-api'
type Identity = components['schemas']['IdentitiesDto']
type Response = operations['IdentitiesController_search']['responses']['200']['content']['application/json']


const daysjs = useDayjs()
const route = useRoute()
const router = useRouter()
const $q = useQuasar()

onMounted(() => {
  initializePagination(identities.value?.total)
})

const closeTicketsDialog = ref<boolean>(false)
const { pagination, onRequest, initializePagination } = usePagination()

const {
  data: identities,
  pending,
  refresh,
  error,
} = await useFetch<Response>('/management/identities', {
  method: 'get',
  query: computed(() => {
    return {
      ...route.query,
    }
  }),
})

if (error.value) {
  $q.notify({
    message: 'Impossible de récupérer les identités',
    type: 'negative',
  })
}

const columns = ref<QTableProps['columns']>([
  {
    name: 'states',
    label: 'Etats',
    field: 'states',
    align: 'left',
  },
  {
    name: 'inetOrgPerson.uid',
    label: 'ID',
    field: (row: Identity) => row.inetOrgPerson.uid,
    align: 'left',
    sortable: true,
  },
  {
    name: 'additionalFields.attributes.supann.supannTypeEntiteAffectation',
    label: 'Affectation',
    field: (row: Identity) => row.additionalFields?.attributes.supann.supannTypeEntiteAffectation,
    align: 'left',
    sortable: true,
  },
  // {
  //   name: 'envelope.observers.name',
  //   label: 'Concerné',
  //   field: (row: Ticket) => row.envelope.observers,
  //   align: 'left',
  //   sortable: true,
  // },
  // {
  //   name: 'envelope.assigned.name',
  //   label: 'Assigné',
  //   field: (row: Ticket) => row.envelope.assigned,
  //   align: 'left',
  //   sortable: true,
  // },
  {
    name: 'inetOrgPerson.cn',
    label: 'Identité',
    field: (row: Identity) => row.inetOrgPerson.cn,
    align: 'left',
    sortable: true,
  },
  {
    name: 'metadata.lastUpdatedAt',
    label: 'Date de modification',
    field: (row: Identity) => row?.metadata?.lastUpdatedAt,
    format: (val: string) => daysjs(val).format('DD/MM/YYYY HH:mm'),
    align: 'left',
    sortable: true,
  },
  {
    name: 'metadata.createdAt',
    label: 'Date de création',
    field: (row: Identity) => row?.metadata?.createdAt,
    format: (val: string) => daysjs(val).format('DD/MM/YYYY HH:mm'),
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
  'inetOrgPerson.uid',
  'additionalFields.attributes.supann.supannTypeEntiteAffectation',
  'envelope.observers.name',
  'envelope.assigned.name',
  'inetOrgPerson.cn',
  'metadata.lastUpdatedAt',
  'metadata.createdAt',
  'actions',
  'states',
])
const columnsType = ref([
  { name: 'inetOrgPerson.uid', type: 'text' },
  { name: 'additionalFields.attributes.supann.supannTypeEntiteAffectation', type: 'text' },
  { name: 'envelope.observers.name', type: 'text' },
  { name: 'envelope.assigned.name', type: 'text' },
  { name: 'inetOrgPerson.cn', type: 'text' },
  { name: 'metadata.lastUpdatedAt', type: 'date' },
  { name: 'metadata.createdAt', type: 'date' },
  { name: 'actions', type: 'text' },
  { name: 'actions', type: 'text' },
  { name: 'actions', type: 'text' },
])

const selected = ref([])

function refreshEvent() {
  refresh()
  selected.value = []
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
