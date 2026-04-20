import React from 'react'
import { FileText, Mail, Repeat } from 'lucide-react'

const features = [
  {
    title: 'Listing Descriptions',
    desc: 'Generate polished listing descriptions from basic property data in seconds.',
    icon: FileText
  },
  {
    title: 'Buyer & Seller Emails',
    desc: 'Personalized buyer and seller emails tailored to each lead or client.',
    icon: Mail
  },
  {
    title: 'Follow-up Messages',
    desc: 'Automated follow-ups to keep leads warm and close more deals.',
    icon: Repeat
  }
]

export default function Features() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground">Features</h2>
        <p className="text-muted-foreground">Tools built to save agents time and improve messaging.</p>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 px-4">
        {features.map((f) => {
          const Icon = f.icon
          return (
            <div key={f.title} className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-medium text-foreground">{f.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
