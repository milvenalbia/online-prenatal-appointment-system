import { FileText, Heart, Calendar, Users } from 'lucide-react';
import LinkCards from '../../components/ui/LinkCards';
import Container from '../../components/ui/Container';
import Breadcrumb from '../../components/ui/Breadcrumb';

const Reports = () => {
  const reportLinks = [
    {
      icon: FileText,
      title: 'Appointment Records',
      description:
        'View comprehensive records of all scheduled and completed prenatal appointments, including appointment history and notes.',
      linkTo: '/reports/appointment-records',
      bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconColor: 'bg-blue-500',
    },
    {
      icon: Heart,
      title: 'Pregnancy Tracking',
      description:
        'Monitor pregnancy progress with detailed tracking reports including weight, vitals, and developmental milestones.',
      linkTo: '/reports/pregnancy-tracking',
      bgColor: 'bg-gradient-to-br from-pink-50 to-pink-100',
      iconColor: 'bg-pink-500',
    },
    {
      icon: Calendar,
      title: 'Prenatal Visits',
      description:
        'Access detailed reports of prenatal visits, examination results, and healthcare provider recommendations.',
      linkTo: '/reports/prenatal-visits',
      bgColor: 'bg-gradient-to-br from-green-50 to-green-100',
      iconColor: 'bg-green-500',
    },
    {
      icon: Users,
      title: 'Out Patients',
      description:
        'Review outpatient consultation records, referrals, and follow-up care documentation for comprehensive patient management.',
      linkTo: '/reports/out-patients',
      bgColor: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconColor: 'bg-purple-500',
    },
  ];

  const Items = [
    { label: 'Dashboard', to: '/admin/dashboard' },
    { label: 'Reports' },
  ];

  return (
    <Container title={'Reports'}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Breadcrumb */}
        <Breadcrumb items={Items} />

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
          <div className='bg-white rounded-lg p-6 shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Total Appointments
                </p>
                <p className='text-3xl font-bold text-gray-900'>1,247</p>
              </div>
              <Calendar className='h-8 w-8 text-blue-500' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Active Pregnancies
                </p>
                <p className='text-3xl font-bold text-gray-900'>89</p>
              </div>
              <Heart className='h-8 w-8 text-pink-500' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  This Month Visits
                </p>
                <p className='text-3xl font-bold text-gray-900'>156</p>
              </div>
              <FileText className='h-8 w-8 text-green-500' />
            </div>
          </div>
          <div className='bg-white rounded-lg p-6 shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  Outpatient Referrals
                </p>
                <p className='text-3xl font-bold text-gray-900'>23</p>
              </div>
              <Users className='h-8 w-8 text-purple-500' />
            </div>
          </div>
        </div>

        {/* Report Links Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8'>
          {reportLinks.map((link, index) => (
            <LinkCards
              key={index}
              icon={link.icon}
              title={link.title}
              description={link.description}
              linkTo={link.linkTo}
              bgColor={link.bgColor}
              iconColor={link.iconColor}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Reports;
