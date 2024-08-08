<template>
  <q-page class="container q-px-md">
      <sesame-searchfilters :fields="fieldsList"></sesame-searchfilters>
    <q-table
      flat bordered
      title="Identités"
      dense
      :rows="rows1"
      :columns="fieldsName"
      row-key="uid"
      :rows-per-page-options="[20,50,0]"
    >
      <template v-slot:top-left>
        <q-btn color="positive" icon="mdi-cloud-download" size="md" flat >
          Exporter

        </q-btn>
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts" setup>
import {computed, onMounted, provide, ref} from "vue";
import {useRoute} from "nuxt/app";
const route = useRoute()
const { columns, visibleColumns, columnsType } = useColumnsIdentites()



// prise de la requete qui est dans l'url mise par le filtre
const queryWithoutRead = computed(() => {
  const { read, ...rest } = route.query
  return {
    limit: 9999,
    ...rest,
  }
})
const { data: fieldsName, pending1, error1} = await useHttp('/management/identities/validation', {
  method: 'GET',
  transform: (result)=>{
    const allFields=result.data.flatMap((enr)=>{
      return Object.keys(enr[enr.name].properties)
    })
    return allFields.map((enr)=>{
      return {name:enr,field:enr,label:enr,align: 'left'}
    })
  }
});

const { data: rows1, pending, error, refresh } = await useHttp('/management/identities?sort[inetOrgPerson.cn]=asc', {
    method: 'GET',
    query:queryWithoutRead,
    transform: (result)=>{
      const allFields=result.data.map((enr)=>{
        let addF={}
        for (const [key, value] of Object.entries(enr?.additionalFields?.attributes||{})) {
          addF = {...addF, ...value}
        }
        const step1={...enr.inetOrgPerson,...addF}
        return step1
      })
      return allFields
    }
  });



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
