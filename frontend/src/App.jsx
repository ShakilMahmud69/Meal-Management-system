import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user } = useAuth();
  const [mode, setMode] = useState('login');

  useEffect(() => {
    if (user) {
      setMode('dashboard');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-xl w-full space-y-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold">Meal Management System</h1>
            <p className="text-slate-400 mt-2">Track meals, bazar expenses, and calculate meal rate.</p>
          </div>
          <div className="bg-slate-800 rounded-3xl shadow-xl p-6">
            {mode === 'login' ? <LoginPage onSwitch={() => setMode('signup')} /> : <SignupPage onSwitch={() => setMode('login')} />}
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
