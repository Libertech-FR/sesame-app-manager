import { defineStore } from 'pinia';

export const useIdentityAffectationStore = defineStore('identityAffectations', {
  state: () => ({
    adm: 0,
    esn: 0,
    etd: 0,
  }),
  getters: {
    getAdmCount: state => state.adm,
    getEsnCount: state => state.esn,
    getEtdCount: state => state.etd,
  },
  actions: {
    async fetchAllAffectationCount() {
      try {
        await Promise.all([
          this.fetchAdmCount(),
          this.fetchEsnCount(),
          this.fetchEtdCount(),
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAdmCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?&filters[^additionalFields.attributes.supannPerson.supannTypeEntiteAffectation]=/adm/i&limit=9999`);
        this['adm'] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchEsnCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[^additionalFields.attributes.supannPerson.supannTypeEntiteAffectation]=/esn/i&limit=9999`);
        this['esn'] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchEtdCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[^additionalFields.attributes.supannPerson.supannTypeEntiteAffectation]=/etd/i&limit=9999`);
        this['etd'] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    }
  }
});
