import { defineStore } from 'pinia';
import {IdentityState} from '@/composables/useIdentityStates';

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
        await Promise.all([
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
        const { data } = await useHttp('/management/identities/count?limit=1000');
        this.total = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },

    async fetchToCompleteCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[@state][]=${IdentityState.TO_COMPLETE}&limit=1000`);
        this[IdentityState.TO_COMPLETE] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchToValidateCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[@state][]=${IdentityState.TO_VALIDATE}&limit=1000`);
        this[IdentityState.TO_VALIDATE] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchOnErrorCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[@state][]=${IdentityState.ON_ERROR}&limit=1000`);
        this[IdentityState.ON_ERROR] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchToSyncCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[@state][]=${IdentityState.TO_SYNC}&limit=1000`);
        this[IdentityState.TO_SYNC] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchProcessingCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[@state][]=${IdentityState.PROCESSING}&limit=1000`);
        this[IdentityState.PROCESSING] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSyncedCount() {
      try {
        const { data } = await useHttp(`/management/identities/count?filters[@state][]=${IdentityState.SYNCED}&limit=1000`);
        this[IdentityState.SYNCED] = data.value.data;
      } catch (error) {
        console.error(error);
      }
    },
  }
});
