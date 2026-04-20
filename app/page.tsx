import React from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-6 py-20">
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  )
}
