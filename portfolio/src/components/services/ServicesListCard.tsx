'use client'

const services = [
  'Strategic Planning',
  'Market Analysis',
  'Finance Planning',
  'Investment Idea',
  'Digital Solutions',
  'Media Marketing',
]

export default function ServicesListCard() {
  return (
    <div className="bg-white shadow rounded-lg p-6 border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Our Services</h3>
      <ul className="space-y-3 text-sm text-gray-700">
        {services.map((service, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center border px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <span>{service}</span>
            <span className="text-yellow-500">→</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
