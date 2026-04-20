import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <div className="container mx-auto px-6 py-8 flex items-center justify-between text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} Listiq</div>
        <div className="flex gap-4">
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
        </div>
      </div>
    </footer>
  )
}
