import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <header className="w-full py-4 bg-background/60 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-foreground">Listiq</Link>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm"><Link href="/signin">Sign In</Link></Button>
          <Button asChild size="sm"><Link href="/get-started">Get Started</Link></Button>
        </div>
      </div>
    </header>
  )
}
