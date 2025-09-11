import { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import InputGroup from '../../ui/InputGroup';
import DatePicker from '../../ui/DatePicker';
import SelectGroup from '../../ui/SelectGroup';

const RiskCodes = ({ formData, setFormData, error }) => {
  // Initialize risk_codes array if it doesn't exist
  useEffect(() => {
    if (!formData.risk_codes || formData.risk_codes.length === 0) {
      setFormData((prev) => ({
        ...prev,
        risk_codes: [{ risk_code: '', date_detected: '', risk_status: '' }],
      }));
    }
  }, []);

  const risks = formData.risk_codes || [];

  const handleChange = (index, field, value) => {
    const updated = [...risks];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      risk_codes: updated,
    }));
  };

  const addRisk = () => {
    setFormData((prev) => ({
      ...prev,
      risk_codes: [
        ...(prev.risk_codes || []),
        { risk_code: '', date_detected: '', risk_status: '' },
      ],
    }));
  };

  const removeRisk = (index) => {
    setFormData((prev) => ({
      ...prev,
      risk_codes: (prev.risk_codes || []).filter((_, i) => i !== index),
    }));
  };

  const statusOptions = [
    {
      name: 'High Risk',
      value: 'high',
    },
    {
      name: 'Medium Risk',
      value: 'medium',
    },
    {
      name: 'low Risk',
      value: 'low',
    },
  ];

  return (
    <div className='space-y-4'>
      {risks.map((risk, index) => (
        <div key={index} className='flex gap-4 items-center rounded-lg'>
          <div className='w-full'>
            <InputGroup
              placeholder='Risk Code'
              value={risk.risk_code || ''}
              onChange={(e) => handleChange(index, 'risk_code', e.target.value)}
              icon={<ShieldAlert className='h-5 w-5 text-gray-400' />}
            />
            {error?.[`risk_codes.${index}.risk_code`] && (
              <p className='text-red-500 text-sm mt-1'>
                {error[`risk_codes.${index}.risk_code`][0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <DatePicker
              value={risk.date_detected || ''}
              onChange={(e) =>
                handleChange(index, 'date_detected', e.target.value)
              }
            />
            {error?.[`risk_codes.${index}.date_detected`] && (
              <p className='text-red-500 text-sm mt-1'>
                {error[`risk_codes.${index}.date_detected`][0]}
              </p>
            )}
          </div>
          <div className='w-full'>
            <SelectGroup
              value={risk.risk_status || ''}
              options={statusOptions}
              onChange={(e) =>
                handleChange(index, 'risk_status', e.target.value)
              }
              placeholder='Select Risk Status'
            />

            {error?.[`risk_codes.${index}.risk_status`] && (
              <p className='text-red-500 text-sm mt-1'>
                {error[`risk_codes.${index}.risk_status`][0]}
              </p>
            )}
          </div>
          {risks.length > 1 && (
            <button
              type='button'
              onClick={() => removeRisk(index)}
              className='text-red-500 hover:text-red-700 px-2 py-1'
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type='button'
        onClick={addRisk}
        className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors'
      >
        + Add Another Risk
      </button>
    </div>
  );
};

export default RiskCodes;
