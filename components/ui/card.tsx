"use client"

import React from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-6', className)} {...props}>
      {children}
    </div>
  )
}

export default Card
