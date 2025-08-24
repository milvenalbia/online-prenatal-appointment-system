export const pregnancy_tracking_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[5%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'age',
    title: 'Age',
    sortable: true,
    width: 'w-[5%]',
  },
  {
    key: 'year',
    title: 'Year',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'birthing_center',
    title: 'Birthing Center',
    sortable: false,
    width: 'w-[13%]',
  },
  {
    key: 'referral_center',
    title: 'Refferal Center',
    sortable: false,
    width: 'w-[12%]',
  },

  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[10%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },

  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'patient_id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
  {
    key: 'barangay_worker_id',
    hidden: true,
  },
  {
    key: 'midwife_id',
    hidden: true,
  },
  {
    key: 'region',
    hidden: true,
  },
  {
    key: 'province',
    hidden: true,
  },
  {
    key: 'municipality',
    hidden: true,
  },
  {
    key: 'barangay',
    hidden: true,
  },
  {
    key: 'gravidity',
    hidden: true,
  },
  {
    key: 'parity',
    hidden: true,
  },
  {
    key: 'lmp',
    hidden: true,
  },
  {
    key: 'edc',
    hidden: true,
  },
  {
    key: 'birthing_center_address',
    hidden: true,
  },
  {
    key: 'refferal_center_address',
    hidden: true,
  },
  {
    key: 'barangay_worker_name',
    hidden: true,
  },
  {
    key: 'midwife_name',
    hidden: true,
  },
  {
    key: 'health_station',
    hidden: true,
  },
  {
    key: 'rural_health_unit',
    hidden: true,
  },
];

export const barangay_center_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: true,
    width: 'w-[20%]',
  },
  {
    key: 'rural_health_unit',
    title: 'Rural Health Unit',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[25%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'region',
    hidden: true,
  },
  {
    key: 'province',
    hidden: true,
  },
  {
    key: 'municipality',
    hidden: true,
  },
  {
    key: 'barangay',
    hidden: true,
  },
];

export const barangay_worker_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[30%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const midwife_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  {
    key: 'fullname',
    title: 'Full Name',
    sortable: true,
    width: 'w-[15%]',
  },
  {
    key: 'health_station',
    title: 'Health Station',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'address',
    title: 'BHS Address',
    sortable: false,
    width: 'w-[30%]',
  },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const user_columns = [
  {
    key: 'index',
    title: 'No.',
    sortable: false,
    width: 'w-[10%]',
    render: (value, row, index) => {
      return <span className='ml-5'>{index + 1}</span>;
    },
  },
  { key: 'name', title: 'Name', sortable: true, width: 'w-[25%]' },
  { key: 'email', title: 'Email', sortable: true, width: 'w-[25%]' },
  { key: 'role', title: 'Role', sortable: false, width: 'w-[15%]' },
  {
    key: 'created_at',
    title: 'Created',
    sortable: true,
    width: 'w-[15%]',
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: 'id',
    hidden: true,
  },
];
