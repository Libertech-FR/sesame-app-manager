import type { QTableProps } from 'quasar'
import type { components } from '#build/types/service-api'

type Identity = components['schemas']['IdentitiesDto']

interface ColumnConfig {
  name: string;
  label: string;
  field: string | ((row: any) => any);
  required?: boolean;
  align?: "left" | "right" | "center";
  sortable?: boolean;
  sort?: (a: any, b: any, rowA: any, rowB: any) => number;
  rawSort?: (a: any, b: any, rowA: any, rowB: any) => number;
  sortOrder?: "ad" | "da";
  format?: (val: any, row: any) => any;
  style?: string | ((row: any) => string);
  classes?: string | ((row: any) => string);
  headerStyle?: string;
  headerClasses?: string;
}

const config = useAppConfig()
const daysjs = useDayjs()

function processFieldValue(row: any, field: any) {
  if (field.type === 'function') {
    return eval(field.value);
  }
  return row[field];
}

function processFormat(value: any, format: any) {
  if (format && format.type === 'function') {
    return eval(format.value);
  }
  return value;
}

export function useColumnsIdentites() {
  const columns = ref<QTableProps['columns']>(
    [
      {
        name: 'states',
        label: 'Etats',
        field: 'states',
        align: 'left',
      },
      ...config?.identitiesColumns?.entries || [],
      {
        name: 'metadata.lastUpdatedAt',
        label: 'Date de modification',
        field: (row: Identity) => row?.metadata?.lastUpdatedAt,
        format: (val: string) => daysjs(val).format('DD/MM/YYYY HH:mm'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'metadata.createdAt',
        label: 'Date de création',
        field: (row: Identity) => row?.metadata?.createdAt,
        format: (val: string) => daysjs(val).format('DD/MM/YYYY HH:mm'),
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Actions',
        field: 'actions',
        align: 'left',
      },
    ].map((col: any) => ({
      ...col,
      field: typeof col.field === 'function' ? col.field : (row: Identity) => processFieldValue(row, col.field),
      format: typeof col.format === 'function' ? col.format : (val: any) => processFormat(val, col.format),
    })) as ColumnConfig[]
  );

  // const columns = ref<QTableProps['columns']>([
  //   {
  //     name: 'inetOrgPerson.uid',
  //     label: 'ID',
  //     field: (row: Identity) => row?.inetOrgPerson?.uid,
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'inetOrgPerson.employeeNumber',
  //     label: 'EmployeeNumber',
  //     field: (row: Identity) => row?.inetOrgPerson?.employeeNumber,
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'additionalFields.attributes.supannPerson.supannTypeEntiteAffectation',
  //     label: 'Affectation',
  //     field: (row: Identity) => row.additionalFields?.attributes?.supannPerson?.supannTypeEntiteAffectation,
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'inetOrgPerson.cn',
  //     label: 'Nom',
  //     field: (row: Identity) => row?.inetOrgPerson?.cn,
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'inetOrgPerson.givenName',
  //     label: 'Prénom',
  //     field: (row: Identity) => row?.inetOrgPerson?.givenName,
  //     align: 'left',
  //     sortable: false,
  //   },
  //   {
  //     name: 'metadata.lastUpdatedAt',
  //     label: 'Date de modification',
  //     field: (row: Identity) => row?.metadata?.lastUpdatedAt,
  //     format: (val: string) => daysjs(val).format('DD/MM/YYYY HH:mm'),
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'metadata.createdAt',
  //     label: 'Date de création',
  //     field: (row: Identity) => row?.metadata?.createdAt,
  //     format: (val: string) => daysjs(val).format('DD/MM/YYYY HH:mm'),
  //     align: 'left',
  //     sortable: true,
  //   },
  //   {
  //     name: 'actions',
  //     label: 'Actions',
  //     field: 'actions',
  //     align: 'left',
  //   },
  // ])

  return {
    columns,
  }
}
