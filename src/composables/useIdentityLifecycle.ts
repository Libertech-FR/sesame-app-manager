
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
  { value: IdentityLifecycle.IMPORTED, text: 'Importé', color: '#F0E68C', icon: 'mdi-circle', display: true }, // Khaki
  { value: IdentityLifecycle.OFFICIAL, text: 'Officiel', color: '#228B22', icon: 'mdi-circle', display: true }, // Forest Green
  { value: IdentityLifecycle.ACTIVE, text: 'Actif', color: '#00FF00', icon: 'mdi-circle', display: true }, // Lime
  { value: IdentityLifecycle.PROVISIONAL, text: 'Provisoir', color: '#FFD700', icon: 'mdi-circle', display: true }, // Gold
  { value: IdentityLifecycle.INACTIVE, text: 'Inactif', color: '#808080', icon: 'mdi-circle', display: true }, // Gray
  { value: IdentityLifecycle.DELETED, text: 'Supprimé', color: '#FF0000', icon: 'mdi-circle', display: true }, // Red
];

export function useIdentityLifecycles(): useIdentityLifecycleReturnType {
    function getLifecycleName(state: number): string {
      const found = IdentityLifecycleList.find(item => item.value === state);
      if (found && found?.display) return found.text;
      return 'Inconnu';
    }

    function getLifecycleColor(state: number): string {
      const found = IdentityLifecycleList.find(item => item.value === state);
      if (found && found?.display) return found.color;
      return 'grey';
    }

    function getLifecycleIcon(state: number): string {
      const found = IdentityLifecycleList.find(item => item.value === state);
      if (found && found?.display) return found.icon;
      return 'mdi-circle';
    }

    function getLifecycleInfos(state: number): { color: string, name: string, icon: string, value: number }{
      const found = IdentityLifecycleList.find(item => item.value === state);
      if (found && found?.display) return {
        color: found.color,
        name: found.text,
        icon: found.icon,
        value: state
      };
      return {
          color: 'grey',
          name: 'Inconnu',
          icon: 'mdi-circle',
          value: state
      };
    }


  return { getLifecycleName, getLifecycleColor, getLifecycleIcon, getLifecycleInfos };
}
