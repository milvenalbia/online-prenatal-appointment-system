import React, { useRef } from 'react';
import { useNavigate } from 'react-router';
import { pdf } from '@react-pdf/renderer';
import Container from '../../components/ui/Container';
import DataTable from '../../components/ui/Datatable';
import { pregnancy_tracking_columns } from '../../utils/columns';
import { useAuthStore } from '../../store/AuthStore.js';
import PregnancyTrackingPDF from '../../components/interfaces/pdf/PregnancyTrackingPDF.jsx';

const PregnancyTrackingRecords = () => {
  const navigate = useNavigate();
  const dataTableRef = useRef();
  const { user } = useAuthStore();

  const handleEdit = (row) => {
    navigate('create', { state: { row } });
  };

  const handleAdd = () => {
    navigate('create');
  };

  const handelDownload = async (row) => {
    const blob = await pdf(
      <PregnancyTrackingPDF formData={row} patientType={''} />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    // ✅ Trigger browser download
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pregnancy-tracking.pdf'; // filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
        defaultPerPage={10}
        onAdd={user.role_id === 3 ? '' : handleAdd}
        onDownload={handelDownload}
        addButton={user.role_id !== 2 ? '' : 'Create Pregnancy Tracking'}
        hasSortByCategory
        hasSortByStatus
        hasAdvanceFilter
        ref={dataTableRef}
      />
    </Container>
  );
};

export default PregnancyTrackingRecords;
