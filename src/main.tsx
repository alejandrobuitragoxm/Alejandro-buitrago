import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import MaintenancePage from './components/MaintenancePage.tsx';
import './index.css';

// Temporary pause: set to false to bring the full portfolio back online.
const MAINTENANCE = true;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {MAINTENANCE ? <MaintenancePage /> : <App />}
  </StrictMode>,
);
