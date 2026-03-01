import { motion, type Variants } from "framer-motion";
import { Building2, Zap, Shield, TrendingUp } from "lucide-react";

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const features = [
    {
      icon: Building2,
      label: "Smart Listings",
      description: "Intelligent property management",
    },
    {
      icon: Zap,
      label: "Fast & Reliable",
      description: "Lightning-fast performance",
    },
    {
      icon: Shield,
      label: "Secure",
      description: "Enterprise-grade security",
    },
    {
      icon: TrendingUp,
      label: "Growth Tools",
      description: "Analytics & insights",
    },
  ];

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-premium flex items-center justify-center px-4 py-20 md:py-32 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-72 h-72 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Main Title */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-gradient mb-6"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Welcome to Los Santos
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Next-generation real estate platform with intelligent property management
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 rounded-xl font-bold text-lg transition-all hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
                className="card-glass rounded-2xl p-6 border border-indigo-200/30 dark:border-indigo-800/30"
              >
                <motion.div
                  animate={{ rotate: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: idx * 0.2 }}
                  className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4"
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.label}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Demo Badge Integration Point */}
        <motion.div
          variants={itemVariants}
          className="mt-12 text-sm text-slate-600 dark:text-slate-400"
        >
          <p>★ Trusted by 1000+ users • 99.9% Uptime SLA • 24/7 Support</p>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default HeroSection;
