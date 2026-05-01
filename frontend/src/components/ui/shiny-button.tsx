'use client'

/**
 * @author: @emerald-ui
 * @description: Shiny Button Component - A button with a shiny gradient effect
 * @version: 1.0.0
 * @date: 2026-02-11
 * @license: MIT
 * @website: https://emerald-ui.com
 */
import React from 'react'
import { cn } from "@/lib/utils"

interface ShinyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
}

export function ShinyButton({
  className,
  children = 'Get Started',
  ...props
}: ShinyButtonProps) {
  return (
    <button
      className={cn(
        'h-12 w-max rounded-sm border-none bg-[linear-gradient(325deg,#dc2626_0%,#f87171_55%,#dc2626_90%)] bg-[length:280%_auto] px-6 py-2 font-medium text-white shadow-[0px_0px_20px_rgba(239,68,68,0.5),0px_5px_5px_-1px_rgba(185,28,28,0.25),inset_4px_4px_8px_rgba(252,165,165,0.5),inset_-4px_-4px_8px_rgba(153,27,27,0.35)] transition-[background] duration-700 hover:bg-[position:100%_0%] focus:ring-red-400 focus:ring-offset-1 focus:ring-offset-white focus:outline-none focus-visible:ring-2 dark:focus:ring-red-500 dark:focus:ring-offset-black',
        className
      )}
      type='button'
      {...props}
    >
      {children}
    </button>
  )
}
