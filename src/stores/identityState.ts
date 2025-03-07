import { defineStore } from 'pinia';
import { IdentityState } from '@/composables/useIdentityStates';

export const useIdentityStateStore = defineStore('identityStates', {
  state: () => ({
    total: 0,
    [IdentityState.TO_COMPLETE]: 0,
    [IdentityState.TO_VALIDATE]: 0,
    [IdentityState.ON_ERROR]: 0,
    [IdentityState.TO_SYNC]: 0,
    [IdentityState.PROCESSING]: 0,
    [IdentityState.SYNCED]: 0,
  }),
  getters: {
    getStateValue: (state) => (key: IdentityState) => state[key],
    getTotalCount: state => state.total,
    getToCompleteCount: state => state[IdentityState.TO_COMPLETE],
    getToValidateCount: state => state[IdentityState.TO_VALIDATE],
    getOnErrorCount: state => state[IdentityState.ON_ERROR],
    getToSyncCount: state => state[IdentityState.TO_SYNC],
    getProcessingCount: state => state[IdentityState.PROCESSING],
    getSyncedCount: state => state[IdentityState.SYNCED],
  },
  actions: {
    async fetchAllStateCount() {
      try {
        Promise.all([
          this.fetchTotalCount(),
          this.fetchToCompleteCount(),
          this.fetchToValidateCount(),
          this.fetchOnErrorCount(),
          this.fetchToSyncCount(),
          this.fetchProcessingCount(),
          this.fetchSyncedCount(),
        ]);
      } catch (error) {
        console.error(error);
      }
    },
    async fetchTotalCount() {
      try {
        const { data } = await $http.$get('/management/identities/count?limit=99999999');
        this.total = data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchToCompleteCount() {
      try {
        const { data } = await $http.$get(`/management/identities/count?filters[@state][]=${IdentityState.TO_COMPLETE}&limit=99999999`);
        this[IdentityState.TO_COMPLETE] = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchToValidateCount() {
      try {
        const { data } = await $http.$get(`/management/identities/count?filters[@state][]=${IdentityState.TO_VALIDATE}&limit=99999999`);
        this[IdentityState.TO_VALIDATE] = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchOnErrorCount() {
      try {
        const { data } = await $http.$get(`/management/identities/count?filters[@state][]=${IdentityState.ON_ERROR}&limit=99999999`);
        this[IdentityState.ON_ERROR] = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchToSyncCount() {
      try {
        const { data } = await $http.$get(`/management/identities/count?filters[@state][]=${IdentityState.TO_SYNC}&limit=99999999`);
        this[IdentityState.TO_SYNC] = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchProcessingCount() {
      try {
        const { data } = await $http.$get(`/management/identities/count?filters[@state][]=${IdentityState.PROCESSING}&limit=99999999`);
        this[IdentityState.PROCESSING] = data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSyncedCount() {
      try {
        const { data } = await $http.$get(`/management/identities/count?filters[@state][]=${IdentityState.SYNCED}&limit=99999999`);
        this[IdentityState.SYNCED] = data;
      } catch (error) {
        console.error(error);
      }
    },
  }
});
