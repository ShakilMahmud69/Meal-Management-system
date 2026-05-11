import { useState, useEffect } from 'react';
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
  const [monkeyEyes, setMonkeyEyes] = useState({ x: 0, y: 0 });
  const [isTyping, setIsTyping] = useState(false);
  const [monkeyExpression, setMonkeyExpression] = useState('neutral');

  // Monkey eye tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const eyes = document.querySelector('.monkey-eyes');
      if (eyes) {
        const rect = eyes.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
        const distance = Math.min(10, Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)) / 10);
        setMonkeyEyes({
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Monkey expression changes based on input
  useEffect(() => {
    if (error) {
      setMonkeyExpression('angry');
      const timer = setTimeout(() => setMonkeyExpression('neutral'), 3000);
      return () => clearTimeout(timer);
    } else if (isTyping) {
      setMonkeyExpression('excited');
    } else {
      setMonkeyExpression('neutral');
    }
  }, [error, isTyping]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMonkeyExpression('thinking');
    try {
      await login({ email, password }, isAdminLogin);
      setMonkeyExpression('happy');
    } catch (err) {
      setError(err.message);
      setMonkeyExpression('sad');
    }
  };

  const handleInputFocus = () => {
    setIsTyping(true);
    setMonkeyExpression('excited');
  };

  const handleInputBlur = () => {
    setIsTyping(false);
    setTimeout(() => setMonkeyExpression('neutral'), 1000);
  };

  const handleForgotSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResetMessage('');
    setMonkeyExpression('thinking');
    try {
      const response = await forgotPassword(resetEmail);
      setResetMessage(response.message);
      setShowTokenInput(true);
      setMonkeyExpression('happy');
    } catch (err) {
      setError(err.message);
      setMonkeyExpression('sad');
    }
  };

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setResetMessage('');
    setMonkeyExpression('thinking');
    try {
      const response = await resetPassword(resetEmail, resetToken, newPassword);
      setResetMessage(response.message);
      setShowTokenInput(false);
      setResetToken('');
      setNewPassword('');
      setMonkeyExpression('happy');
      setTimeout(() => setForgotMode(false), 2000);
    } catch (err) {
      setError(err.message);
      setMonkeyExpression('sad');
    }
  };

  const getMonkeyFace = () => {
    switch (monkeyExpression) {
      case 'happy':
        return '🙈';
      case 'sad':
        return '🙉';
      case 'angry':
        return '🙊';
      case 'excited':
        return '🐵';
      case 'thinking':
        return '🤔';
      default:
        return '🐒';
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-pink-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-green-400 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-orange-400 rounded-full opacity-20 animate-bounce"></div>
      </div>

      {/* Floating bananas */}
      <div className="absolute top-10 left-1/3 animate-bounce delay-100">🍌</div>
      <div className="absolute top-32 right-1/3 animate-bounce delay-300">🍌</div>
      <div className="absolute bottom-32 left-1/2 animate-bounce delay-500">🍌</div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md">
          {/* Monkey Avatar */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="text-8xl animate-pulse">
                {getMonkeyFace()}
              </div>
              {/* Monkey eyes that follow cursor */}
              <div className="monkey-eyes absolute top-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <div className="w-3 h-3 bg-black rounded-full relative overflow-hidden">
                  <div
                    className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-100"
                    style={{
                      transform: `translate(${monkeyEyes.x}px, ${monkeyEyes.y}px)`
                    }}
                  ></div>
                </div>
                <div className="w-3 h-3 bg-black rounded-full relative overflow-hidden">
                  <div
                    className="w-1.5 h-1.5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-100"
                    style={{
                      transform: `translate(${monkeyEyes.x}px, ${monkeyEyes.y}px)`
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mt-4 animate-pulse">
              Monkey Login 🐒
            </h1>
            <p className="text-purple-200 mt-2">
              {isAdminLogin ? 'Admin access - bananas required!' : 'Welcome back, fellow primate!'}
            </p>
          </div>

          {!forgotMode ? (
            <>
              {/* Admin/User Toggle */}
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  onClick={() => setIsAdminLogin(!isAdminLogin)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isAdminLogin
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  }`}
                >
                  <span className="text-lg">{isAdminLogin ? '👑' : '🐵'}</span>
                  {isAdminLogin ? 'Admin Mode' : 'User Mode'}
                  <span className="text-lg animate-bounce">{isAdminLogin ? '🍌' : '🥜'}</span>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 animate-shake">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🙊</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-200">
                    Email Address 📧
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    type="email"
                    placeholder="monkey@example.com"
                    className="w-full rounded-xl border-2 border-purple-400 bg-purple-900/50 px-4 py-3 text-white placeholder-purple-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-200">
                    Password 🔑
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border-2 border-purple-400 bg-purple-900/50 px-4 py-3 text-white placeholder-purple-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-4 font-bold text-purple-900 text-lg hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-2xl animate-bounce">🚀</span>
                    {isAdminLogin ? 'Admin Login' : 'Monkey Login'}
                    <span className="text-2xl animate-bounce">🐒</span>
                  </span>
                </button>
              </form>

              <div className="flex items-center justify-between gap-4 text-sm text-purple-300 mt-6">
                <p>
                  New to the jungle?{' '}
                  <button
                    type="button"
                    onClick={onSwitch}
                    className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors hover:underline"
                  >
                    Sign up here 🐾
                  </button>
                </p>
                <button
                  type="button"
                  onClick={() => setForgotMode(true)}
                  className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors hover:underline"
                >
                  Forgot password? 🧠
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-white text-center mb-4">Password Recovery 🧠</h2>
              {resetMessage && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-green-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎉</span>
                    <span>{resetMessage}</span>
                  </div>
                </div>
              )}
              {error && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🙊</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form className="space-y-4" onSubmit={showTokenInput ? handleResetSubmit : handleForgotSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-purple-200">
                    Email Address 📧
                  </label>
                  <input
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    type="email"
                    placeholder="monkey@example.com"
                    className="w-full rounded-xl border-2 border-purple-400 bg-purple-900/50 px-4 py-3 text-white placeholder-purple-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
                  />
                </div>

                {showTokenInput && (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-purple-200">
                        Reset Token 🎫
                      </label>
                      <input
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value)}
                        type="text"
                        placeholder="Enter your reset token"
                        className="w-full rounded-xl border-2 border-purple-400 bg-purple-900/50 px-4 py-3 text-white placeholder-purple-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-purple-200">
                        New Password 🔑
                      </label>
                      <input
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type="password"
                        placeholder="Enter new password"
                        className="w-full rounded-xl border-2 border-purple-400 bg-purple-900/50 px-4 py-3 text-white placeholder-purple-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 transition-all duration-300"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-green-400 to-blue-500 px-6 py-4 font-bold text-white text-lg hover:from-green-300 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🔄</span>
                    {showTokenInput ? 'Reset Password' : 'Send Reset Token'}
                    <span className="text-2xl">📧</span>
                  </span>
                </button>
              </form>

              {resetToken && (
                <div className="mt-6 p-4 bg-purple-900/50 border border-purple-400 rounded-2xl text-purple-200">
                  <p className="font-semibold text-yellow-300 mb-2">Reset Token Generated! 🎫</p>
                  <p className="break-all text-sm bg-purple-950 p-2 rounded">{resetToken}</p>
                  <p className="mt-2 text-xs text-purple-300">Copy this token and use it above to reset your password.</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setForgotMode(false);
                  setError('');
                  setResetMessage('');
                  setShowTokenInput(false);
                  setResetToken('');
                }}
                className="w-full mt-4 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-3 font-semibold text-white hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-xl">⬅️</span>
                  Back to Login
                  <span className="text-xl">🐒</span>
                </span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
