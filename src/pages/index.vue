<template lang="pug">
q-page
  q-toolbar
    q-toolbar-title Accueil
  .row
    .col-4(v-for="item in menu").flex.flex-center.q-pa-md
      q-btn(tile @click="push(item.path)" :color="item.color" style="width: 100%;")
        q-icon(:name="item.icon" left size="42px")
        span {{ item.label }}
</template>

<script lang="ts" setup>
const router = useRouter()

function push(path: string) {
  router.push(path)
}

const menu = ref([
  {
    icon: 'mdi-account',
    label: 'Liste des identités',
    path: '/identities',
    color: 'primary'
  },
  {
    icon: 'mdi-card-account-details',
    label: 'Liste des agents',
    path: '/account',
    color: 'primary'
  },
  {
    icon: 'mdi-account-check',
    label: 'A valider',
    path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=1',
    color: 'primary'
  },
  {
    icon: 'mdi-account-alert',
    label: 'A compléter',
    path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=-2',
    color: 'primary'
  },
  {
    icon: 'mdi-account-remove',
    label: 'En erreur',
    path: '/identities?sort[metadata.lastUpdatedAt]=desc&skip=0&limit=10&filters[@state][]=-3',
    color: 'primary'
  },
  {
    icon: 'mdi-cog',
    label: 'Paramètres',
    path: '/settings',
    color: 'primary'
  }
])

</script>
