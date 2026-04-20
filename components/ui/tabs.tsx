"use client"

import React from 'react'
import { cn } from '@/lib/utils'

type TabItem = {
  key: string
  label: string
  content: React.ReactNode
}

export function Tabs({ items, defaultIndex = 0 }: { items: TabItem[]; defaultIndex?: number }) {
  const [index, setIndex] = React.useState<number>(defaultIndex)

  return (
    <div>
      <div className="flex gap-2" role="tablist">
        {items.map((it, i) => (
          <button
            key={it.key}
            role="tab"
            aria-selected={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              'px-3 py-1 rounded-md text-sm',
              i === index ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground border border-border'
            )}
          >
            {it.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <div className="p-4 border border-border rounded bg-card text-foreground">{items[index].content}</div>
      </div>
    </div>
  )
}

export default Tabs
