import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { forgotPassword, resetPassword } from '../api';

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login({ email, password }, isAdminLogin);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResetMessage('');

    try {
      const data = await forgotPassword({ email: resetEmail });
      setResetToken(data.resetToken);
      setShowTokenInput(true);
      setResetMessage('Reset token generated. Use the token below to set a new password.');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResetMessage('');

    try {
      await resetPassword({ email: resetEmail, token: resetToken, password: newPassword });
      setResetMessage('Password updated successfully. You can now login.');
      setForgotMode(false);
      setResetEmail('');
      setResetToken('');
      setNewPassword('');
      setShowTokenInput(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {!forgotMode ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{isAdminLogin ? 'Admin Login' : 'Login'}</h2>
            <button
              type="button"
              onClick={() => setIsAdminLogin(!isAdminLogin)}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-semibold transition-colors ${
                isAdminLogin
                  ? 'bg-cyan-500 text-slate-950 hover:bg-cyan-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              title={isAdminLogin ? 'Switch to regular login' : 'Switch to admin login'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {isAdminLogin ? 'Admin' : 'User'}
            </button>
          </div>
          {error && <div className="rounded-2xl bg-red-500/20 px-4 py-3 text-red-200">{error}</div>}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm text-slate-300">
              Email
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
            </label>
            <label className="block space-y-2 text-sm text-slate-300">
              Password
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter password" />
            </label>
            <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
              {isAdminLogin ? 'Login as Admin' : 'Login'}
            </button>
          </form>
          <div className="flex items-center justify-between gap-4 text-sm text-slate-400">
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={onSwitch} className="text-cyan-300 hover:text-cyan-100">
                Sign up
              </button>
            </p>
            <button type="button" onClick={() => setForgotMode(true)} className="text-cyan-300 hover:text-cyan-100">
              Forgot password?
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          {resetMessage && <div className="rounded-2xl bg-emerald-500/20 px-4 py-3 text-emerald-200">{resetMessage}</div>}
          {error && <div className="rounded-2xl bg-red-500/20 px-4 py-3 text-red-200">{error}</div>}
          <form className="space-y-4" onSubmit={showTokenInput ? handleResetSubmit : handleForgotSubmit}>
            <label className="block space-y-2 text-sm text-slate-300">
              Email
              <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} type="email" placeholder="Registered email" />
            </label>
            {showTokenInput && (
              <>
                <label className="block space-y-2 text-sm text-slate-300">
                  Reset token
                  <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} type="text" placeholder="Enter token" />
                </label>
                <label className="block space-y-2 text-sm text-slate-300">
                  New password
                  <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Enter new password" />
                </label>
              </>
            )}
            <button type="submit" className="w-full rounded-2xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-400">
              {showTokenInput ? 'Save new password' : 'Send reset token'}
            </button>
          </form>
          {resetToken && (
            <div className="rounded-2xl bg-slate-800 p-4 text-slate-200">
              <p className="font-semibold">Reset token</p>
              <p className="mt-2 break-all text-sm">{resetToken}</p>
              <p className="mt-2 text-slate-400 text-sm">Copy this token into the form above to reset your password.</p>
            </div>
          )}
          <button type="button" onClick={() => { setForgotMode(false); setError(''); setResetMessage(''); setShowTokenInput(false); setResetToken(''); }} className="text-cyan-300 hover:text-cyan-100">
            Back to login
          </button>
        </>
      )}
    </div>
  );
}
