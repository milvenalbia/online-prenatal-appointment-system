import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Calendar,
  User,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import Container from '../../components/ui/Container';

// Progress Bar Component
const ProgressBar = ({ steps, currentStep }) => (
  <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-8'>
    <div className='flex items-center justify-between'>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className='flex items-center flex-1'>
            <div
              className={`
                flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all duration-200
                ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }
              `}
            >
              {isCompleted ? (
                <CheckCircle size={16} className='md:w-5 md:h-5' />
              ) : (
                <Icon size={16} className='md:w-5 md:h-5' />
              )}
            </div>
            <div className='ml-2 md:ml-3 hidden sm:block'>
              <p
                className={`text-xs md:text-sm font-medium ${
                  isActive
                    ? 'text-blue-600'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                Step {step.id}
              </p>
              <p
                className={`text-xs ${
                  isActive
                    ? 'text-blue-500'
                    : isCompleted
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`}
              >
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 ml-2 md:ml-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// Enhanced Calendar Component
const CalendarComponent = ({
  currentDate,
  onDateSelect,
  onNavigateMonth,
  appointments,
  getAvailableSlots,
}) => {
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return days;
  };

  const calendarDays = getCalendarDays();

  return (
    <div className='max-w-4xl mx-auto'>
      {/* Calendar Header */}
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl md:text-2xl font-bold text-gray-900'>
          {currentDate.toLocaleDateString('en-PH', {
            month: 'long',
            year: 'numeric',
          })}
        </h3>
        <div className='flex gap-2'>
          <button
            onClick={() => onNavigateMonth(-1)}
            className='p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200'
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onNavigateMonth(1)}
            className='p-2 md:p-3 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200'
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className='grid grid-cols-7 gap-1 md:gap-2 mb-2'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='p-2 md:p-3 text-center text-sm md:text-base font-semibold text-gray-600 bg-gray-50 rounded-lg'
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className='grid grid-cols-7 gap-1 md:gap-2'>
        {calendarDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();
          const isDisabled =
            !isCurrentMonth || isWeekend(day) || isPastDate(day);
          const dateStr = day.toISOString().split('T')[0];
          const dayAppointments = appointments[dateStr] || [];
          const availableSlots =
            isCurrentMonth && !isDisabled ? getAvailableSlots(day) : [];
          const bookingCount = dayAppointments.length;

          return (
            <button
              key={index}
              onClick={() => !isDisabled && onDateSelect(day)}
              disabled={isDisabled}
              className={`
                p-2 md:p-4 text-sm md:text-base rounded-lg transition-all duration-200 relative 
                min-h-[60px] md:min-h-[80px] flex flex-col items-center justify-center border-2
                ${
                  isDisabled
                    ? 'text-gray-300 cursor-not-allowed border-gray-100 bg-gray-50'
                    : 'hover:bg-blue-50 cursor-pointer hover:scale-105 border-gray-200 hover:border-blue-300 bg-white hover:shadow-md'
                }
                ${
                  isToday && !isDisabled
                    ? 'bg-blue-100 text-blue-800 font-bold border-blue-400'
                    : ''
                }
                ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
              `}
            >
              <span className='text-base md:text-lg font-semibold mb-1'>
                {day.getDate()}
              </span>

              {/* Booking Count Badge */}
              {!isDisabled && bookingCount > 0 && (
                <div className='bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mb-1'>
                  {bookingCount}
                </div>
              )}

              {/* Status Indicators */}
              {!isDisabled && (
                <div className='flex gap-1'>
                  {availableSlots.length > 0 && (
                    <div className='w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full'></div>
                  )}
                  {bookingCount > 0 && availableSlots.length === 0 && (
                    <div className='w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full'></div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Time Slot Selection Component
const TimeSlotSelector = ({ date, availableSlots, onSlotSelect }) => (
  <div className='max-w-4xl mx-auto'>
    <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto'>
      {availableSlots.map((slot, index) => (
        <button
          key={index}
          onClick={() => onSlotSelect(slot)}
          className='p-3 md:p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-center hover:scale-105 hover:shadow-md bg-white'
        >
          <div className='font-semibold text-gray-900 text-sm md:text-base'>
            {slot.start}
          </div>
          <div className='text-xs md:text-sm text-gray-500'>{slot.end}</div>
        </button>
      ))}
    </div>

    {availableSlots.length === 0 && (
      <div className='text-center py-12 text-gray-500'>
        <AlertCircle className='mx-auto mb-4' size={48} />
        <h3 className='text-lg font-medium mb-2'>No Available Slots</h3>
        <p>Please select a different date</p>
      </div>
    )}
  </div>
);

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

// Legend Component
const Legend = () => (
  <div className='mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
    <h4 className='font-medium text-gray-900 mb-3'>Legend:</h4>
    <div className='grid grid-cols-2 md:grid-cols-5 gap-4 text-sm'>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
        <span>Available slots</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
        <span>Fully booked</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center'>
          3
        </div>
        <span>Booking count</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
        <span>Today</span>
      </div>
      <div className='flex items-center gap-2'>
        <div className='w-3 h-3 bg-gray-300 rounded-full'></div>
        <span>Unavailable</span>
      </div>
    </div>
  </div>
);

// Main Component
const CreateAppointment = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({
    // Demo data to show booking counts
    '2025-08-26': [{ id: 1, start_time: '08:00', priority: 'high' }],
    '2025-08-27': [
      { id: 2, start_time: '09:00', priority: 'medium' },
      { id: 3, start_time: '10:00', priority: 'low' },
    ],
    '2025-08-28': [
      { id: 4, start_time: '11:00', priority: 'high' },
      { id: 5, start_time: '14:00', priority: 'medium' },
      { id: 6, start_time: '15:00', priority: 'low' },
    ],
    '2025-08-29': [{ id: 7, start_time: '08:00', priority: 'medium' }],
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pregnancy_tracking_id: '',
    selectedDate: null,
    selectedSlot: null,
    priority: 'medium',
    note: '',
  });

  const steps = [
    { id: 1, title: 'Select Date', icon: Calendar },
    { id: 2, title: 'Choose Time', icon: Clock },
    { id: 3, title: 'Patient Info', icon: User },
    { id: 4, title: 'Review & Book', icon: CheckCircle },
  ];

  const priorities = {
    high: {
      label: 'High Priority',
      color: 'bg-red-100 text-red-800 border-red-200',
      value: 1,
    },
    medium: {
      label: 'Medium Priority',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      value: 2,
    },
    low: {
      label: 'Low Priority',
      color: 'bg-green-100 text-green-800 border-green-200',
      value: 3,
    },
  };

  const generateTimeSlots = () => {
    const slots = [];
    let startTime = new Date();
    startTime.setHours(8, 0, 0, 0);

    for (let i = 0; i < 25; i++) {
      const time = new Date(startTime.getTime() + i * 20 * 60 * 1000);
      const endTime = new Date(time.getTime() + 20 * 60 * 1000);
      slots.push({
        start: time.toLocaleTimeString('en-PH', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        end: endTime.toLocaleTimeString('en-PH', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        }),
        startTime: time.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const getAvailableSlots = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    const dayAppointments = appointments[dateStr] || [];
    return timeSlots.filter((slot) => {
      return !dayAppointments.some((apt) => apt.start_time === slot.startTime);
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    setFormData({ ...formData, selectedDate: date });
    nextStep();
  };

  const handleSlotSelect = (slot) => {
    setFormData({ ...formData, selectedSlot: slot });
    nextStep();
  };

  const handleSubmit = () => {
    if (
      !formData.selectedDate ||
      !formData.selectedSlot ||
      !formData.pregnancy_tracking_id.trim()
    ) {
      alert('Please fill in all required fields');
      return;
    }

    const dateStr = formData.selectedDate.toISOString().split('T')[0];
    const newAppointment = {
      id: Date.now(),
      pregnancy_tracking_id: formData.pregnancy_tracking_id,
      date: dateStr,
      start_time: formData.selectedSlot.startTime,
      end_time: formData.selectedSlot.endTime,
      priority: formData.priority,
      status: 'scheduled',
      note: formData.note,
    };

    const dayAppointments = appointments[dateStr] || [];
    setAppointments({
      ...appointments,
      [dateStr]: [...dayAppointments, newAppointment].sort(
        (a, b) => priorities[a.priority].value - priorities[b.priority].value
      ),
    });

    setFormData({
      pregnancy_tracking_id: '',
      selectedDate: null,
      selectedSlot: null,
      priority: 'medium',
      note: '',
    });
    setCurrentStep(1);
    alert('Appointment booked successfully!');
  };

  const resetForm = () => {
    setFormData({
      pregnancy_tracking_id: '',
      selectedDate: null,
      selectedSlot: null,
      priority: 'medium',
      note: '',
    });
    setCurrentStep(1);
  };

  return (
    <Container title={'Create Appointment'}>
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
        {/* Step 1: Date Selection */}
        {currentStep === 1 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Select Your Preferred Date
              </h2>
              <p className='text-gray-600'>
                Choose an available date for your appointment
              </p>
            </div>

            <CalendarComponent
              currentDate={currentDate}
              onDateSelect={handleDateSelect}
              onNavigateMonth={navigateMonth}
              appointments={appointments}
              getAvailableSlots={getAvailableSlots}
            />
          </div>
        )}

        {/* Step 2: Time Selection */}
        {currentStep === 2 && formData.selectedDate && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Choose Your Time Slot
              </h2>
              <p className='text-gray-600'>
                Available slots for{' '}
                {formData.selectedDate.toLocaleDateString('en-PH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <TimeSlotSelector
              date={formData.selectedDate}
              availableSlots={getAvailableSlots(formData.selectedDate)}
              onSlotSelect={handleSlotSelect}
            />

            <div className='flex justify-between mt-8'>
              <button
                onClick={prevStep}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Patient Information */}
        {currentStep === 3 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Patient Information
              </h2>
              <p className='text-gray-600'>Please provide your details</p>
            </div>

            <PatientInfoForm
              formData={formData}
              setFormData={setFormData}
              priorities={priorities}
            />

            <div className='flex justify-between mt-8 max-w-md mx-auto'>
              <button
                onClick={prevStep}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={!formData.pregnancy_tracking_id.trim()}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Confirmation */}
        {currentStep === 4 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Review Your Appointment
              </h2>
              <p className='text-gray-600'>
                Please confirm your appointment details
              </p>
            </div>

            <ReviewSummary formData={formData} priorities={priorities} />

            <div className='flex justify-between gap-4 max-w-md mx-auto'>
              <button
                onClick={prevStep}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className='flex-1 flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium'
              >
                <CheckCircle size={16} />
                Confirm Appointment
              </button>
            </div>

            <button
              onClick={resetForm}
              className='w-full bg-gray-200 mt-4 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm max-w-md mx-auto block'
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      <Legend />
    </Container>
  );
};

export default CreateAppointment;
