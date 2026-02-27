import { motion, AnimatePresence } from "framer-motion";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";

interface PremiumPriceSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

export default function PremiumPriceSlider({
  min,
  max,
  value,
  onChange,
  step = 50,
}: PremiumPriceSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<number | null>(null);

  const formatCurrency = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toLocaleString("en-US", {
        maximumFractionDigits: 0,
      })}K`;
    }
    return `$${val.toLocaleString("en-US")}`;
  };

  const handleValueChange = (newValue: number[]) => {
    onChange([newValue[0], newValue[1]]);
  };

  return (
    <div className="relative pt-8 pb-2">
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={handleValueChange}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={2}
        onPointerDown={() => setIsDragging(true)}
        onPointerUp={() => {
          setIsDragging(false);
          setActiveThumb(null);
        }}
      >
        <Slider.Track className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 relative grow rounded-full h-2 shadow-inner">
          <Slider.Range className="absolute bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full h-full shadow-lg" />
        </Slider.Track>

        {/* Min Thumb */}
        <Slider.Thumb
          className="group block w-5 h-5 bg-white shadow-xl rounded-full border-2 border-amber-500 hover:border-amber-600 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-4 focus:ring-amber-200/50 transition-all duration-200 hover:scale-110 active:scale-95 relative"
          onPointerEnter={() => setActiveThumb(0)}
          onPointerLeave={() => !isDragging && setActiveThumb(null)}
        >
          <AnimatePresence>
            {(activeThumb === 0 || isDragging) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold relative">
                  <div className="relative z-10">{formatCurrency(value[0])}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-700 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-500/40 transition-all duration-300" />
        </Slider.Thumb>

        {/* Max Thumb */}
        <Slider.Thumb
          className="group block w-5 h-5 bg-white shadow-xl rounded-full border-2 border-amber-500 hover:border-amber-600 cursor-grab active:cursor-grabbing focus:outline-none focus:ring-4 focus:ring-amber-200/50 transition-all duration-200 hover:scale-110 active:scale-95 relative"
          onPointerEnter={() => setActiveThumb(1)}
          onPointerLeave={() => !isDragging && setActiveThumb(null)}
        >
          <AnimatePresence>
            {(activeThumb === 1 || isDragging) && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
              >
                <div className="bg-gradient-to-br from-amber-600 to-amber-700 text-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold relative">
                  <div className="relative z-10">{formatCurrency(value[1])}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-lg" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-700 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-md group-hover:bg-amber-500/40 transition-all duration-300" />
        </Slider.Thumb>
      </Slider.Root>
    </div>
  );
}
