import React from 'react';
import { Heart, Calendar } from 'lucide-react';
import HealthcareFacilities from './HealthcareFacilities';
import HealthcareProviders from './HealthcareProviders';
import InputGroup from '../../ui/InputGroup';
import DateInput from '../../ui/DateInput';

const HealthInformationStep = ({
  formData,
  setFormData,
  inputChange,
  error,
}) => {
  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-medium text-gray-900'>Health Information</h3>

      {/* Basic Health Info */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='w-full'>
          <InputGroup
            type='number'
            name='gravidity'
            value={formData.gravidity}
            onChange={inputChange}
            placeholder='Gravidity'
            icon={<Heart className='h-5 w-5 text-gray-400' />}
            id='gravidity'
            hasLabel
            label='Gravidity'
          />
          {error.gravidity && (
            <p className='error mt-1'>{error.gravidity[0]}</p>
          )}
        </div>
        <div className='w-full'>
          <InputGroup
            type='number'
            name='parity'
            value={formData.parity}
            onChange={inputChange}
            placeholder='Parity'
            icon={<Heart className='h-5 w-5 text-gray-400' />}
            id='parity'
            hasLabel
            label='Parity'
          />
          {error.parity && <p className='error mt-1'>{error.parity[0]}</p>}
        </div>
        <div className='w-full'>
          <DateInput
            name='lmp'
            id='lmp'
            value={formData.lmp}
            onChange={inputChange}
            placeholder='Last Menstrual Period'
            hasLabel
            label='Last Menstrual Period (LMP)'
          />
          {error.lmp && <p className='error mt-1'>{error.lmp[0]}</p>}
        </div>
        <div className='w-full'>
          <DateInput
            name='edc'
            id='edc'
            value={formData.edc}
            onChange={inputChange}
            placeholder='Expected Date of Confinement'
            hasLabel
            label='Expected Date of Confinement (EDC)'
          />
          {error.edc && <p className='error mt-1'>{error.edc[0]}</p>}
        </div>
      </div>

      {/* Healthcare Facilities */}
      <HealthcareFacilities
        formData={formData}
        inputChange={inputChange}
        error={error}
      />

      {/* Healthcare Providers */}
      <HealthcareProviders
        formData={formData}
        setFormData={setFormData}
        error={error}
      />
    </div>
  );
};

export default HealthInformationStep;
