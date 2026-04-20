import React from 'react'
import { Button } from '@/components/ui/button'

export default function Hero() {
  return (
    <section className="text-center max-w-3xl mx-auto py-12">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">Write Real Estate Listings in 30 Seconds</h1>
      <p className="text-lg text-muted-foreground mb-8">AI-powered descriptions, emails and follow-ups — built for real estate agents</p>
      <div className="flex items-center justify-center gap-4">
        <Button size="lg">Try for Free</Button>
        <Button variant="outline" size="lg">See Demo</Button>
      </div>
    </section>
  )
}
