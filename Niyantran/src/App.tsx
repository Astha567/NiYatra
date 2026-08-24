import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { AppShell } from './components/AppShell';
import { DivisionOverview } from './components/DivisionOverview';
import { CorridorOverview } from './components/CorridorOverview';
import { PriorityQueue } from './components/PriorityQueue';
import { BlockCalendar } from './components/BlockCalendar';
import { ConflictResolution } from './components/ConflictResolution';
import { Reports } from './components/Reports';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Login & Role Selection */}
          <Route path="/login" element={<LoginPage />} />

          {/* Application Shell Routes */}
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Navigate to="/app/overview" replace />} />
            <Route path="overview" element={<CorridorOverview />} />
            <Route path="division-overview" element={<DivisionOverview />} />
            <Route path="priority-queue" element={<PriorityQueue />} />
            <Route path="block-calendar" element={<BlockCalendar />} />
            <Route path="conflict-resolution" element={<ConflictResolution />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
