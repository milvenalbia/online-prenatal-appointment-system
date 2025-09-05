import { useEffect, useRef, useState } from 'react';
import { Calendar } from 'lucide-react';
import 'flatpickr/dist/themes/material_blue.css';
import Flatpickr from 'react-flatpickr';
import cn from '../../utils/cn';

const DatePicker = ({
  options,
  value,
  formData,
  setFormData,
  onChange,
  name,
  id,
  label,
  hasLabel = false,
  placeholder = 'Select Date',
  disabled = false,
  className,
}) => {
  const [range, setRange] = useState([]);

  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        if (pickerRef.current._flatpickr) {
          pickerRef.current._flatpickr.close();
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (selectedDates, dateStr, instance) => {
    if (onChange) {
      if (!options && selectedDates.length > 1) {
        onChange(selectedDates);
      } else {
        onChange({
          target: {
            name: instance.input.name,
            value: dateStr,
          },
        });
      }
    } else {
      if (selectedDates.length > 1) {
        setRange(selectedDates);
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: dateStr,
        }));
      }
    }
  };

  return (
    <div className='flex flex-col gap-2 mt-4 w-full' ref={pickerRef}>
      {hasLabel && (
        <label className='text-gray-700' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Calendar className='h-5 w-5 text-gray-400' />
        </div>
        <Flatpickr
          value={value}
          id={id}
          name={name}
          onChange={(selectedDates, dateStr, instance) =>
            handleChange(selectedDates, dateStr, instance)
          }
          options={
            options ?? {
              mode: 'range',
              altInput: true,
              altFormat: 'M j, Y',
              dateFormat: 'Y-m-d',
            }
          }
          className={cn(
            'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer',
            disabled && 'bg-gray-50 cursor-not-allowed',
            className
          )}
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default DatePicker;
