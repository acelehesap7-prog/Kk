import React from 'react'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive'
  children: React.ReactNode
}

export function Alert({ variant = 'default', className, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={`rounded-lg border p-4 ${
        variant === 'destructive' ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

Alert.Title = function AlertTitle({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`font-medium ${className}`} {...props}>
      {children}
    </div>
  )
}

Alert.Description = function AlertDescription({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mt-1 text-sm ${className}`} {...props}>
      {children}
    </div>
  )
}