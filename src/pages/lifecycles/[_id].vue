<template lang="pug">
div
  .q-px-md.row
    q-space
    q-select.col-4(
      v-model="lifecyclesBy"
      :options="lifecyclesByOptions"
      label="Regrouper par"
      emit-value
      map-options
    )
  //-   sesame-searchfilters(:fields="fieldsList")
  q-timeline.q-px-lg
    q-infinite-scroll.q-px-lg(@load="load" :offset="250")
      template(#loading)
        .row.justify-center.q-my-md
          q-spinner-dots(color="primary" size="40px")
      //- q-timeline-entry.text-h5(icon='mdi-flag' title='Début du cycle de vie' color="green")

      template(v-for="(day, keyCompute) in computedLifecyclesByDays" :key="keyCompute")
        q-timeline-entry.text-h5(

        )
          time(v-text="keyCompute")
        q-timeline-entry(
          v-for="(lifecycle, key) in day" :key="key"
          :icon="getIconState(lifecycle.lifecycle)" :color="getColorState(lifecycle.lifecycle)"
        )
          template(#title)
            span(v-text="'[' + lifecycle._id + ']'")
            | &nbsp; - &nbsp;
            span(v-text="lifecycle.refId?.inetOrgPerson?.cn")
            | &nbsp; (
            small(v-text="lifecycle.refId?.inetOrgPerson?.uid")
            | )
          template(#subtitle)
            q-toolbar(dense)
              q-space
              q-icon(name="mdi-clock" size="20px" left)
              time(v-text="$dayjs(lifecycle.metadata?.createdAt).format('DD/MM/YYYY HH:mm:ss').toString()")
          q-card.q-pa-md.text-center(flat)
            p.q-mb-none.text-body1 {{ getLifecycleText(lifecycle.lifecycle) }}
            //- pre(v-html="JSON.stringify(lifecycle, null, 2)")
      q-timeline-entry.text-h5(v-if='empty' icon='mdi-flag-off' title='Fin de la liste...' color="red")
</template>

<script lang="ts" setup>
import { IdentityLifecycle } from '~/composables/useIdentityLifecycle'

// definePageMeta({
//   layout: 'empty',
// })

const scrollTargetRef = ref(null)
const tabs = ref([])

const $route = useRoute()
const $router = useRouter()
const $dayjs = useDayjs()

const offset = ref(0)
const query = computed(() => {
  return {
    limit: 10,
    skip: offset.value * 10,
    'sort[metadata.lastUpdatedAt]': 'desc',
    ...$route.query,
  }
})

const lifecyclesBy = computed({
  get: () => ($route.query.lifecyclesBy ? `${$route.query.lifecyclesBy}` : undefined),
  set: (value) => {
    $router.replace({
      query: {
        ...$route.query,
        lifecyclesBy: value,
      },
    })
  },
})
if (!lifecyclesBy.value) {
  console.log('lifecyclesBy.value', lifecyclesBy.value)
  lifecyclesBy.value = 'DD/MM/YYYY'
}

const lifecyclesByOptions = [
  { label: 'Jour', value: 'DD/MM/YYYY' },
  { label: 'Mois', value: 'MM/YYYY' },
  { label: 'Année', value: 'YYYY' },
]

const empty = ref(false)
const lifecycles = ref<any>([])

const computedLifecyclesByDays = computed(() => {
  const lifecyclesByDays = {}
  lifecycles.value.forEach((job) => {
    const day = $dayjs(job.metadata?.createdAt).format(lifecyclesBy.value)
    if (!lifecyclesByDays[day]) {
      lifecyclesByDays[day] = []
    }
    lifecyclesByDays[day].push(job)
  })
  return lifecyclesByDays
})

const _id = $route.params._id as string

const load = async (index, done) => {
  offset.value = index - 1
  const { data, pending, error, refresh } = await useHttp<any>(`/management/lifecycle/identity/${_id}`, {
    method: 'GET',
    query,
  })

  lifecycles.value.push(...data.value.data)
  empty.value = data.value.data.length === 0
  done(data.value.data.length === 0)
}
function getColorState(lifecycle) {
  switch (lifecycle) {
    case IdentityLifecycle.DELETED:
      return 'negative'
    case IdentityLifecycle.WAIT:
      return 'warning'
    case IdentityLifecycle.OFFICIAL:
      return 'info'
    case IdentityLifecycle.ACTIVE:
      return 'positive'
    case IdentityLifecycle.PROVISIONAL:
      return 'purple'
    case IdentityLifecycle.INACTIVE:
      return 'grey'
    default:
      return 'primary'
  }
}
function getIconState(lifecycle) {
  switch (lifecycle) {
    case IdentityLifecycle.DELETED:
      return 'mdi-account-remove'
    case IdentityLifecycle.WAIT:
      return 'mdi-clock-outline'
    case IdentityLifecycle.OFFICIAL:
      return 'mdi-circle'
    case IdentityLifecycle.ACTIVE:
      return 'mdi-emoticon'
    case IdentityLifecycle.PROVISIONAL:
      return 'mdi-human-queue'
    case IdentityLifecycle.INACTIVE:
      return 'mdi-power-sleep'
    default:
      return 'mdi-help'
  }
}
function getLifecycleText(lifecycle) {
  switch (lifecycle) {
    case IdentityLifecycle.DELETED:
      return 'Le compte est supprimer !'
    case IdentityLifecycle.WAIT:
      return 'Le compte est en attente de validation !'
    case IdentityLifecycle.OFFICIAL:
      return 'Le compte est officiel !'
    case IdentityLifecycle.ACTIVE:
      return 'Le compte est actif !'
    case IdentityLifecycle.PROVISIONAL:
      return 'Le compte est provisoire !'
    case IdentityLifecycle.INACTIVE:
      return 'Le compte est inactif !'
    default:
      return 'Impossible de récupérer le cycle de vie actuel !'
  }
}
</script>
