import cn from '../utils/cn.js';

const InputGroup = ({
  label,
  id,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  icon = null,
  hasLabel = false,
  hasChildren = false,
  children,
  ...props
}) => {
  const handleChange = (e) => {
    onChange(e);
  };
  return (
    <div className='flex flex-col gap-2 mt-4 w-full'>
      {hasLabel && <label htmlFor={id}>{label}</label>}
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          {icon && icon}
        </div>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className={cn(
            'w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all',
            className
          )}
          placeholder={placeholder}
          id={id}
          {...props}
        />
        {children}
      </div>
    </div>
  );
};

export default InputGroup;
