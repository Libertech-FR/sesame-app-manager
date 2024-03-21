
type useIdentityLifecycleReturnType = {
    getLifecycleColor: (state: number) => string;
    getLifecycleName: (state: number) => string;
    getLifecycleIcon: (state: number) => string;
    getLifecycleInfos: (state: number) => { color: string, name: string, value: number };
};


export enum IdentityLifecycle {
  IMPORTED = 3,
  OFFICIAL = 2,
  ACTIVE = 1,
  PROVISIONAL = 0,
  INACTIVE = -1,
  DELETED = -2,
}


export const IdentityLifecycleList = [
  { value: IdentityLifecycle.IMPORTED, text: 'Imported', color: '#F0E68C', icon: 'mdi-circle' }, // Khaki
  { value: IdentityLifecycle.OFFICIAL, text: 'Official', color: '#228B22', icon: 'mdi-circle' }, // Forest Green
  { value: IdentityLifecycle.ACTIVE, text: 'Active', color: '#00FF00', icon: 'mdi-circle' }, // Lime
  { value: IdentityLifecycle.PROVISIONAL, text: 'Provisional', color: '#FFD700', icon: 'mdi-circle' }, // Gold
  { value: IdentityLifecycle.INACTIVE, text: 'Inactive', color: '#808080', icon: 'mdi-circle' }, // Gray
  { value: IdentityLifecycle.DELETED, text: 'Deleted', color: '#FF0000', icon: 'mdi-circle' }, // Red
];

export function useIdentityLifecycles(): useIdentityLifecycleReturnType {
    function getLifecycleName(state: number): string {
        return IdentityLifecycleList.find(item => item.value === state)?.text || 'Unknown';
    }

    function getLifecycleColor(state: number): string {
        return IdentityLifecycleList.find(item => item.value === state)?.color || 'grey';
    }

    function getLifecycleIcon(state: number): string {
        return IdentityLifecycleList.find(item => item.value === state)?.icon || 'mdi-circle';
    }

    function getLifecycleInfos(state: number): { color: string, name: string, icon: string, value: number }{
        const found = IdentityLifecycleList.find(item => item.value === state);
        return {
            color: found ? found.color : 'grey',
            name: found ? found.text : 'Unknown',
            icon: found ? found.icon : 'mdi-circle',
            value: state
        };
    }


  return { getLifecycleName, getLifecycleColor, getLifecycleIcon, getLifecycleInfos };
}
