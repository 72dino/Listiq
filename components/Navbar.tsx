import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Navbar() {
  return (
    <header className="w-full py-4 bg-background/60 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-foreground">Listiq</Link>
        <div className="flex items-center gap-3">
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">Sign In</Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">Get Started</Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <Link href="/generate">
              <Button variant="ghost" size="sm">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>

        </div>
      </div>
    </header>
  )
}
