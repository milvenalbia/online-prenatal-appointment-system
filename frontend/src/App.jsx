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
import Nurse from './pages/nurses/Nurse';
import RoleBasedRoute from './protected_route/RolebasedRoute';

function App() {
  const permissions = {
    dashboard: [1, 2, 3],
    appointments: [1, 3],
    create_appointment: [1, 3],
    pregnancy_trackings: [1, 2, 3],
    create_pregnancy_trackings: [1, 2],
    outPatients: [1, 3],
    prenatal_visits: [1, 3],
    immunization_records: [1, 3],
    midwives: [1, 2],
    nurses: [1, 2],
    health_stations: [1],
    reports: [1, 3],
    user_management: [1],
  };

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
          <Route
            index
            element={
              <RoleBasedRoute allowedRoles={permissions.dashboard}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path='dashboard'
            element={
              <RoleBasedRoute allowedRoles={permissions.dashboard}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          <Route
            path='appointments'
            element={
              <RoleBasedRoute allowedRoles={permissions.appointments}>
                <Appointments />
              </RoleBasedRoute>
            }
          />
          <Route
            path='appointments/create'
            element={
              <RoleBasedRoute allowedRoles={permissions.create_appointment}>
                <CreateAppointment />
              </RoleBasedRoute>
            }
          />
          <Route
            path='pregnancy-trackings'
            element={
              <RoleBasedRoute allowedRoles={permissions.pregnancy_trackings}>
                <PregnancyTrackingRecords />
              </RoleBasedRoute>
            }
          />
          <Route
            path='pregnancy-trackings/create'
            element={
              <RoleBasedRoute
                allowedRoles={permissions.create_pregnancy_trackings}
              >
                <CreatePregnancyTracking />
              </RoleBasedRoute>
            }
          />
          <Route
            path='out-patients'
            element={
              <RoleBasedRoute allowedRoles={permissions.outPatients}>
                <OutPatients />
              </RoleBasedRoute>
            }
          />
          <Route
            path='prenatal-visits'
            element={
              <RoleBasedRoute allowedRoles={permissions.prenatal_visits}>
                <PrenatalVisits />
              </RoleBasedRoute>
            }
          />
          <Route
            path='immunization-records'
            element={
              <RoleBasedRoute allowedRoles={permissions.immunization_records}>
                <ImmunizationRecords />
              </RoleBasedRoute>
            }
          />
          <Route
            path='midwives'
            element={
              <RoleBasedRoute allowedRoles={permissions.midwives}>
                <Midwives />
              </RoleBasedRoute>
            }
          />
          <Route
            path='health-stations'
            element={
              <RoleBasedRoute allowedRoles={permissions.health_stations}>
                <HealthStations />
              </RoleBasedRoute>
            }
          />
          {/* <Route
            path='barangay-workers'
            element={
              <RoleBasedRoute allowedRoles={permissions.}>
                <Appointments />
              </RoleBasedRoute>
            }
          /> */}
          <Route
            path='nurses'
            element={
              <RoleBasedRoute allowedRoles={permissions.nurses}>
                <Nurse />
              </RoleBasedRoute>
            }
          />
          <Route
            path='reports'
            element={
              <RoleBasedRoute allowedRoles={permissions.reports}>
                <Reports />
              </RoleBasedRoute>
            }
          />
          <Route
            path='users'
            element={
              <RoleBasedRoute allowedRoles={permissions.user_management}>
                <UserRecords />
              </RoleBasedRoute>
            }
          />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
