import { useEffect, useState } from 'react';
import {
  Calendar,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import CalendarComponent from './CalendarComponent';
import PatientInfoForm from './PatientInfoForm';
import ReviewSummary from './ReviewSummary';
import { useFormSubmit } from '../../../utils/functions';
import ProgressBar from './ProgressBar';
const AppointmentForm = ({ row = null, type = null }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [appointmentId, setAppointmentId] = useState(0);
  const [selectedDate, setSelectedDate] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [editType, setEditType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pregnancy_tracking_id: '',
    appointment_date: null,
    selectedSlot: null,
    priority: 'medium',
    visit_count: '',
    note: '',
    fullname: '',
  });

  const steps = [
    { id: 1, title: 'Select Date', icon: Calendar },
    { id: 2, title: 'Patient Info', icon: User },
    { id: 3, title: 'Review & Book', icon: CheckCircle },
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
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // months 0-11
    const dd = String(date.getDate()).padStart(2, '0');

    const appointment_date = `${yyyy}-${mm}-${dd}`;

    setSelectedDate(date);
    setFormData({
      ...formData,
      appointment_date: appointment_date,
    });
    nextStep();
  };

  const handleSlotSelect = (slot) => {
    setFormData({ ...formData, selectedSlot: slot });
    nextStep();
  };

  const { handleSubmit, isSubmitting, error, setError, data } = useFormSubmit();

  // const handleSubmit = () => {
  //   if (
  //     !formData.selectedDate ||
  //     !formData.pregnancy_tracking_id.trim()
  //   ) {
  //     alert('Please fill in all required fields');
  //     return;
  //   }

  //   const dateStr = formData.selectedDate.toISOString().split('T')[0];
  //   const newAppointment = {
  //     id: Date.now(),
  //     pregnancy_tracking_id: formData.pregnancy_tracking_id,
  //     date: dateStr,
  //     start_time: formData.selectedSlot.startTime,
  //     end_time: formData.selectedSlot.endTime,
  //     priority: formData.priority,
  //     status: 'scheduled',
  //     note: formData.note,
  //   };

  //   const dayAppointments = appointments[dateStr] || [];
  //   setAppointments({
  //     ...appointments,
  //     [dateStr]: [...dayAppointments, newAppointment].sort(
  //       (a, b) => priorities[a.priority].value - priorities[b.priority].value
  //     ),
  //   });

  //   setFormData({
  //     pregnancy_tracking_id: '',
  //     selectedDate: null,
  //     selectedSlot: null,
  //     priority: 'medium',
  //     note: '',
  //   });
  //   setCurrentStep(1);
  //   alert('Appointment booked successfully!');
  // };

  const showToastError = true;
  const onSubmit = (e) => {
    handleSubmit({
      e,
      showToastError,
      isEdit,
      url: isEdit ? `/api/appointments/${appointmentId}` : '/api/appointments',
      formData,
      onSuccess: (record) => {},
      onReset: () => {
        resetForm();
        setError({});
        if (isEdit) {
          setAppointmentId(0);
          setIsEdit(false);
          setEditType(null);
        }
      },
    });
  };

  const resetForm = () => {
    setFormData({
      pregnancy_tracking_id: '',
      selectedDate: null,
      selectedSlot: null,
      priority: 'medium',
      visit_count: '',
      note: '',
      fullname: '',
    });
    setCurrentStep(1);
  };

  useEffect(() => {
    if (!row && !type) {
      return;
    }

    setAppointmentId(row.id);
    setIsEdit(true);
    setEditType(type);
    setFormData({
      pregnancy_tracking_id: row.pregnancy_tracking_id,
      appointment_date: row.appointment_date,
      priority: row.priority,
      status: row.status,
      visit_count: row.visit_count,
      note: row.notes ?? '',
      fullname: row.fullname ?? '',
    });
    if (type !== 'reschedule') {
      setCurrentStep(2);
    }
  }, [row, type]);

  return (
    <>
      <ProgressBar steps={steps} currentStep={currentStep} />
      <div className='bg-white rounded-xl shadow-lg border border-gray-200'>
        {/* Step 1: Date Selection */}
        {isEdit
          ? editType === 'reschedule'
            ? currentStep === 1 && (
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
              )
            : ''
          : currentStep === 1 && (
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
        {/* {currentStep === 2 && formData.appointment_date && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Choose Your Time Slot
              </h2>
              <p className='text-gray-600'>
                Available slots for{' '}
                {selectedDate.toLocaleDateString('en-PH', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <TimeSlotSelector
              date={formData.appointment_date}
              availableSlots={getAvailableSlots(selectedDate)}
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
        )} */}

        {/* Step 2: Patient Information */}
        {currentStep === 2 && (
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
              {isEdit ? (
                editType === 'reschedule' ? (
                  <button
                    onClick={prevStep}
                    className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                ) : (
                  ''
                )
              ) : (
                <button
                  onClick={prevStep}
                  className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
              <button
                onClick={nextStep}
                disabled={!formData.pregnancy_tracking_id}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
              >
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review & Confirmation */}
        {currentStep === 3 && (
          <div className='p-4 md:p-6'>
            <div className='text-center mb-6'>
              <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                Review Your Appointment
              </h2>
              <p className='text-gray-600'>
                Please confirm your appointment details
              </p>
            </div>

            <ReviewSummary
              selectedDate={selectedDate}
              formData={formData}
              priorities={priorities}
            />

            <div className='flex justify-between gap-4 max-w-md mx-auto'>
              <button
                onClick={prevStep}
                className='flex items-center gap-2 px-4 md:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors'
              >
                <ArrowLeft size={16} />
                Back
              </button>
              <button
                onClick={onSubmit}
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
    </>
  );
};

export default AppointmentForm;
