import api from '../../../api/axios';
import SelectReact from '../../ui/SelectReact';

const HealthcareProviders = ({ formData, setFormData, error }) => {
  const handleChangeName = async (value) => {
    setFormData((prev) => ({
      ...prev,
      midwife_id: value,
    }));

    const params = {
      midwife_id: value,
      barangay_worker_id: formData.barangay_worker_id,
    };

    const response = await api.get('/api/midwife-and-barangay-worker-name', {
      params,
    });

    const data = response.data?.data || response.data;

    if (data) {
      setFormData((prev) => ({
        ...prev,
        midwife_name: data.midwife_name,
        barangay_worker_name: data.barangay_worker_name,
      }));
    }
  };
  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-900'>Healthcare Providers</h4>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='w-full'>
          <SelectReact
            label='Barangay Health Station'
            id='barangay_center_id'
            name='barangay_center_id'
            endpoint='/api/barangay-centers'
            placeholder='Choose a health station'
            formData={formData}
            setFormData={setFormData}
            labelKey='health_station'
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                barangay_center_id: value,
                barangay_worker_id: 0,
                midwife_id: 0,
              }))
            }
          />
          {error.barangay_center_id && (
            <p className='error mt-1'>{error.barangay_center_id[0]}</p>
          )}
        </div>
        <div className='w-full'>
          <SelectReact
            label='Barangay Worker'
            id='barangay_worker_id'
            name='barangay_worker_id'
            endpoint={`/api/barangay-workers/barangay-centers/${formData.barangay_center_id}`}
            placeholder='Choose a worker'
            formData={formData}
            setFormData={setFormData}
            labelKey='fullname'
            disabled={!formData.barangay_center_id}
          />
          {error.barangay_worker_id && (
            <p className='error mt-1'>{error.barangay_worker_id[0]}</p>
          )}
        </div>
        <div className='w-full'>
          <SelectReact
            label='Midwife'
            id='midwife_id'
            name='midwife_id'
            endpoint={`/api/midwives/barangay-centers/${formData.barangay_center_id}`}
            placeholder='Choose a midwife'
            formData={formData}
            setFormData={setFormData}
            labelKey='fullname'
            onChange={(value) => handleChangeName(value)}
            disabled={!formData.barangay_center_id}
          />
          {error.midwife_id && (
            <p className='error mt-1'>{error.midwife_id[0]}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthcareProviders;
