
type useIdentityLifecycleReturnType = {
  getLifecycleColor: (state: string) => string;
  getLifecycleName: (state: string) => string;
  getLifecycleIcon: (state: string) => string;
  getLifecycleInfos: (state: string) => { color: string, name: string, value: string, icon: string };
};


export enum IdentityLifecycle {
  WAIT = "W",
  OFFICIAL = "O",
  ACTIVE = "A",
  PROVISIONAL = "P",
  INACTIVE = "I",
  DELETED = "D",

  // IMPORTED = 3,
  // OFFICIAL = 2,
  // ACTIVE = 1,
  // PROVISIONAL = 0,
  // INACTIVE = -1,
  // DELETED = -2,
}


export const IdentityLifecycleList = [
  // { value: IdentityLifecycle.IMPORTED, text: 'Importé', color: '#F0E68C', icon: 'mdi-clock', display: true }, // Khaki
  { value: IdentityLifecycle.OFFICIAL, text: 'Officiel', color: '#228B22', icon: 'mdi-clock', display: true }, // Forest Green
  {
    value: IdentityLifecycle.ACTIVE, text: 'Actif', color: '#00FF00', icon: 'mdi-clock-check', display: true
  }, // Lime
  { value: IdentityLifecycle.PROVISIONAL, text: 'Provisoir', color: '#FFD700', icon: 'mdi-progress-clock', display: true }, // Gold
  { value: IdentityLifecycle.INACTIVE, text: 'Inactif', color: '#808080', icon: 'mdi-clock-alert', display: true }, // Gray
  {
    value: IdentityLifecycle.DELETED, text: 'Supprimé', color: '#FF0000', icon: 'mdi-archive-clock', display: true
  }, // Red
];

export function useIdentityLifecycles(): useIdentityLifecycleReturnType {
  function getLifecycleName(state: string): string {
    const found = IdentityLifecycleList.find(item => item.value === state);
    if (found && found?.display) return found.text;
    return 'Inconnu';
  }

  function getLifecycleColor(state: string): string {
    const found = IdentityLifecycleList.find(item => item.value === state);
    if (found && found?.display) return found.color;
    return 'grey';
  }

  function getLifecycleIcon(state: string): string {
    const found = IdentityLifecycleList.find(item => item.value === state);
    if (found && found?.display) return found.icon;
    return 'mdi-circle';
  }

  function getLifecycleInfos(state: string): { color: string, name: string, icon: string, value: string } {
    const found = IdentityLifecycleList.find(item => item.value === state);
    if (found && found?.display) return {
      color: found.color,
      name: found.text,
      icon: found.icon,
      value: state,
    };
    return {
      color: 'grey',
      name: 'Inconnu',
      icon: 'mdi-help-rhombus-outline',
      value: state,
    };
  }


  return { getLifecycleName, getLifecycleColor, getLifecycleIcon, getLifecycleInfos };
}
