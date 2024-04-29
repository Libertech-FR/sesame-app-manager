<template lang="pug">
q-page.container
  q-toolbar
    q-toolbar-title Accueil

  div.q-pa-md(v-for="part in menuParts", :key="part")
    q-separator.q-my-md
    div.text-h5.q-my-md {{ part }}

    div.row.q-gutter-md
      q-btn(v-for="item in getMenuByPart(part)" :key="item.label"
        tile color="primary"
        class="col-xs-12 col-sm-6 col-md-4 col-lg-3"
        :label="item.label"
        @click="push(item.path)"
        :icon="item.icon"
        style="height: 120px; font-size: 18px;")
          q-badge(v-if="item.badgeValue" :color="item.badge.color" floating) {{ item.badge.value }}
      //- span(v-for="item in getMenuByPart(part)" :key="item.label") {{ item }}
</template>

<script lang="ts" setup>
import { useIdentityStateStore } from '~/stores/identityState'
import { useIdentityAffectationStore } from '~/stores/identityAffectation'
import { useMenu } from '~/composables'

const router = useRouter()
const identityStateStore = useIdentityStateStore()
const identityAffectationStore = useIdentityAffectationStore()
const { fetchAllStateCount } = identityStateStore
const { fetchAllAffectationCount } = identityAffectationStore

const { getMenu, badgesValues, menuParts, getMenuByPart } = useMenu(identityStateStore, identityAffectationStore)

function push(path: string) {
  router.push(path)
}
</script>
