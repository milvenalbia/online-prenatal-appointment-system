import React from 'react';
import { User, Calendar, Phone } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';
import PhoneNumberField from '../../ui/PhoneNumberField';

const NewPatientBasicInfo = ({ formData, inputChange, error }) => {
  return (
    <div className='flex flex-col gap-6'>
      {/* Row 1: Fname, Lname, Mname */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='w-full'>
          <InputGroup
            type='text'
            name='firstname'
            value={formData.firstname}
            onChange={inputChange}
            placeholder='First name'
            icon={<User className='h-5 w-5 text-gray-400' />}
            id='firstname'
            hasLabel
            label='First Name'
          />
          {error.firstname && (
            <p className='error mt-1'>{error.firstname[0]}</p>
          )}
        </div>
        <div className='w-full'>
          <InputGroup
            type='text'
            name='lastname'
            value={formData.lastname}
            onChange={inputChange}
            placeholder='Last name'
            icon={<User className='h-5 w-5 text-gray-400' />}
            id='lastname'
            hasLabel
            label='Last Name'
          />
          {error.lastname && <p className='error mt-1'>{error.lastname[0]}</p>}
        </div>
        <div className='w-full'>
          <InputGroup
            type='text'
            name='middlename'
            value={formData.middlename}
            onChange={inputChange}
            placeholder='Middle name'
            icon={<User className='h-5 w-5 text-gray-400' />}
            id='middlename'
            hasLabel
            label='Middle Name'
          />
          {error.middlename && (
            <p className='error mt-1'>{error.middlename[0]}</p>
          )}
        </div>
      </div>

      {/* Row 2: Age, Contact */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='w-full'>
          <InputGroup
            type='number'
            name='age'
            value={formData.age}
            onChange={inputChange}
            placeholder='Age'
            icon={<Calendar className='h-5 w-5 text-gray-400' />}
            id='age'
            hasLabel
            label='Age'
          />
          {error.age && <p className='error mt-1'>{error.age[0]}</p>}
        </div>

        <div className='w-full'>
          <PhoneNumberField
            type='text'
            name='contact'
            value={formData.contact}
            onChange={inputChange}
            placeholder='Contact Number'
            icon={<Phone className='h-5 w-5 text-gray-400' />}
            id='contact'
            hasLabel
            label='Contact Number'
          />
          {error.contact && <p className='error mt-1'>{error.contact[0]}</p>}
        </div>
      </div>
    </div>
  );
};

export default NewPatientBasicInfo;
