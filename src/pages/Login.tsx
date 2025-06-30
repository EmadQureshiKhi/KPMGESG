import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import LoginForm from '../components/login/LoginForm';
import WelcomePanel from '../components/login/WelcomePanel';

const Login: React.FC = () => {
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { user, login, isLoading } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/home'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = await login(username, password);
    
    if (!success) {
      setError('Invalid username or password');
    }
  };

  const fillDemoCredentials = () => {
    if (loginType === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('user');
      setPassword('user123');
    }
  };

  const switchLoginType = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setUsername('');
    setPassword('');
    setError('');
    
    // Wait for text to slide out, then change type
    setTimeout(() => {
      setLoginType(loginType === 'user' ? 'admin' : 'user');
      setTimeout(() => setIsAnimating(false), 800);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-white flex relative overflow-hidden">
      {/* Desktop Layout - Split Screen */}
      <div className="hidden lg:flex w-full h-screen">
        {/* Welcome Panel */}
        <WelcomePanel loginType={loginType} />
        
        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={`form-${loginType}`}
              initial={{ 
                opacity: 0, 
                x: loginType === 'user' ? 120 : -120,
                scale: 0.95
              }}
              animate={{ 
                opacity: 1, 
                x: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0, 
                x: loginType === 'user' ? -120 : 120,
                scale: 0.95
              }}
              transition={{ 
                type: 'spring',
                stiffness: 80,
                damping: 20,
                duration: 0.8
              }}
              className="w-full max-w-md px-8"
            >
              <LoginForm
                loginType={loginType}
                username={username}
                password={password}
                showPassword={showPassword}
                error={error}
                isLoading={isLoading}
                onUsernameChange={setUsername}
                onPasswordChange={setPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleSubmit}
                onFillDemo={fillDemoCredentials}
                onSwitchType={switchLoginType}
                isAnimating={isAnimating}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile & Tablet Layout - Single Column */}
      <div className="lg:hidden w-full min-h-screen flex flex-col">
        {/* Mobile Welcome Header */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-8 px-4">
          <div className="text-center max-w-sm mx-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border-2 border-white/30"
            >
              <img 
                src="https://i.ibb.co/6Rrfr3gS/kpmg-logo-black-and-white.png" 
                alt="KPMG Logo" 
                className="w-8 h-8 object-contain filter brightness-0 invert"
              />
            </motion.div>
            <h1 className="text-2xl font-bold mb-1">KPMG ESG Analytics</h1>
            <p className="text-blue-100 text-sm">
              {loginType === 'user' ? 'User Portal' : 'Admin Control Panel'}
            </p>
          </div>
        </div>

        {/* Mobile Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 py-8 bg-white">
          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={`mobile-form-${loginType}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <LoginForm
                  loginType={loginType}
                  username={username}
                  password={password}
                  showPassword={showPassword}
                  error={error}
                  isLoading={isLoading}
                  onUsernameChange={setUsername}
                  onPasswordChange={setPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                  onSubmit={handleSubmit}
                  onFillDemo={fillDemoCredentials}
                  onSwitchType={switchLoginType}
                  isAnimating={isAnimating}
                  isMobile={true}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;