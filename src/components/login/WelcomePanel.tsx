import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield } from 'lucide-react';

interface WelcomePanelProps {
  loginType: 'user' | 'admin';
}

const WelcomePanel: React.FC<WelcomePanelProps> = ({ loginType }) => {
  return (
    <motion.div
      className="w-1/2 h-full flex items-center justify-center overflow-hidden relative"
      animate={{
        background: loginType === 'user' 
          ? 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
          : 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)'
      }}
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 18,
        duration: 1.0
      }}
      style={{
        clipPath: loginType === 'user' 
          ? 'polygon(0 0, 85% 0, 100% 100%, 0% 100%)' 
          : 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.3))'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full"
        />
      </div>

      {/* Text Content with Sideways Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${loginType}-text`}
          initial={{ 
            opacity: 0, 
            x: loginType === 'user' ? -100 : 100,
            y: 20
          }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            x: loginType === 'user' ? 100 : -100,
            y: -20
          }}
          transition={{ 
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          className="text-center text-white max-w-md px-8 relative z-10"
        >
          {loginType === 'user' ? (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border-2 border-white/30"
              >
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl font-bold mb-3 tracking-wide"
              >
                WELCOME
              </motion.h1>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl font-semibold mb-6 text-blue-100"
              >
                KPMG ESG Analytics
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-blue-100 text-base leading-relaxed"
              >
                Access your comprehensive ESG dashboard and carbon footprint analytics platform
              </motion.p>
            </>
          ) : (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border-2 border-white/30"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-4xl font-bold mb-3 tracking-wide"
              >
                ADMIN
              </motion.h1>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl font-semibold mb-6 text-blue-100"
              >
                System Control
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-blue-100 text-base leading-relaxed"
              >
                Manage users, monitor system performance, and oversee platform operations
              </motion.p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default WelcomePanel;