<template lang="pug">
  q-page.container
    //- pre(v-html="JSON.stringify(expanded)")
    q-table(
      flat bordered dense
      ref="tableRef"
      title="Derniers cycles de vie"
      :rows="rows"
      :columns="columns"
      row-key="_id"
      v-model:pagination="pagination"
      v-model:expanded="expanded"
      :loading="pending"
      :filter="filter"
      binary-state-sort
      @request="onRequest"
    )
      template(#header="props")
        q-tr(:props="props")
          q-th.text-bold(
            v-for="col in props.cols"
            :key="col.name" :props="props"
          ) {{ col.label }}
          q-th
      template(#body="props")
        q-tr(:props="props" :class="{ 'bg-primary': props.expand }")
          q-td(
            v-for="col in props.cols.filter(c => c.name !== 'expand')"
            :key="col.name"
            :props="props"
          ) {{ col.value }}
          q-td.text-center(auto-width)
            q-btn(
              @click="expandRow(props)"
              :icon="props.expand ? 'mdi-minus' : 'mdi-plus'"
              :disable="!props.row"
              size="sm" color="primary"
              round dense elevation="0"
            )
        q-tr(v-if="props.expand" :props="props")
          q-td(colspan="100%" style="padding: 0;")
            MonacoEditor(
              :model-value="JSON.stringify(props.row, null, 2)"
              lang="json"
              :options="monacoOptions"
              style="height: 400px; width: 100%;"
            )
</template>

<script lang="ts">
import exp from 'constants'
import dayjs from 'dayjs'

export default {
  name: 'LifecyclesTablePage',
  data() {
    return {
      tableRef: ref(),
      filter: ref(''),
      expanded: ref<any[]>([]),
      pagination: ref({
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 3,
        rowsNumber: 10,
      }),
      columns: [
        {
          name: 'identity',
          align: 'center',
          label: 'Identité(e)',
          field: (row) => row?.refId?.inetOrgPerson?.cn || '<Inconnu>',
          format: (cn) => `${cn}`,
          sortable: true,
        },
        {
          name: 'lifecycle',
          required: true,
          label: 'Cycle',
          align: 'left',
          field: (row) => row.lifecycle,
          format: (lifecycle) => `${lifecycle}`,
          sortable: true,
        },
        {
          name: 'date',
          required: true,
          label: 'Date',
          align: 'left',
          field: (row) => row.date,
          format: (date) => `${dayjs(date).format('DD/MM/YYYY HH:mm:ss')}`,
          sortable: true,
        },
      ],
    }
  },
  async setup() {
    const {
      data: rows,
      pending,
      error,
      refresh,
    } = await useHttp(`/management/lifecycle/recent`, {
      method: 'GET',
      transform: (context: { statusCode: number; data: any[] }) => context?.data || [],
    })
    return {
      rows,
      pending,
    }
  },
  computed: {
    isDark(): boolean {
      return this.$q.dark.isActive
    },
    monacoOptions() {
      return {
        theme: this.isDark ? 'vs-dark' : 'vs-light',
        readOnly: true,
        minimap: {
          enabled: true,
        },
      }
    },
  },
  methods: {
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination
      const filter = props.filter

      console.log('Requesting data with:', {
        page,
        rowsPerPage,
        sortBy,
        descending,
        filter,
      })
    },
    expandRow(props) {
      this.expanded = this.expanded.includes(props.row._id) ? [] : [props.row._id]
      // props.expand = !props.expand
    },
  },
  onMounted() {
    this.$nextTick(() => {
      this.tableRef.value.requestServerInteraction()
    })
  },
}
</script>
