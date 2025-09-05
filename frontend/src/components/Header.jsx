import { Bell, Calendar, UserRound, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuthStore } from '../store/AuthStore';

const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  const { user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-3 z-40 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md bg-white/70 shadow-md rounded-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className='w-full flex justify-between items-center px-2 sm:px-5 py-4 sm:py-6'>
        {/* Left side - Menu button (mobile) + Welcome text */}
        <div className='flex items-center gap-4'>
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className='px-3 py-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors sm:hidden'
          >
            <Menu className='h-6 w-6' />
          </button>

          {/* Welcome text - responsive */}
          <h1 className='text-lg sm:text-2xl font-bold text-black'>
            <span className='hidden sm:inline'>Welcome back {user.name}</span>
          </h1>
        </div>

        {/* Right side - Actions */}
        <div className='flex gap-4 sm:gap-6 items-center'>
          {/* Make Appointment Button - Hidden on mobile, different sizes */}
          {user.role_id === 3 && (
            <>
              <Link
                to={'appointments/create'}
                className='group hidden md:flex items-center gap-2 py-2 px-3 
             bg-purple-600 hover:bg-purple-500 text-white rounded-md 
             cursor-pointer transition-colors shadow-md'
              >
                <Calendar className='h-4 w-4' />
                <span className='font-semibold tracking-wide text-sm'>
                  Make Appointment
                </span>
              </Link>
              <Link
                to={'appointment/create'}
                className='md:hidden p-2 bg-purple-600 hover:bg-purple-500 text-white rounded-md cursor-pointer transition-colors shadow-md'
              >
                <Calendar className='h-5 w-5' />
              </Link>{' '}
            </>
          )}

          {/* Notifications */}
          <div className='relative'>
            <span className='absolute w-4 h-4 sm:w-5 sm:h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white -top-2 sm:-top-3 -right-1 sm:-right-2'>
              <span className='text-xs'>20</span>
            </span>
            <Bell className='h-8 w-8 sm:h-10 sm:w-10 p-1.5 sm:p-2 bg-white rounded-md shadow-md cursor-pointer hover:bg-gray-50 transition-colors' />
          </div>

          {/* User Profile - Responsive */}
          <div className='flex items-center gap-2 py-2 px-2 sm:px-3 bg-white rounded-md shadow-md'>
            <UserRound className='h-5 w-5 sm:h-6 sm:w-6' />
            {/* Show just first name on very small screens */}
            <span className='capitalize font-semibold text-sm xs:hidden'>
              {user.name.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
