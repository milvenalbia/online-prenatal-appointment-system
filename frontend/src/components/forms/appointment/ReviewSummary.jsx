// Review Summary Component
const ReviewSummary = ({ formData, priorities }) => (
  <div className='max-w-md mx-auto'>
    <div className='bg-gray-50 rounded-xl p-6 space-y-4 mb-8'>
      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Date:</span>
        <span className='text-gray-900'>
          {formData.selectedDate?.toLocaleDateString('en-PH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Time:</span>
        <span className='text-gray-900'>
          {formData.selectedSlot?.start} - {formData.selectedSlot?.end}
        </span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Tracking ID:</span>
        <span className='text-gray-900'>{formData.pregnancy_tracking_id}</span>
      </div>

      <div className='flex justify-between items-center'>
        <span className='font-medium text-gray-700'>Priority:</span>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            priorities[formData.priority].color
          }`}
        >
          {priorities[formData.priority].label}
        </span>
      </div>

      {formData.note && (
        <div>
          <span className='font-medium text-gray-700 block mb-2'>Notes:</span>
          <p className='text-gray-900 text-sm bg-white p-3 rounded-lg border'>
            {formData.note}
          </p>
        </div>
      )}
    </div>
  </div>
);

export default ReviewSummary;
