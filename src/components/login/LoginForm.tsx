import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, User, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  loginType: 'user' | 'admin';
  username: string;
  password: string;
  showPassword: boolean;
  error: string;
  isLoading: boolean;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFillDemo: () => void;
  onSwitchType: () => void;
  isAnimating: boolean;
  isMobile?: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginType,
  username,
  password,
  showPassword,
  error,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onFillDemo,
  onSwitchType,
  isAnimating,
  isMobile = false
}) => {
  return (
    <div className="w-full">
      {/* Desktop Header - Only show on desktop */}
      {!isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex justify-center mb-6"
          >
            <img 
              src="https://i.ibb.co/6Rrfr3gS/kpmg-logo-black-and-white.png" 
              alt="KPMG Logo" 
              className="w-16 h-16 object-contain filter drop-shadow-lg"
            />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {loginType === 'user' ? 'User Login' : 'Admin Login'}
          </h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '3rem' }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"
          />
        </motion.div>
      )}

      {/* Mobile Header - Only show on mobile */}
      {isMobile && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {loginType === 'user' ? 'User Login' : 'Admin Login'}
          </h2>
          <div className="h-0.5 w-12 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Username Field */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: isMobile ? 0.1 : 0.3, duration: 0.6 }}
          className="relative group"
        >
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            className="w-full px-0 py-3 text-base border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-300 bg-transparent placeholder-gray-400 group-hover:border-gray-400"
            placeholder="Username"
            required
          />
          <User className="absolute right-0 top-3 h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" />
        </motion.div>

        {/* Password Field */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: isMobile ? 0.2 : 0.4, duration: 0.6 }}
          className="relative group"
        >
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            className="w-full px-0 py-3 text-base border-0 border-b-2 border-gray-300 focus:border-blue-600 focus:outline-none transition-all duration-300 bg-transparent placeholder-gray-400 pr-10 group-hover:border-gray-400"
            placeholder="Password"
            required
          />
          <motion.button
            type="button"
            onClick={onTogglePassword}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-0 top-3 text-gray-400 hover:text-blue-600 transition-colors duration-300"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </motion.button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg border-l-4 border-red-500"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Login Button */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isMobile ? 0.3 : 0.5, duration: 0.6 }}
          whileHover={{ 
            y: -3, 
            boxShadow: '0 15px 35px rgba(59, 130, 246, 0.4)',
            scale: 1.02
          }}
          whileTap={{ scale: 0.98, y: -1 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
              <span>Signing in...</span>
            </div>
          ) : (
            'LOGIN'
          )}
        </motion.button>

        {/* Switch Login Type */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isMobile ? 0.4 : 0.6, duration: 0.6 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-gray-600 mb-3">
            {loginType === 'user' ? "Need admin access?" : "Regular user?"}
          </p>
          <motion.button
            type="button"
            onClick={onSwitchType}
            disabled={isAnimating}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-2 text-sm text-blue-600 hover:text-blue-700 font-semibold transition-all duration-300 hover:bg-blue-50 rounded-full border-2 border-blue-600 hover:border-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loginType === 'user' ? 'Switch to Admin' : 'Switch to User'}
          </motion.button>
        </motion.div>
      </form>

      {/* Demo Credentials */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isMobile ? 0.5 : 0.7, duration: 0.6 }}
        className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-300"
      >
        <p className="text-xs text-gray-600 mb-2 font-medium">Demo Credentials:</p>
        <motion.button
          type="button"
          onClick={onFillDemo}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300"
        >
          Click to fill {loginType} credentials
        </motion.button>
        <div className="text-xs text-gray-500 mt-2 font-mono bg-white p-2 rounded border">
          {loginType === 'user' ? 'Username: user | Password: user123' : 'Username: admin | Password: admin123'}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;