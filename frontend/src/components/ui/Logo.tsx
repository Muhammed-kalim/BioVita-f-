import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  iconOnly = false,
  size = 'md' 
}) => {
  const sizes = {
    sm: { icon: 'size-6', text: 'text-base' },
    md: { icon: 'size-8', text: 'text-xl' },
    lg: { icon: 'size-10', text: 'text-2xl' },
    xl: { icon: 'size-12', text: 'text-3xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className={cn("relative flex items-center justify-center shrink-0", currentSize.icon)}>
        {/* Medical Cross Background */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full text-white fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M35 15h30v20h20v30h-20v20h-30v-20h-20v-30h20z" />
        </svg>
        
        {/* Heartbeat Line (ECG) */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full z-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M15 50h15l5-15 10 30 10-40 10 25 10-10h15" 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>
      
      {!iconOnly && (
        <span className={cn("font-black tracking-tighter uppercase text-white", currentSize.text)}>
          BioVita
        </span>
      )}
    </div>
  );
};
