import {
  Activity,
  Baby,
  Calendar,
  CalendarCheck,
  ChevronRight,
  ClipboardList,
  HeartPlus,
  HeartPulse,
  Hospital,
  Stethoscope,
  Syringe,
  User,
} from 'lucide-react';
import { Link } from 'react-router';
import Card from '../components/interfaces/cards/Card';
import { useAuthStore } from '../store/authStore.js';

const Dashboard = () => {
  const { user } = useAuthStore();
  const referrals = [
    {
      id: 1,
      patientName: 'John Smith',
      referredTo: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      date: '2025-08-20',
      status: 'Pending',
    },
    {
      id: 2,
      patientName: 'Emma Davis',
      referredTo: 'Dr. Michael Brown',
      specialty: 'Dermatology',
      date: '2025-08-19',
      status: 'Confirmed',
    },
    {
      id: 3,
      patientName: 'Robert Wilson',
      referredTo: 'Dr. Lisa Chen',
      specialty: 'Orthopedics',
      date: '2025-08-18',
      status: 'Completed',
    },
    {
      id: 4,
      patientName: 'Maria Garcia',
      referredTo: 'Dr. David Lee',
      specialty: 'Neurology',
      date: '2025-08-17',
      status: 'Pending',
    },
    {
      id: 5,
      patientName: 'Maria Garcia',
      referredTo: 'Dr. David Lee',
      specialty: 'Neurology',
      date: '2025-08-17',
      status: 'Pending',
    },
    {
      id: 6,
      patientName: 'Maria Garcia',
      referredTo: 'Dr. David Lee',
      specialty: 'Neurology',
      date: '2025-08-17',
      status: 'confirmed',
    },
    {
      id: 7,
      patientName: 'Maria Garcia',
      referredTo: 'Dr. David Lee',
      specialty: 'Neurology',
      date: '2025-08-17',
      status: 'completed',
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patientName: 'Alice Johnson',
      time: '09:00 AM',
      date: 'Tomorrow',
      type: 'Consultation',
    },
    {
      id: 2,
      patientName: 'Mark Thompson',
      time: '10:30 AM',
      date: 'Tomorrow',
      type: 'Follow-up',
    },
    {
      id: 3,
      patientName: 'Sophie Miller',
      time: '02:00 PM',
      date: 'Aug 23',
      type: 'Check-up',
    },
    {
      id: 4,
      patientName: 'James Anderson',
      time: '03:30 PM',
      date: 'Aug 23',
      type: 'Consultation',
    },
    {
      id: 5,
      patientName: 'Rachel Green',
      time: '11:00 AM',
      date: 'Aug 24',
      type: 'Follow-up',
    },
    {
      id: 6,
      patientName: 'Rachel Green',
      time: '11:00 AM',
      date: 'Aug 24',
      type: 'Follow-up',
    },
    {
      id: 7,
      patientName: 'Rachel Green',
      time: '11:00 AM',
      date: 'Aug 24',
      type: 'Follow-up',
    },
    {
      id: 8,
      patientName: 'Rachel Green',
      time: '11:00 AM',
      date: 'Aug 24',
      type: 'Follow-up',
    },
  ];

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='min-h-screen'>
      <div className='w-full'>
        {/* Statistics Cards - Responsive Grid */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 ${
            user.role_id !== 2 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'
          }`}
        >
          <Card
            title='Total Patients'
            value='200'
            icon={User}
            iconBgColor='bg-blue-100'
            iconColor='text-blue-600'
          />
          {user.role_id !== 2 && (
            <Card
              title='Total Appointments'
              value='50'
              icon={CalendarCheck}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
          )}
          <div className='sm:col-span-2 lg:col-span-1'>
            <Card
              title='Total Pregnancy Trackings'
              value='57'
              icon={Baby}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6'>
          <Card
            title='1st Trimester'
            value='20'
            icon={HeartPulse}
            iconBgColor='bg-emerald-100'
            iconColor='text-emerald-600'
          />
          <Card
            title='2nd Trimester'
            value='25'
            icon={HeartPlus}
            iconBgColor='bg-emerald-100'
            iconColor='text-emerald-600'
          />
          <Card
            title='3rd Trimester'
            value='17'
            icon={Stethoscope}
            iconBgColor='bg-emerald-100'
            iconColor='text-emerald-600'
          />
          <Card
            title='4th Trimester'
            value='30'
            icon={Activity}
            iconBgColor='bg-emerald-100'
            iconColor='text-emerald-600'
          />
        </div>

        {user.role_id !== 2 && (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6'>
            <Card
              title='Immunization Records'
              value='20'
              icon={Syringe}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
            <Card
              title='Prenatal Visit Records'
              value='47'
              icon={ClipboardList}
              iconBgColor='bg-blue-100'
              iconColor='text-blue-600'
            />
            <div className='sm:col-span-2 lg:col-span-1'>
              <Card
                title='Total Out Patients'
                value='28'
                icon={Hospital}
                iconBgColor='bg-blue-100'
                iconColor='text-blue-600'
              />
            </div>
          </div>
        )}

        {/* Main Content Grid - Responsive Layout */}
        <div
          className={`grid grid-cols-1 gap-6 ${
            user.role_id !== 2 ? 'xl:grid-cols-3' : 'xl:grid-cols-2'
          }`}
        >
          {/* Recent Referrals Table */}
          <div className='xl:col-span-2 bg-white rounded-lg shadow-md order-2 xl:order-1'>
            <div className='p-4 sm:p-6'>
              <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4'>
                Recent Pregnancy Tracking
              </h2>

              {/* Mobile Card View */}
              <div className='block sm:hidden space-y-3'>
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
                  >
                    <div className='flex justify-between items-start mb-2'>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {referral.patientName}
                        </p>
                        <p className='text-sm text-gray-500'>
                          {referral.specialty}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          referral.status
                        )}`}
                      >
                        {referral.status}
                      </span>
                    </div>
                    <div className='text-sm text-gray-500'>
                      <p>To: {referral.referredTo}</p>
                      <p>{new Date(referral.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className='hidden sm:block overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Patient
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell'>
                        Referred To
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell'>
                        Specialty
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Date
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {referrals.map((referral) => (
                      <tr key={referral.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div className='text-sm font-medium text-gray-900'>
                            {referral.patientName}
                          </div>
                          <div className='text-sm text-gray-500 lg:hidden'>
                            {referral.referredTo}
                          </div>
                          <div className='text-sm text-gray-500 md:hidden'>
                            {referral.specialty}
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell'>
                          {referral.referredTo}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell'>
                          {referral.specialty}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <span className='hidden sm:inline'>
                            {new Date(referral.date).toLocaleDateString()}
                          </span>
                          <span className='sm:hidden'>
                            {new Date(referral.date).toLocaleDateString(
                              'en-US',
                              { month: 'short', day: 'numeric' }
                            )}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              referral.status
                            )}`}
                          >
                            {referral.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments List */}
          {user.role_id !== 2 && (
            <div className='bg-white rounded-lg shadow-md order-1 xl:order-2'>
              <div className='p-4 sm:p-6'>
                <h2 className='text-lg sm:text-xl font-semibold text-gray-900 mb-4'>
                  Upcoming Appointments
                </h2>
                <div className='space-y-3 h-90 overflow-y-hidden hover:overflow-y-auto'>
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className='flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
                    >
                      <div className='flex items-center space-x-3'>
                        <div className='p-2 bg-blue-100 rounded-full flex-shrink-0'>
                          <Calendar className='h-4 w-4 text-blue-600' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='text-sm font-medium text-gray-900 truncate'>
                            {appointment.patientName}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className='text-right flex-shrink-0'>
                        <p className='text-sm font-medium text-gray-900'>
                          {appointment.time}
                        </p>
                        <p className='text-xs text-gray-500'>
                          {appointment.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className='mt-4 pt-4 border-t border-gray-200'>
                  <Link
                    to={'/admin/appointments'}
                    className='w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors'
                  >
                    View All Appointments
                    <ChevronRight className='ml-1 h-4 w-4' />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
