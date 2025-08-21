import { useState } from 'react';
import LoginPage from './pages/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
        {/* Guest-only */}
        <Route path='/' element={<LoginPage />} />

        {/* Admin Protected */}
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='dashboard' element={<Dashboard />} />
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
