<template>

  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" container style="height: 800px" class="shadow-2 rounded-borders">
      <q-header elevated :class="bg-primary">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="mdi-menu"/>
          <q-toolbar-title>Paramètres</q-toolbar-title>
          <q-btn icon="mdi-close" flat round dense v-close-popup/>
        </q-toolbar>
      </q-header>
      <q-drawer
        v-model="drawer"
        show-if-above
        :width="200"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit">
          <q-list>
            <q-item clickable @click="onAgents">
              <q-item-section avatar>
                <q-icon name="mdi-account"/>
              </q-item-section>
              <q-item-section>
                Utilisateurs
              </q-item-section>
            </q-item>
          </q-list>
          <q-list>
            <q-item clickable @click="onPassPolicy">
              <q-item-section avatar>
                <q-icon name="mdi-form-textbox-password"/>
              </q-item-section>
              <q-item-section>
                Politique de mot de passe
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding :class="$q.dark.isActive ? 'bg-black' : 'bg-white'">
          <sesame-agents v-if="agent === true"></sesame-agents>
          <sesame-password-policy v-if="passPolicy === true"></sesame-password-policy>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>


</template>

<script setup>
import {ref} from "vue";

const drawer = ref(false)
const agent=ref(false)
const passPolicy=ref(false)
function onAgents() {
  resetMenu()
  agent.value=true
}

function onPassPolicy() {
  resetMenu()
  passPolicy.value=true
}
function resetMenu(){
  agent.value=false
  passPolicy.value=false
}
</script>

<style scoped>

</style>
