"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Tabs from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export default function GenerateClient() {
  const [form, setForm] = useState({
    propertyType: 'Apartment',
    location: 'Sarajevo, Ilidža',
    size: '75',
    bedrooms: '2',
    bathrooms: '1',
    price: '120000',
    features: 'parking, balcony, new renovation',
    language: 'English'
  })

  const [outputs, setOutputs] = useState({
    listing: 'Generate a listing description by clicking Generate.',
    buyer: 'Generate a buyer email by clicking Generate.',
    seller: 'Generate a seller email by clicking Generate.',
    followup: 'Generate follow-up messages by clicking Generate.'
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  function generateMock() {
    // legacy mock retained for fallback; prefer calling the API
    const title = `${form.propertyType} in ${form.location}`
    const listing = `Listing: ${title} — ${form.size} m², ${form.bedrooms} beds, ${form.bathrooms} baths. Features: ${form.features}. Price €${form.price}.`
    const buyer = `Hi,\n\nI saw your listing for ${title} and I'm interested. Could we schedule a viewing?\n\nThanks.`
    const seller = `Hi,\n\nWe can create a compelling listing for your ${form.propertyType} in ${form.location}. Suggested price: €${form.price}.\n\nRegards.`
    const followup = `Hello,\n\nFollowing up on the ${title} listing — let me know if you have questions.`

    setOutputs({ listing, buyer, seller, followup })
  }

  const [loading, setLoading] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Generation failed')
      }

      const data = await res.json()
      setOutputs({
        listing: data.listing || 'No listing returned',
        buyer: data.buyer || 'No buyer email returned',
        seller: data.seller || 'No seller email returned',
        followup: data.followup || 'No follow-up returned'
      })
    } catch (err) {
      console.error(err)
      alert('Error generating content. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      // simple feedback could be added
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  const tabs = [
    { key: 'listing', label: 'Listing Description', content: (
      <div>
        <Textarea value={outputs.listing} readOnly />
        <div className="mt-2 text-right">
          <Button onClick={() => copyToClipboard(outputs.listing)}>Copy</Button>
        </div>
      </div>
    ) },
    { key: 'buyer', label: 'Buyer Email', content: (
      <div>
        <Textarea value={outputs.buyer} readOnly />
        <div className="mt-2 text-right">
          <Button onClick={() => copyToClipboard(outputs.buyer)}>Copy</Button>
        </div>
      </div>
    ) },
    { key: 'seller', label: 'Seller Email', content: (
      <div>
        <Textarea value={outputs.seller} readOnly />
        <div className="mt-2 text-right">
          <Button onClick={() => copyToClipboard(outputs.seller)}>Copy</Button>
        </div>
      </div>
    ) },
    { key: 'followup', label: 'Follow-up Message', content: (
      <div>
        <Textarea value={outputs.followup} readOnly />
        <div className="mt-2 text-right">
          <Button onClick={() => copyToClipboard(outputs.followup)}>Copy</Button>
        </div>
      </div>
    ) }
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Property Details</h2>
          <div className="space-y-3">
            <label className="text-sm text-muted-foreground block">Property Type</label>
            <Select name="propertyType" value={form.propertyType} onChange={handleChange}>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Commercial</option>
            </Select>

            <label className="text-sm text-muted-foreground block">Location</label>
            <Input name="location" value={form.location} onChange={handleChange} />

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground block">Size (m²)</label>
                <Input name="size" type="number" value={form.size} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Bedrooms</label>
                <Input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block">Bathrooms</label>
                <Input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
              </div>
            </div>

            <label className="text-sm text-muted-foreground block">Price (€)</label>
            <Input name="price" type="number" value={form.price} onChange={handleChange} />

            <label className="text-sm text-muted-foreground block">Special features</label>
            <Textarea name="features" value={form.features} onChange={handleChange} />

            <label className="text-sm text-muted-foreground block">Language</label>
            <Select name="language" value={form.language} onChange={handleChange}>
              <option>English</option>
              <option>Bosnian/Croatian/Serbian</option>
            </Select>

            <div className="pt-2">
              <Button onClick={handleGenerate} className="w-full" disabled={loading}>
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-primary" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Generated Output</h2>
          <Tabs items={tabs} />
        </Card>
      </div>
    </div>
  )
}
