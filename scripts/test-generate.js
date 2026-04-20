(async () => {
  try {
    const res = await fetch('http://localhost:3003/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyType: 'Apartment',
        location: 'Sarajevo',
        size: '75',
        bedrooms: '2',
        bathrooms: '1',
        price: '120000',
        features: 'parking, balcony',
        language: 'English'
      })
    })
    console.log('STATUS', res.status)
    const text = await res.text()
    console.log(text)
  } catch (err) {
    console.error('FETCH ERROR', err)
  }
})()
