//src/components/services/ContactCard.tsx

'use client'

export default function ContactCard() {
  return (
    <div className="bg-white shadow rounded-lg p-6 border text-sm text-gray-700 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
      <div>
        <p className="font-medium">Email Address</p>
        <p>info@yourdomain.com</p>
      </div>
      <div>
        <p className="font-medium">Phone Number</p>
        <p>(+44) 123 456 789</p>
      </div>
      <div>
        <p className="font-medium">Location</p>
        <p>Guild Street 512B, UK</p>
      </div>
    </div>
  )
}
