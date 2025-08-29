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
import ProgressBar from '../../components/forms/appointment/ProgressBar';
import CalendarComponent from '../../components/forms/appointment/CalendarComponent';
import TimeSlotSelector from '../../components/forms/appointment/TimeSlotSelector';
import PatientInfoForm from '../../components/forms/appointment/PatientInfoForm';
import ReviewSummary from '../../components/forms/appointment/ReviewSummary';
import Legend from '../../components/forms/appointment/Legend';

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
