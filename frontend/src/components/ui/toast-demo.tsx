'use client';

import * as React from 'react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Toaster, { ToasterRef } from '@/components/ui/toast';

type Variant = 'default' | 'success' | 'error' | 'warning';
type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export default function ToasterDemo() {
  const toasterRef = useRef<ToasterRef>(null);

  const showToast = (variant: Variant, position: Position = 'bottom-right') => {
    toasterRef.current?.show({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Notification`,
      message: `This is a ${variant} toast notification.`,
      variant,
      position,
      duration: 3000,
      onDismiss: () =>
        console.log(`${variant} toast at ${position} dismissed`),
    });
  };

  const simulateApiCall = async () => {
    toasterRef.current?.show({
      title: 'Scheduling...',
      message: 'Please wait while we schedule your meeting.',
      variant: 'default',
      position: 'bottom-right',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toasterRef.current?.show({
        title: 'Meeting Scheduled',
        message: 'Your meeting is scheduled for July 4, 2025, at 3:42 PM IST.',
        variant: 'success',
        position: 'bottom-right',
        highlightTitle: true,
        actions: {
          label: 'Undo',
          onClick: () => console.log('Undoing meeting schedule'),
          variant: 'outline',
        },
      });
    } catch (error) {
      toasterRef.current?.show({
        title: 'Error Scheduling Meeting',
        message: 'Failed to schedule the meeting. Please try again.',
        variant: 'error',
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <Toaster ref={toasterRef} />

      <div className="space-y-6 max-w-2xl mx-auto">
        <section>
          <h2 className="text-lg font-semibold mb-4">Toast Variants</h2>
          <div className="flex flex-wrap gap-4">
            {(['default', 'success', 'error', 'warning'] as Variant[]).map((variantKey) => (
              <Button
                key={variantKey}
                variant="outline"
                onClick={() => showToast(variantKey)}
                className={cn(
                  "border-2",
                  variantKey === 'success' && "border-green-600/50 text-green-600",
                  variantKey === 'error' && "border-destructive/50 text-destructive",
                  variantKey === 'warning' && "border-amber-600/50 text-amber-600"
                )}
              >
                {variantKey.charAt(0).toUpperCase() + variantKey.slice(1)} Toast
              </Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Toast Positions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as Position[]).map((positionKey) => (
              <Button
                key={positionKey}
                variant="outline"
                onClick={() => showToast('default', positionKey)}
              >
                {positionKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-4">Real‑World Example</h2>
          <Button
            variant="default"
            onClick={simulateApiCall}
            className="w-full md:w-auto"
          >
            Simulate Meeting Schedule
          </Button>
        </section>
      </div>
    </div>
  );
}

import { cn } from '@/lib/utils';
