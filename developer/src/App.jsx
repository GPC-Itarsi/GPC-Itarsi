import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      {/* Developer routes - no authentication required */}
      <Route path="/developer/*" element={<Dashboard />} />

      {/* Redirect to developer dashboard */}
      <Route path="/" element={<Navigate to="/developer" replace />} />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/developer" replace />} />
    </Routes>
  );
}

export default App;
