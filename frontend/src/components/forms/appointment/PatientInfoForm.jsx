import { FileText } from 'lucide-react';

// Patient Information Form Component
const PatientInfoForm = ({ formData, setFormData, priorities }) => (
  <div className='max-w-md mx-auto space-y-6'>
    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Pregnancy Tracking ID *
      </label>
      <input
        type='text'
        value={formData.pregnancy_tracking_id}
        onChange={(e) =>
          setFormData({
            ...formData,
            pregnancy_tracking_id: e.target.value,
          })
        }
        className='w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
        placeholder='Enter your tracking ID'
      />
    </div>

    <div>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        Priority Level
      </label>
      <div className='space-y-3'>
        {Object.entries(priorities).map(([key, value]) => (
          <label
            key={key}
            className='flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors'
          >
            <input
              type='radio'
              name='priority'
              value={key}
              checked={formData.priority === key}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value,
                })
              }
              className='mr-3 text-blue-600'
            />
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${value.color}`}
            >
              {value.label}
            </span>
          </label>
        ))}
      </div>
    </div>

    <div>
      <label className='text-sm font-medium text-gray-700 mb-2 flex items-center gap-1'>
        <FileText size={16} />
        Additional Notes (Optional)
      </label>
      <textarea
        value={formData.note}
        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
        rows='4'
        className='w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all'
        placeholder='Any additional information or special requests'
      />
    </div>
  </div>
);

export default PatientInfoForm;
