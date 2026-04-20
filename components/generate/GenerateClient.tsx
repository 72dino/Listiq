"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Tabs from '@/components/ui/tabs'

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

  const [loading, setLoading] = useState(false)
  const [copiedText, setCopiedText] = useState("")

  const commonFeature = ["Parking", "Balcony", "New Construction", "Elevator", "AC", "Furnished", "Renovated", "Garden"];

  const addFeatures = (tag: string) => {
    const currentFeatures = form.features;
    if(!currentFeatures.toLowerCase().includes(tag.toLowerCase())) {
      const newValue = currentFeatures === '' ? tag : `${currentFeatures}, ${tag}`;
      setForm(s => ({...s, features: newValue}));
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleGenerate() {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setOutputs({
        listing: data.listing || 'No listing returned',
        buyer: data.buyer || 'No buyer email returned',
        seller: data.seller || 'No seller email returned',
        followup: data.followup || 'No follow-up returned'
      })
    } catch (err) {
      console.error(err)
      alert('Error generating content.')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string, type: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(type)
      setTimeout(() => setCopiedText(""), 2000)
    } catch (e) {
      console.error('copy failed', e)
    }
  }

  const tabs = [
    { key: 'listing', label: 'Listing Description', content: (
      <div className="space-y-2">
        <Textarea value={outputs.listing} readOnly className="min-h-[200px]" />
        <div className="text-right">
          <Button onClick={() => copyToClipboard(outputs.listing, 'listing')}>
            {copiedText === 'listing' ? 'Copied! ✓' : 'Copy'}
          </Button>
        </div>
      </div>
    ) },
    { key: 'buyer', label: 'Buyer Email', content: (
      <div className="space-y-2">
        <Textarea value={outputs.buyer} readOnly className="min-h-[200px]" />
        <div className="text-right">
          <Button onClick={() => copyToClipboard(outputs.buyer, 'buyer')}>
            {copiedText === 'buyer' ? 'Copied! ✓' : 'Copy'}
          </Button>
        </div>
      </div>
    ) },
    { key: 'seller', label: 'Seller Email', content: (
      <div className="space-y-2">
        <Textarea value={outputs.seller} readOnly className="min-h-[200px]" />
        <div className="text-right">
          <Button onClick={() => copyToClipboard(outputs.seller, 'seller')}>
            {copiedText === 'seller' ? 'Copied! ✓' : 'Copy'}
          </Button>
        </div>
      </div>
    ) },
    { key: 'followup', label: 'Follow-up Message', content: (
      <div className="space-y-2">
        <Textarea value={outputs.followup} readOnly className="min-h-[200px]" />
        <div className="text-right">
          <Button onClick={() => copyToClipboard(outputs.followup, 'followup')}>
            {copiedText === 'followup' ? 'Copied! ✓' : 'Copy'}
          </Button>
        </div>
      </div>
    ) }
  ]

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Property Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground block mb-1">Property Type</label>
              <select 
                name="propertyType" 
                value={form.propertyType} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background text-sm"
              >
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
                <option>Commercial</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1">Location</label>
              <Input name="location" value={form.location} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Size (m²)</label>
                <Input name="size" type="number" value={form.size} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Bedrooms</label>
                <Input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-1">Bathrooms</label>
                <Input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1">Price (€)</label>
              <Input name="price" type="number" value={form.price} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-2">Special Features</label>
              <div className='flex flex-wrap gap-2 mb-3'>
                {commonFeature.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addFeatures(tag)}
                    className="px-3 py-1 text-[11px] font-medium rounded-md border border-gray-200 bg-white hover:border-black hover:bg-gray-50 transition-all text-gray-600"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
              <Textarea name="features" value={form.features} onChange={handleChange} />
            </div>

            <div>
              <label className="text-sm text-muted-foreground block mb-1">Language</label>
              <select 
                name="language" 
                value={form.language} 
                onChange={handleChange}
                className="w-full p-2 border rounded-md bg-background text-sm"
              >
                <option>English</option>
                <option>Bosnian/Croatian/Serbian</option>
              </select>
            </div>

            <Button onClick={handleGenerate} className="w-full mt-4" disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Generated Output</h2>
          <Tabs items={tabs} />
        </Card>
      </div>
    </div>
  )
}
