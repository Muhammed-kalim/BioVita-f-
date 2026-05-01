import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonWithIconProps extends React.ComponentPropsWithoutRef<typeof Button> {
  icon?: LucideIcon;
}

export function ButtonWithIcon({ 
  children, 
  icon: Icon = ArrowUpRight, 
  className, 
  ...props 
}: ButtonWithIconProps) {
  return (
    <Button 
      className={cn(
        "relative text-sm font-medium rounded-full h-12 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer bg-white text-black hover:bg-white/90 border-none flex items-center justify-center isolation-auto",
        className
      )}
      {...props}
    >
      <span className="relative z-10 transition-all duration-500 block truncate">
        {children}
      </span>
      <div className="absolute right-1 top-1/2 -translate-y-1/2 h-[calc(100%-8px)] aspect-square bg-black text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:left-1 group-hover:right-auto group-hover:rotate-45 z-20 shadow-sm">
        <Icon size={16} />
      </div>
    </Button>
  );
}
