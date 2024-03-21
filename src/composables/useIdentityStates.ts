type useIdentityStateReturnType = {
    getStateColor: (state: number) => string;
    getStateName: (state: number) => string;
    getStateInfos: (state: number) => { color: string, name: string, value: number };
};

export enum IdentityState {
  SYNCED = 3,
  TO_SYNC = 2,
  TO_VALIDATE = 1,
  UNKNOWN = 0,
  TO_CREATE = -1,
  TO_COMPLETE = -2,
  ON_ERROR = -3,
}

export const IdentityStateList = [
    { value: IdentityState.SYNCED, text: 'Synchronized', color: 'info', icon: 'mdi-circle' },
    { value: IdentityState.TO_SYNC, text: 'To sync', color: 'grey', icon: 'mdi-circle' },
    { value: IdentityState.TO_VALIDATE, text: 'To validate', color: 'positive', icon: 'mdi-circle' },
    { value: IdentityState.UNKNOWN, text: 'Unknown', color: 'grey', icon: 'mdi-circle' },
    { value: IdentityState.TO_CREATE, text: 'To create', color: 'grey', icon: 'mdi-circle' },
    { value: IdentityState.TO_COMPLETE, text: 'To complete', color: 'warning', icon: 'mdi-circle' },
    { value: IdentityState.ON_ERROR, text: 'On error', color: 'negative', icon: 'mdi-circle' },
];

export function useIdentityStates(): useIdentityStateReturnType
{
    function getStateColor(state: number): string {
        return IdentityStateList.find(item => item.value === state)?.color || 'grey';
    }

    function getStateName(state: number): string {
        return IdentityStateList.find(item => item.value === state)?.text || 'Unknown';
    }

    function getStateIcon(state: number): string {
            return IdentityStateList.find(item => item.value === state)?.icon || 'mdi-circle';
    }


    function getStateInfos(state: number): { color: string, name: string, icon: string, value: number }{
        const found = IdentityStateList.find(item => item.value === state);
        return {
            color: found ? found.color : 'grey',
            name: found ? found.text : 'Unknown',
            icon: found ? found.icon : 'mdi-circle',
            value: state
        };
    }

    return { getStateColor, getStateName, getStateInfos};
}

