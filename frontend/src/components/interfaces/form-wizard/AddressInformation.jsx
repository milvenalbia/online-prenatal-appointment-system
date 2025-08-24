import SelectAddressReact from '../../ui/SelectAddressReact';

const AddressInformation = ({ formData, setFormData, error }) => {
  return (
    <div className='space-y-4'>
      <h4 className='font-medium text-gray-900'>Address Information</h4>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='w-full'>
          <SelectAddressReact
            label='Region'
            id='region'
            name='region'
            endpoint='/api/select-address/regions'
            placeholder='Choose a region'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                region: value,
                province: 0,
                municipality: 0,
                barangay: 0,
              }))
            }
          />
          {error.region && <p className='error mt-1'>{error.region[0]}</p>}
        </div>
        <div className='w-full'>
          <SelectAddressReact
            label='Province'
            id='province'
            name='province'
            endpoint={`/api/select-address/provinces/${formData.region}`}
            placeholder='Choose a province'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                province: value,
                municipality: 0,
                barangay: 0,
              }))
            }
            disabled={!formData.region}
          />
          {error.province && <p className='error mt-1'>{error.province[0]}</p>}
        </div>

        <div className='w-full'>
          <SelectAddressReact
            label='Municipality'
            id='municipality'
            name='municipality'
            endpoint={`/api/select-address/municipalities/${formData.province}`}
            placeholder='Choose a municipality'
            formData={formData}
            setFormData={setFormData}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                municipality: value,
                barangay: 0,
              }))
            }
            disabled={!formData.province}
          />
          {error.municipality && (
            <p className='error mt-1'>{error.municipality[0]}</p>
          )}
        </div>

        <div className='w-full'>
          <SelectAddressReact
            label='Barangay'
            id='barangay'
            name='barangay'
            endpoint={`/api/select-address/barangays/${formData.municipality}`}
            placeholder='Choose a barangay'
            formData={formData}
            setFormData={setFormData}
            disabled={!formData.municipality}
          />
          {error.barangay && <p className='error mt-1'>{error.barangay[0]}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddressInformation;
