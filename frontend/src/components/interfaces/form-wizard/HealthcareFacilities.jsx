import { Building, Hospital, Landmark, MapPin } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';

const HealthcareFacilities = ({ formData, inputChange, error }) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='birthing_center'
          value={formData.birthing_center}
          onChange={inputChange}
          placeholder='Birthing center'
          icon={<Hospital className='h-5 w-5 text-gray-400' />}
          id='birthing_center'
          hasLabel
          label='Birthing Center'
        />
        {error.birthing_center && (
          <p className='error mt-1'>{error.birthing_center[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='birthing_center_address'
          value={formData.birthing_center_address}
          onChange={inputChange}
          placeholder='Birthing center address'
          icon={<MapPin className='h-5 w-5 text-gray-400' />}
          id='birthing_center_address'
          hasLabel
          label='Birthing Center Address'
        />
        {error.birthing_center_address && (
          <p className='error mt-1'>{error.birthing_center_address[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='referral_center'
          value={formData.referral_center}
          onChange={inputChange}
          placeholder='Referral center'
          icon={<Building className='h-5 w-5 text-gray-400' />}
          id='referral_center'
          hasLabel
          label='Referral Center'
        />
        {error.referral_center && (
          <p className='error mt-1'>{error.referral_center[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='referral_center_address'
          value={formData.referral_center_address}
          onChange={inputChange}
          placeholder='Referral center address'
          icon={<MapPin className='h-5 w-5 text-gray-400' />}
          id='referral_center_address'
          hasLabel
          label='Referral Center Address'
        />
        {error.referral_center_address && (
          <p className='error mt-1'>{error.referral_center_address[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='barangay_health_station'
          value={formData.barangay_health_station}
          onChange={inputChange}
          placeholder='Barangay health station'
          icon={<Hospital className='h-5 w-5 text-gray-400' />}
          id='barangay_health_station'
          hasLabel
          label='Barangay Health Station'
        />
        {error.barangay_health_station && (
          <p className='error mt-1'>{error.barangay_health_station[0]}</p>
        )}
      </div>
      <div className='w-full'>
        <InputGroup
          type='text'
          name='rural_health_unit'
          value={formData.rural_health_unit}
          onChange={inputChange}
          placeholder='Rural health unit'
          icon={<Landmark className='h-5 w-5 text-gray-400' />}
          id='rural_health_unit'
          hasLabel
          label='Rural Health Unit'
        />
        {error.rural_health_unit && (
          <p className='error mt-1'>{error.rural_health_unit[0]}</p>
        )}
      </div>
    </div>
  );
};

export default HealthcareFacilities;
