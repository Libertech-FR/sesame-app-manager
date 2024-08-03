<template>

    <div class="q-pa-md q-gutter-lg">
      <div class="row">

        <q-input type="number" outlined v-model="len"  input-class="text-right" label="Longueur minimale " dense>

        </q-input>

      </div>
      <div row="row">
        <q-toggle
          v-model="hasUpper"
          color="green"
          label="Doit contenir au moins une Majuscule"
        />
        </div>
        <div row="row">
          <q-toggle
            v-model="hasLower"
            color="blue"
            label="Doit contenir au moins une Minuscule"
          />
        </div>
      <div row="row">
        <q-toggle
          v-model="hasNumber"
          color="orange"
          label="Doit contenir au moins un chiffre"
        />
      </div>
      <div row="row">
        <q-toggle
          v-model="hasSpecialChars"
          color="blue"
          label="Doit contenir au moins un caractère special"
        />
      </div>
      <div row="row">
      <q-toggle
        v-model="hasSpecialChars"
        color="black"
        label="Vérifier si le mot de pass est connu avec pwned "
      />

    </div>
      <div row="row">
        <q-toggle
          v-model="smsEnabled"
          color="red"
          label="Reinitialisation par SMS active"
        />
      </div>
      <div class="row">
        <q-input style="width:50%" type="text" outlined v-model="mailAttribute"   label="Attribut de l'identité contenant le mail alternatif " dense/>
      </div>
      <div class="row">
        <q-input style="width:50%" type="text" outlined v-model="mobileAttribute"   label="Attribut de l'identité contenant le numero de mobile " dense/>
      </div>
      <div class="row">
        <q-input style="width:50%" type="url" outlined v-model="urlRedirect"   label="Url de redirection après un changement de mot de passe " dense/>
      </div>
      <div class="q-pa-md q-gutter-sm">
        <q-btn color="primary" style="width: 100%">
          <div class="ellipsis">
            Sauvegarder les parametres 
          </div>
        </q-btn>
      </div>
      </div>
</template>

<script setup>
const len=ref(8)
const hasUpper = ref(true)
const hasLower = ref(true)
const hasNumber= ref(true)
const hasSpecialChars=ref(true)
const checkPwned=ref(false)
const smsEnabled=ref(false)
const mailAttribute=ref('')
const mobileAttribute=ref('')
const urlRedirect=ref('')
</script>


<style scoped>

</style>
