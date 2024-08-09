<template>
  <q-table
    flat bordered
    title="Identités dons l'invitation n'est plus valide"
    dense
    :rows="rows1"
    :columns="fieldsName"
    selection="multiple"
    v-model:selected="selected"
    row-key="uid"
    :rows-per-page-options="[20,50,0]"
    rows-per-page-label="Lignes par page"
    no-data-label="Aucune donnée"
    loading-label="Chargement..."
    no-results-label="Aucun résultat"
    :pagination-label="(firstRowIndex, endRowIndex, totalRowsNumber) => `${firstRowIndex}-${endRowIndex} sur ${totalRowsNumber} lignes`"
    :selected-rows-label="(numberOfRows) => `${numberOfRows} entrée(s) sélectionnée(s)`"
  >
    <template v-slot:top-left>
      <q-btn color="primary" icon="mdi-email-sync" size="md" flat rounded @click="openInitModale" :disable="selected.length === 0">
        <q-tooltip class="text-body2" transition-show="scale" transition-hide="scale">Réenvoyer le mail d'invitation</q-tooltip>

      </q-btn>
    </template>
  </q-table>
</template>

<script setup>
import {ref} from "vue";
import updateInitModale from "../../components/updateInitModale.vue";
import {useQuasar} from "quasar";

const selected=ref([])
const $q=useQuasar()
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

const { data: rows1, pending, error, refresh } = await useHttp('/management/passwd/ioutdated', {
  method: 'GET',
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

function openInitModale() {


  $q.dialog({
    component: updateInitModale,
    componentProps: {
      selectedIdentities: selected.value,
      identityTypesName: name,
      allIdentitiesCount: rows1.length,
    },
  })
    .onOk(async (data) => {
      console.log('initIdentities', data)
      data.syncAllIdentities ? await sendInitToAllIdentities(identityState) : await sendInitToIdentity(props.selected, identityState)
    })
    .onCancel(() => {
      console.log('cancelinit')
    })
}
</script>

<style scoped>

</style>
