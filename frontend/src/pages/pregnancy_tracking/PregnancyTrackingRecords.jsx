import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { pregnancy_tracking_columns } from '../../utils/columns';
import { pdf } from '@react-pdf/renderer';
import PregnancyTrackingPDF from '../../components/interfaces/form-wizard/pdf/PregnancyTrackingPDF';

const PregnancyTrackingRecords = () => {
  const navigate = useNavigate();
  const dataTableRef = useRef();

  const handleEdit = (row) => {
    navigate('create', { state: { row } });
  };

  const handleAdd = () => {
    navigate('create');
  };

  const handelView = async (row) => {
    const blob = await pdf(
      <PregnancyTrackingPDF formData={row} patientType={''} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const columns = pregnancy_tracking_columns;

  return (
    <Container title={'Pregnancy Tracking'}>
      <DataTable
        title='Pregnancy Tracking'
        apiEndpoint='/api/pregnancy-trackings'
        columns={columns}
        onEdit={handleEdit}
        customActions={false}
        showDateFilter={true}
        showSearch={true}
        showPagination={true}
        showPerPage={true}
        showActions={true}
        defaultPerPage={8}
        onAdd={handleAdd}
        onView={handelView}
        addButton={'Create Pregnancy Tracking'}
        ref={dataTableRef}
      />
    </Container>
  );
};

export default PregnancyTrackingRecords;
