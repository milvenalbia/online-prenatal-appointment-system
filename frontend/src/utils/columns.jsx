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
    key: 'firstname',
    hidden: true,
  },
  {
    key: 'lastname',
    hidden: true,
  },
  {
    key: 'middlename',
    hidden: true,
  },
  {
    key: 'birth_date',
    hidden: true,
  },
  {
    key: 'birth_place',
    hidden: true,
  },
  {
    key: 'religion',
    hidden: true,
  },
  {
    key: 'contact_person_name',
    hidden: true,
  },
  {
    key: 'contact_person_number',
    hidden: true,
  },
  {
    key: 'contact_person_relationship',
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
    key: 'region_id',
    hidden: true,
  },
  {
    key: 'province_id',
    hidden: true,
  },
  {
    key: 'municipality_id',
    hidden: true,
  },
  {
    key: 'barangay_id',
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
  {
    key: 'role',
    title: 'Role',
    sortable: false,
    width: 'w-[15%]',
    render: (value, row, index) => {
      return <span className='capitalize'>{value.role}</span>;
    },
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
    key: 'role_id',
    hidden: true,
  },
  {
    key: 'barangay_center_id',
    hidden: true,
  },
];

export const prenatal_visit_column = [
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
    key: 'date',
    title: 'Date',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'Weight',
    title: 'Weight',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'bp',
    title: 'B/P',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'temp',
    title: 'Temp',
    sortable: false,
    width: 'w-[5%]',
  },

  {
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[20%]',
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
    key: 'firstname',
    hidden: true,
  },
  {
    key: 'lastname',
    hidden: true,
  },
  {
    key: 'middlename',
    hidden: true,
  },
  {
    key: 'birth_date',
    hidden: true,
  },
  {
    key: 'contact',
    hidden: true,
  },
  {
    key: 'contact_person_name',
    hidden: true,
  },
  {
    key: 'contact_person_number',
    hidden: true,
  },
  {
    key: 'contact_person_relationship',
    hidden: true,
  },
  {
    key: 'patient_id',
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
    key: 'rr',
    hidden: true,
  },
  {
    key: 'pr',
    hidden: true,
  },
  {
    key: 'two_sat',
    hidden: true,
  },
  {
    key: 'fht',
    hidden: true,
  },
  {
    key: 'fh',
    hidden: true,
  },
  {
    key: 'aog',
    hidden: true,
  },
];

export const out_patient_column = [
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
    key: 'date',
    title: 'Date',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'time',
    title: 'Time',
    sortable: true,
    width: 'w-[10%]',
  },
  {
    key: 'Weight',
    title: 'Weight',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'bp',
    title: 'B/P',
    sortable: false,
    width: 'w-[5%]',
  },
  {
    key: 'temp',
    title: 'Temp',
    sortable: false,
    width: 'w-[5%]',
  },

  {
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'id',
    hidden: true,
  },
  {
    key: 'firstname',
    hidden: true,
  },
  {
    key: 'lastname',
    hidden: true,
  },
  {
    key: 'middlename',
    hidden: true,
  },
  {
    key: 'birth_date',
    hidden: true,
  },
  {
    key: 'birth_place',
    hidden: true,
  },
  {
    key: 'contact',
    hidden: true,
  },
  {
    key: 'contact_person_name',
    hidden: true,
  },
  {
    key: 'contact_person_number',
    hidden: true,
  },
  {
    key: 'contact_person_relationship',
    hidden: true,
  },
  {
    key: 'patient_id',
    hidden: true,
  },
  {
    key: 'rr',
    hidden: true,
  },
  {
    key: 'pr',
    hidden: true,
  },
  {
    key: 'two_sat',
    hidden: true,
  },
  {
    key: 'status',
    hidden: true,
  },
  {
    key: 'religion',
    hidden: true,
  },
  {
    key: 'height',
    hidden: true,
  },
];

export const immunization_records_columns = [
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
    key: 'patient_address',
    title: 'Address',
    sortable: false,
    width: 'w-[20%]',
  },
  {
    key: 'tetanus_last_vaccine',
    title: 'Tetanus',
    sortable: false,
    width: 'w-[10%]',
  },
  {
    key: 'covid_last_vaccine',
    title: 'Covid',
    sortable: false,
    width: 'w-[10%]',
  },
  {
    key: 'other_last_vaccine',
    title: 'Other',
    sortable: false,
    width: 'w-[10%]',
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
    key: 'patient_id',
    hidden: true,
  },
  {
    key: 'tetanus_vaccine_id',
    hidden: true,
  },
  {
    key: 'covid_vaccine_id',
    hidden: true,
  },
  {
    key: 'tetanus_first_given',
    hidden: true,
  },
  {
    key: 'tetanus_second_give',
    hidden: true,
  },
  {
    key: 'tetanus_third_given',
    hidden: true,
  },
  {
    key: 'tetanus_fourth_given',
    hidden: true,
  },
  {
    key: 'tetanus_fifth_given',
    hidden: true,
  },
  {
    key: 'covid_first_given',
    hidden: true,
  },
  {
    key: 'covid_second_given',
    hidden: true,
  },
  {
    key: 'covid_third_given',
    hidden: true,
  },
  {
    key: 'other_first_given',
    hidden: true,
  },
  {
    key: 'other_second_given',
    hidden: true,
  },
  {
    key: 'other_third_given',
    hidden: true,
  },
  {
    key: 'other_fourth_given',
    hidden: true,
  },
  {
    key: 'other_fifth_given',
    hidden: true,
  },
  {
    key: 'tetanus_first_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_second_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_third_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_fourth_comeback',
    hidden: true,
  },
  {
    key: 'tetanus_fifth_comeback',
    hidden: true,
  },
  {
    key: 'covid_first_give',
    hidden: true,
  },
  {
    key: 'covid_second_comeback',
    hidden: true,
  },
  {
    key: 'covid_third_comeback',
    hidden: true,
  },
  {
    key: 'other_first_comeback',
    hidden: true,
  },
  {
    key: 'other_second_comeback',
    hidden: true,
  },
  {
    key: 'other_third_comeback',
    hidden: true,
  },
  {
    key: 'other_fourth_comeback',
    hidden: true,
  },
  {
    key: 'other_fifth_comeback',
    hidden: true,
  },
];
