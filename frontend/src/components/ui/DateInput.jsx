import { Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Don't forget the styles
import cn from '../../utils/cn';

const DateInput = ({
  label,
  id,
  name,
  placeholder = '',
  value,
  onChange,
  hasLabel = false,
  className,
}) => {
  const handleChange = (date) => {
    // normalize date into yyyy-MM-dd string for formData
    const formatted = date ? date.toISOString().split('T')[0] : '';

    onChange({
      target: { name, value: formatted },
    });
  };

  return (
    <div className='flex flex-col gap-2 mt-4 w-full'>
      {hasLabel && (
        <label className='text-gray-700' htmlFor={id}>
          {label}
        </label>
      )}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <Calendar className='text-gray-400 w-5 h-5' />
        </div>
        <DatePicker
          id={id}
          selected={value ? new Date(value) : null}
          onChange={handleChange}
          className={cn(
            'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all',
            className
          )}
          placeholderText={placeholder}
          dateFormat='yyyy-MM-dd'
          wrapperClassName='w-full'
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          autoComplete='off'
        />
      </div>
    </div>
  );
};

export default DateInput;
