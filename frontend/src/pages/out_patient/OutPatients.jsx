import { useRef, useState } from 'react';
import DataTable from '../../components/ui/Datatable';
import Container from '../../components/ui/Container';
import { out_patient_column } from '../../utils/columns';
import FormModal from '../../components/ui/FormModal';
import InputGroup from '../../components/ui/InputGroup';
import { User } from 'lucide-react';
import SelectReact from '../../components/ui/SelectReact';
import { useFormSubmit } from '../../utils/functions';
import { useAuthStore } from '../../store/AuthStore';
const OutPatients = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    barangay_center_id: 0,
  });
  const [outPatientId, setOutPatientId] = useState(0);
  const dataTableRef = useRef();
  const { user } = useAuthStore();
  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setOutPatientId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData({
      firstname: '',
      lastname: '',
      barangay_center_id: 0,
    });
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setOutPatientId(row.id);
    setFormData({
      firstname: row.firstname,
      lastname: row.lastname,
      barangay_center_id: row.barangay_center_id,
    });

    setIsOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsOpen(true);
  };

  const onSubmit = (e) => {
    handleSubmit({
      e,
      isEdit,
      url: isEdit
        ? `/api/prenatal-visits/${outPatientId}`
        : '/api/prenatal-visits',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData({
          firstname: '',
          lastname: '',
          barangay_center_id: 0,
        });
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setOutPatientId(0);
          setIsEdit(false);
        }
      },
    });
  };

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = out_patient_column;

  return (
    <Container title={'Out Patients'}>
      <DataTable
        title='Out Patients'
        apiEndpoint='/api/out-patients'
        columns={columns}
        onEdit={handleEdit}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={10}
        onAdd={handleAdd}
        addButton={user.role_id !== 3 ? '' : 'Create Out Patient'}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isEdit}
          title={'Out Patient'}
        >
          <form onSubmit={onSubmit}>
            <div className='space-y-6 sm:w-auto'>
              <div className='flex justify-between gap-2 -mt-2'>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='firstname'
                    value={formData.firstname}
                    onChange={inputChange}
                    placeholder='Firstname'
                    icon={<User className='h-5 w-5 text-gray-400' />}
                    id={'firstname'}
                    hasLabel
                    label={'Firstname'}
                  />
                  {error.firstname && (
                    <p className='error -mt-4'>{error.firstname[0]}</p>
                  )}
                </div>
                <div className='w-full'>
                  <InputGroup
                    type='text'
                    name='lastname'
                    value={formData.lastname}
                    onChange={inputChange}
                    placeholder='Lastname'
                    icon={<User className='h-5 w-5 text-gray-400' />}
                    id={'lastname'}
                    hasLabel
                    label={'Lastname'}
                  />
                  {error.lastname && (
                    <p className='error -mt-4'>{error.lastname[0]}</p>
                  )}
                </div>
              </div>

              <SelectReact
                label='Heath Station'
                id='barangay_id'
                name='barangay_center_id'
                endpoint='/api/barangay-centers'
                placeholder='Choose a health station'
                formData={formData}
                setFormData={setFormData}
                labelKey={'health_station'}
              />
              {error.barangay_center_id && (
                <p className='error -mt-4'>{error.barangay_center_id[0]}</p>
              )}

              <button
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r text-white py-3 rounded-lg font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg 
                ${
                  isSubmitting
                    ? 'from-purple-300 to-pink-300 cursor-not-allowed'
                    : 'from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isSubmitting
                  ? isEdit
                    ? 'Updating ...'
                    : 'Creating ...'
                  : isEdit
                  ? 'Update'
                  : 'Create'}
              </button>
            </div>
          </form>
        </FormModal>
      )}
    </Container>
  );
};

export default OutPatients;
