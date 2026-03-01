import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

interface DemoBadgeProps {
  className?: string;
  variant?: "top-right" | "bottom-right" | "center";
  showText?: boolean;
}

export function DemoBadge({
  className = "",
  variant = "center",
  showText = true,
}: DemoBadgeProps) {
  const positionClasses = {
    "top-right": "fixed top-6 right-6",
    "bottom-right": "fixed bottom-6 right-6",
    center: "fixed inset-0 flex items-center justify-center",
  };

  if (variant === "center" && showText) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`${positionClasses[variant]} z-50 pointer-events-none`}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-center"
        >
          <div className="inline-block relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-32 h-32 rounded-full border-4 border-indigo-200 border-t-indigo-600"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ShieldCheck className="w-12 h-12 text-indigo-600 mb-2" />
              <p className="text-xs font-bold text-slate-900 dark:text-white text-center px-4">
                Approved by Government
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center px-4 max-w-xs">
                This is a demo project for presentation purposes only.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${positionClasses[variant]} ${className} z-50 pointer-events-none`}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="card-glass rounded-2xl p-4 backdrop-blur-xl border border-indigo-200/50 dark:border-indigo-800/50 bg-white/80 dark:bg-slate-900/80 shadow-lg"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
          </motion.div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">
              Approved by Government
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
              Demo project
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default DemoBadge;
