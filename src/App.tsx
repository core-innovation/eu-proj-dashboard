import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Dashboard } from '@/pages/Dashboard';
import { ProjectPage } from '@/pages/ProjectPage';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="eu-projects-theme">
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
            </Routes>
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
