import { Outlet } from 'react-router';
import { useState } from 'react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Header from './Header';
import {
  LayoutDashboard,
  CalendarCheck,
  Baby,
  Users,
  Stethoscope,
  Syringe,
  FileBarChart,
} from 'lucide-react';

const AdminLayout = () => {
  const [toggle, setToggle] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainLinks = [
    {
      name: 'Dashboard',
      link: 'dashboard',
      icon: <LayoutDashboard />,
    },
    {
      name: 'Appointments',
      link: 'appointments',
      icon: <CalendarCheck />,
    },
    {
      name: 'Pregnancy Trackings',
      link: 'pregnancy-trackings',
      icon: <Baby />,
    },
    {
      name: 'Out Patients',
      link: 'out-patients',
      icon: <Users />,
    },
    {
      name: 'Prenatal Visits',
      link: 'prenatal-visits',
      icon: <Stethoscope />,
    },
    {
      name: 'Immunization Records',
      link: 'immunization-records',
      icon: <Syringe />,
    },
    {
      name: 'Reports',
      link: 'reports',
      icon: <FileBarChart />,
    },
  ];

  return (
    <div className='flex'>
      {/* Desktop Sidebar */}
      <Sidebar toggle={toggle} setToggle={setToggle} mainLinks={mainLinks} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        mainLinks={mainLinks}
      />

      {/* Main Content */}
      <main
        className={`flex flex-col w-full py-3 px-6 transition-all duration-300  ${
          toggle ? 'sm:max-w-[calc(100%-128px)]' : 'sm:max-w-[calc(100%-280px)]'
        }`}
      >
        <div className='py-3 px-4 sm:px-6'>
          <Header
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <div className='mt-6'>
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden'
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
