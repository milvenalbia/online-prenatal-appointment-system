import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router';
import LoginPage from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import GuestOnlyRoute from './protected_route/GuestOnlyRoute';
import AdminOnlyRoute from './protected_route/AdminOnlyRoute';
import OutPatients from './pages/out_patient/OutPatients';
import PrenatalVisits from './pages/prenatal_visit/PrenatalVisits';
import Reports from './pages/reports/Reports';
import ImmunizationRecords from './pages/immuzition_record/ImmunizationRecords';
import Appointments from './pages/appointment/Appointments';
import CreateAppointment from './pages/appointment/CreateAppointment';
import PregnancyTrackingRecords from './pages/pregnancy_tracking/PregnancyTrackingRecords';
import CreatePregnancyTracking from './pages/pregnancy_tracking/CreatePregnancyTracking';
import UserRecords from './pages/user_management/UserRecords';
import HealthStations from './pages/health_station/HealthStations';
import Midwives from './pages/midwives/Midwives';
import BarangayWorkers from './pages/barangay_workers/BarangayWorkers';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest-only */}
        <Route
          path='/'
          element={
            <GuestOnlyRoute>
              <LoginPage />
            </GuestOnlyRoute>
          }
        />

        {/* Admin Protected */}
        <Route
          path='/admin'
          element={
            <AdminOnlyRoute>
              <AdminLayout />
            </AdminOnlyRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='appointments' element={<Appointments />} />
          <Route path='appointments/create' element={<CreateAppointment />} />
          <Route
            path='pregnancy-trackings'
            element={<PregnancyTrackingRecords />}
          />
          <Route
            path='pregnancy-trackings/create'
            element={<CreatePregnancyTracking />}
          />
          <Route path='out-patients' element={<OutPatients />} />
          <Route path='prenatal-visits' element={<PrenatalVisits />} />
          <Route
            path='immunization-records'
            element={<ImmunizationRecords />}
          />
          <Route path='midwives' element={<Midwives />} />
          <Route path='health-stations' element={<HealthStations />} />
          <Route path='barangay-workers' element={<BarangayWorkers />} />
          <Route path='reports' element={<Reports />} />
          <Route path='users' element={<UserRecords />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
