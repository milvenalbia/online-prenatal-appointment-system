import React, { useRef, useState } from 'react';
import DataTable from '../../components/ui/Datatable';
import Container from '../../components/ui/Container';
import { immunization_records_columns } from '../../utils/columns';
import FormModal from '../../components/ui/FormModal';
import { useFormSubmit } from '../../utils/functions';
import ImmunizationForm from '../../components/forms/ImmunizationForm';

const ImmunizationRecords = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState();
  const [immunizationId, setImmunizationId] = useState(0);
  const dataTableRef = useRef();

  const { handleSubmit, isSubmitting, error, setError } = useFormSubmit();

  const vaccineFields = {
    tetanus: ['first', 'second', 'third', 'fourth', 'fifth'],
    covid: ['first', 'second', 'booster'],
    other: ['first', 'second', 'third', 'fourth', 'fifth'],
  };

  const buildDefaults = () => {
    let defaults = { patient_id: '', other_vaccine_name: '' };

    Object.entries(vaccineFields).forEach(([prefix, doses]) => {
      doses.forEach((dose) => {
        defaults[`${prefix}_${dose}_given`] = '';
        defaults[`${prefix}_${dose}_comeback`] = '';
      });
    });

    return defaults;
  };

  const closeModal = () => {
    setIsOpen(false);
    if (isEdit) {
      setImmunizationId(0);
      setIsEdit(false);
    }

    setError({});
    setFormData({
      patient_id: '',

      tetanus_first_given: '',
      tetanus_second_given: '',
      tetanus_third_given: '',
      tetanus_fourth_given: '',
      tetanus_fifth_given: '',

      tetanus_first_comeback: '',
      tetanus_second_comeback: '',
      tetanus_third_comeback: '',
      tetanus_fourth_comeback: '',
      tetanus_fifth_comeback: '',

      covid_first_given: '',
      covid_second_given: '',
      covid_booster_given: '',

      covid_first_comeback: '',
      covid_second_comeback: '',
      covid_booster_comeback: '',

      other_vaccine_name: 'H',
      other_first_given: '',
      other_second_given: '',
      other_third_given: '',
      other_fourth_given: '',
      other_fifth_given: '',

      other_first_comeback: '',
      other_second_comeback: '',
      other_third_comeback: '',
      other_fourth_comeback: '',
      other_fifth_comeback: '',
    });
  };

  const handleEdit = (row) => {
    setIsEdit(true);

    setImmunizationId(row.id);
    setFormData((prev) => ({
      ...buildDefaults(),
      ...row,
    }));

    setIsOpen(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setIsOpen(true);
    setFormData(buildDefaults());
    console.log(formData);
  };

  const onSubmit = (e) => {
    handleSubmit({
      e,
      isEdit,
      url: isEdit
        ? `/api/immunization-records/${immunizationId}`
        : '/api/immunization-records',
      formData,
      onSuccess: () => dataTableRef.current?.fetchData(),
      onReset: () => {
        setFormData({
          patient_id: '',

          tetanus_first_given: '',
          tetanus_second_given: '',
          tetanus_third_given: '',
          tetanus_fourth_given: '',
          tetanus_fifth_given: '',

          tetanus_first_comeback: '',
          tetanus_second_comeback: '',
          tetanus_third_comeback: '',
          tetanus_fourth_comeback: '',
          tetanus_fifth_comeback: '',

          covid_first_given: '',
          covid_second_given: '',
          covid_booster_given: '',

          covid_first_comeback: '',
          covid_second_comeback: '',
          covid_booster_comeback: '',

          other_vaccine_name: 'H',
          other_first_given: '',
          other_second_given: '',
          other_third_given: '',
          other_fourth_given: '',
          other_fifth_given: '',

          other_first_comeback: '',
          other_second_comeback: '',
          other_third_comeback: '',
          other_fourth_comeback: '',
          other_fifth_comeback: '',
        });
        setError({});
        setIsOpen(false);
        if (isEdit) {
          setImmunizationId(0);
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

  const columns = immunization_records_columns;

  return (
    <Container title={'Immunization Records'}>
      <DataTable
        title='Immunization Records'
        apiEndpoint='/api/immunization-records'
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
        addButton={'Add Immunization Record'}
        ref={dataTableRef}
      />
      {isOpen && (
        <FormModal
          closeModal={closeModal}
          isEdit={isEdit}
          title={'Immuzation Record'}
          className={'sm:max-w-3xl'}
        >
          <ImmunizationForm
            onSubmit={onSubmit}
            inputChange={inputChange}
            formData={formData}
            setFormData={setFormData}
            isEdit={isEdit}
            isSubmitting={isSubmitting}
            error={error}
            onClose={closeModal}
          />
        </FormModal>
      )}
    </Container>
  );
};

export default ImmunizationRecords;
